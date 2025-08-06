'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Product, User } from '@/payload-types'
import { format, setHours, setMinutes, isBefore, addHours, isToday } from 'date-fns'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import TimeFrameSelector, { TIME_FRAMES, TimeFrame } from './TimeFrameSelector'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
// import { useUserProfile } from '@/hooks/use-auth'

interface BookServiceButtonProps {
  product: Product
  user: User | null
  availability: Product['availability']
}

// const { profile: userProfile } = useUserProfile()

const BookServiceButton = ({
  product,
  user,
  availability: productAvailability,
}: BookServiceButtonProps) => {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

  const getTimeSlotsForDate = (date: Date) => {
    const dayOfWeek = format(date, 'eeee').toLowerCase()
    const typedDay = dayOfWeek as typeof WEEK_DAYS[number]
    const availability = productAvailability?.find(avail => avail.day === typedDay)
    if (!availability) return []

    const slots: string[] = []
    availability.timeSlots.forEach(range => {
      const [sh, sm] = range.startTime.split(':').map(Number)
      const [eh, em] = range.endTime.split(':').map(Number)

      let current = setMinutes(setHours(date, sh), sm)
      const end = setMinutes(setHours(date, eh), em)
      const duration = product.duration || 1

      while (isBefore(current, end)) {
        const next = addHours(current, duration)
        if (isBefore(current, next)) {
          slots.push(`${format(current, 'hh:mm a')} - ${format(next, 'hh:mm a')}`)
        }
        current = next
      }
    })

    return slots
  }

  const getAvailableTimeFrames = (date: Date) => {
    const slots = getTimeSlotsForDate(date)
    const counts = { MORNING: 0, AFTERNOON: 0, EVENING: 0 }

    slots.forEach(slot => {
      const [startTime] = slot.split(' - ')
      const hour = parseInt(startTime.split(':')[0])
      const isPM = startTime.includes('PM')
      const hour24 = isPM && hour !== 12 ? hour + 12 : (isPM ? 12 : hour === 12 ? 0 : hour)

      for (const frameKey in TIME_FRAMES) {
        const tf = frameKey as TimeFrame
        const { start, end } = TIME_FRAMES[tf]
        if (hour24 >= +start.split(':')[0] && hour24 < +end.split(':')[0]) {
          counts[tf]++
        }
      }
    })

    return counts
  }

  const getFilteredTimeSlots = (date: Date, timeFrame: TimeFrame) => {
    const slots = getTimeSlotsForDate(date)
    const { start, end } = TIME_FRAMES[timeFrame]
    const sh = +start.split(':')[0]
    const eh = +end.split(':')[0]

    return slots.filter(slot => {
      const [startTime] = slot.split(' - ')
      const hour = parseInt(startTime.split(':')[0])
      const isPM = startTime.includes('PM')
      const hour24 = isPM && hour !== 12 ? hour + 12 : (isPM ? 12 : hour === 12 ? 0 : hour)
      return hour24 >= sh && hour24 < eh
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!user || !selectedDate || !selectedTime || !selectedTimeFrame || !name) {
      toast.error('Please fill all fields.')
      setIsLoading(false)
      return
    }

    const userId = user.id
    const providerId = typeof product.user === 'string' ? product.user : product.user?.id
    const productId = product.id

    if (!userId || !providerId || !productId) {
      toast.error('Missing user, provider or product ID.')
      setIsLoading(false)
      return
    }

    try {
      const chatRoomId = `chat_${userId}_${providerId}_${productId}`

      await setDoc(doc(db, 'chatRooms', chatRoomId), {
  participants: [userId, providerId],
  productId,
  bookingDate: selectedDate.toISOString(),
  bookingTime: selectedTime,
  customerName: name,
  customerEmail: user.email,
  createdAt: serverTimestamp(),
  productName: product.name,
  // providerName: providerId.name || 'Provider',
  chatRoomName: `${product.name} with ${name || 'Provider'}`,

  bargain: {
    originalPrice: product.price,
    userOffer: product.price,
    providerOffer: product.price,
    confirmations: [],
  },
})

      await setDoc(doc(db, 'chatRooms', chatRoomId, 'messages', 'admin-message'), {
        sender: 'admin',
        message: `Booking Request\nService: ${product.name}\nDate: ${format(selectedDate, 'PPP')}\nTime Frame: ${TIME_FRAMES[selectedTimeFrame].label}\nTime: ${selectedTime}\nCustomer Name: ${name}\nCustomer Email: ${user.email}`,
        createdAt: serverTimestamp(),
      })

      toast.success('Chat room created!')
      window.location.href = `/chat`
    } catch (err) {
      console.error(err)
      toast.error('Failed to create chat room. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Step 1: Select Date */}
        <div className='space-y-2'>
          <Label>Select Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setSelectedTimeFrame(null)
                  setSelectedTime(null)
                  setIsCalendarOpen(false)
                }}
                initialFocus
                disabled={(date) => {
                  const formattedDay = format(date, 'eeee').toLowerCase();
                  const isAvailableDay = productAvailability?.some(avail => avail.day === formattedDay);
                  const isPastDate = isBefore(date, new Date());
                  return !isAvailableDay || isPastDate && !isToday(date);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Step 2: Select Time Frame (only show if date is selected) */}
        {selectedDate && (
          <div className='space-y-2'>
            <Label>Select Time Frame</Label>
            <TimeFrameSelector
              selectedTimeFrame={selectedTimeFrame}
              onTimeFrameSelect={(timeFrame) => {
                setSelectedTimeFrame(timeFrame)
                setSelectedTime(null)
              }}
              availableSlots={getAvailableTimeFrames(selectedDate)}
            />
          </div>
        )}

        {/* Step 3: Select Time Slot (only show if time frame is selected) */}
        {selectedDate && selectedTimeFrame && (
          <div className='space-y-2'>
            <Label>Select Time</Label>
            <div className='grid grid-cols-3 gap-2'>
              {getFilteredTimeSlots(selectedDate, selectedTimeFrame).map((time) => (
                <Button
                  key={time}
                  type='button'
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedTime(time)}
                  className='w-full'
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Contact Info (only show if time is selected) */}
        {selectedTime && (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Your Name</Label>
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Booking Summary */}
            <div className='rounded-lg border p-4 space-y-2'>
              <h3 className='font-medium'>Booking Summary</h3>
              <p className='text-sm text-muted-foreground'>
                <strong>Service:</strong> {product.name}
              </p>
              <p className='text-sm text-muted-foreground'>
                <strong>Date:</strong>{' '}
                {selectedDate &&
                  new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
              </p>
              <p className='text-sm text-muted-foreground'>
                <strong>Time Frame:</strong> {selectedTimeFrame && TIME_FRAMES[selectedTimeFrame].label}
              </p>
              <p className='text-sm text-muted-foreground'>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p className='text-sm text-muted-foreground'>
                <strong>Email:</strong> {user?.email}
              </p>

              {/* {userProfile && (
                <>
                  <p className='text-sm text-muted-foreground'>
                    <strong>Address:</strong> {userProfile.address}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    <strong>Pincode:</strong> {userProfile.pincode}
                  </p>
                </>
              )} */}
            
            </div>
            

            <div className='flex gap-2'>
              <Button
                type='submit'
                className='flex-1'
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Start Chat With Seller'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowForm(false)}
                className='flex-1'
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default BookServiceButton
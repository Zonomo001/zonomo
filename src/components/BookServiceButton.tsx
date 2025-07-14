'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Product, User } from '@/payload-types'
import { format, addDays, nextDay, parseISO, setHours, setMinutes, isBefore, addHours, isValid, isToday, isAfter } from 'date-fns'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRPCError } from '@trpc/server'
import TimeFrameSelector, { TIME_FRAMES, TimeFrame } from './TimeFrameSelector'
import { useCart } from '@/hooks/use-cart'

interface BookServiceButtonProps {
  product: Product;
  user: User | null;
  availability: Product['availability'];
}

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

  const { addItem } = useCart()

  const { mutate: createBooking, isLoading: isCreatingBooking } = trpc.booking.createBooking.useMutation({
    onSuccess: () => {
      toast.success('Booking request sent successfully!')
      setShowForm(false)
      setSelectedDate(undefined)
      setSelectedTime(null)
      setName('')
      setIsLoading(false)
    },
    onError: (err: TRPCError) => {
      toast.error('Failed to send booking request.', {
        description: err.message,
      })
      setIsLoading(false)
    },
  })

  const WEEK_DAYS = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;

  // Helper to convert day name to date-fns day index
  const getDayIndex = (dayName: string) => {
    const index = WEEK_DAYS.indexOf(dayName.toLowerCase() as typeof WEEK_DAYS[number]);
    return index !== -1 ? index : -1;
  };

  // Generate upcoming dates based on available days
  const getAvailableCalendarDates = () => {
    const dates: Date[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day

    const availableDayNames = Array.from(new Set(productAvailability?.map(a => a.day))) || []

    // Look for upcoming dates for the next 12 months
    for (let i = 0; i < 365; i++) { // Check next 365 days for available days
      const currentDay = addDays(today, i)
      const dayName = format(currentDay, 'eeee').toLowerCase()

      if (availableDayNames.includes(dayName as Product['availability'][number]['day'])) {
        dates.push(currentDay)
      }
    }
    return dates
  }

  const availableCalendarDates = getAvailableCalendarDates()

  const getTimeSlotsForDate = (date: Date) => {
    const dayOfWeek = format(date, 'eeee').toLowerCase();
    
    if (!WEEK_DAYS.includes(dayOfWeek as typeof WEEK_DAYS[number])) {
      return [];
    }

    const typedDayOfWeek = dayOfWeek as Product['availability'][number]['day'];
    const dayAvailability = productAvailability?.find((avail) => avail.day === typedDayOfWeek)

    if (!dayAvailability || dayAvailability.timeSlots.length === 0) {
      return []
    }

    const slots: string[] = []
    dayAvailability.timeSlots.forEach(range => {
      const [startHourStr, startMinuteStr] = range.startTime.split(':').map(s => s.padStart(2, '0'))
      const [endHourStr, endMinuteStr] = range.endTime.split(':').map(s => s.padStart(2, '0'))

      let current = setMinutes(setHours(date, parseInt(startHourStr || '00')), parseInt(startMinuteStr || '00'))
      const end = setMinutes(setHours(date, parseInt(endHourStr || '00')), parseInt(endMinuteStr || '00'))

      const durationInHours = product.duration || 1;

      while (isBefore(current, end)) {
        const potentialNext = addHours(current, durationInHours);
        const actualSlotEnd = isAfter(potentialNext, end) ? end : potentialNext;

        if (isBefore(current, actualSlotEnd)) { // Ensure the slot has a positive duration
          slots.push(`${format(current, 'hh:mm a')} - ${format(actualSlotEnd, 'hh:mm a')}`)
        }
        current = actualSlotEnd // Advance current to the end of the slot just added
      }
    })
    console.log(`Generated slots for ${format(date, 'yyyy-MM-dd')}:`, slots);
    return slots
  }

  const getAvailableTimeFrames = (date: Date) => {
    const slots = getTimeSlotsForDate(date)
    const timeFrames = {
      MORNING: 0,
      AFTERNOON: 0,
      EVENING: 0,
    }

    slots.forEach(slot => {
      const [startTime] = slot.split(' - ')
      const hour = parseInt(startTime.split(':')[0])
      const isPM = startTime.toLowerCase().includes('pm')
      const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour)

      for (const frameKey in TIME_FRAMES) {
        const timeFrame = frameKey as TimeFrame
        const { start, end } = TIME_FRAMES[timeFrame]
        const [startHour] = start.split(':')
        const [endHour] = end.split(':')

        if (hour24 >= parseInt(startHour) && hour24 < parseInt(endHour)) {
          timeFrames[timeFrame]++
          break // Assign to the first matching time frame
        }
      }
    })

    console.log(`Available time frames for ${format(date, 'yyyy-MM-dd')}:`, timeFrames);
    return timeFrames
  }

  const getFilteredTimeSlots = (date: Date, timeFrame: TimeFrame) => {
    const slots = getTimeSlotsForDate(date)
    const { start, end } = TIME_FRAMES[timeFrame]
    const [startHour] = start.split(':')
    const [endHour] = end.split(':')

    return slots.filter(slot => {
      const [startTime] = slot.split(' - ')
      const hour = parseInt(startTime.split(':')[0])
      const isPM = startTime.toLowerCase().includes('pm')
      const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour)

      return hour24 >= parseInt(startHour) && hour24 < parseInt(endHour)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!user) {
      toast.error('You must be logged in to book a service.')
      setIsLoading(false)
      return
    }

    if (!selectedDate || !selectedTime || !selectedTimeFrame) {
      toast.error('Please select a date, time frame, and time slot.')
      setIsLoading(false)
      return
    }

    if (!name) {
      toast.error('Please enter your name.')
      setIsLoading(false)
      return
    }

    addItem(product, format(selectedDate, 'yyyy-MM-dd'), selectedTime, selectedTimeFrame)
    toast.success('Service added to cart!')
    setShowForm(false)
    setSelectedDate(undefined)
    setSelectedTimeFrame(null)
    setSelectedTime(null)
    setName('')
    setIsLoading(false)
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className='w-full'
        size='lg'
      >
        Book Service
      </Button>
    )
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
            </div>

            <div className='flex gap-2'>
              <Button
                type='submit'
                className='flex-1'
                disabled={isLoading || isCreatingBooking}
              >
                {isLoading || isCreatingBooking ? 'Booking...' : 'Start Chat With Seller'}
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
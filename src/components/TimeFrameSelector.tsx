import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sun, Cloud, Moon } from 'lucide-react'

export const TIME_FRAMES = {
  MORNING: { start: '06:00', end: '12:00', label: 'Morning', icon: Sun },
  AFTERNOON: { start: '12:00', end: '16:00', label: 'Afternoon', icon: Cloud },
  EVENING: { start: '16:00', end: '24:00', label: 'Evening', icon: Moon },
} as const

export type TimeFrame = keyof typeof TIME_FRAMES

interface TimeFrameSelectorProps {
  selectedTimeFrame: TimeFrame | null
  onTimeFrameSelect: (timeFrame: TimeFrame) => void
  availableSlots: {
    [key in TimeFrame]: number
  }
}

const TimeFrameSelector = ({
  selectedTimeFrame,
  onTimeFrameSelect,
  availableSlots,
}: TimeFrameSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(TIME_FRAMES).map(([key, { label, icon: Icon }]) => {
        const timeFrame = key as TimeFrame
        const isSelected = selectedTimeFrame === timeFrame
        const slotCount = availableSlots[timeFrame]

        return (
          <Button
            key={timeFrame}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'flex flex-col items-center justify-center p-4 h-auto space-y-2',
              !slotCount && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => slotCount > 0 && onTimeFrameSelect(timeFrame)}
            disabled={!slotCount}
          >
            <Icon className="h-6 w-6" />
            <span className="font-medium">{label}</span>
            <span className="text-sm text-muted-foreground">
              {slotCount} {slotCount === 1 ? 'slot' : 'slots'} available
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default TimeFrameSelector 
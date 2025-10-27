"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[];
  onSelect?: (date: Date | Date[] | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ mode = 'single', selected, onSelect, disabled, className }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const daysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isSelected = (date: Date) => {
      if (!selected) return false;
      if (Array.isArray(selected)) {
        return selected.some(d => d.toDateString() === date.toDateString());
      }
      return selected.toDateString() === date.toDateString();
    };

    const handleDateClick = (date: Date) => {
      if (disabled && disabled(date)) return;

      if (mode === 'single') {
        onSelect?.(date);
      } else if (mode === 'multiple') {
        const selectedArray = Array.isArray(selected) ? selected : [];
        const isAlreadySelected = selectedArray.some(d => d.toDateString() === date.toDateString());

        if (isAlreadySelected) {
          onSelect?.(selectedArray.filter(d => d.toDateString() !== date.toDateString()));
        } else {
          onSelect?.([...selectedArray, date]);
        }
      }
    };

    const renderDays = () => {
      const days = [];
      const totalDays = daysInMonth(currentMonth);
      const firstDay = firstDayOfMonth(currentMonth);

      // Empty cells for days before the first day of month
      for (let i = 0; i < firstDay; i++) {
        days.push(
          <div key={`empty-${i}`} className="h-9 w-9" />
        );
      }

      // Days of the month
      for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const isDisabled = disabled ? disabled(date) : false;
        const selected = isSelected(date);

        days.push(
          <button
            key={day}
            onClick={() => handleDateClick(date)}
            disabled={isDisabled}
            className={cn(
              'h-9 w-9 rounded-md text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:pointer-events-none disabled:opacity-50',
              selected && 'bg-primary text-primary-foreground hover:bg-primary/90',
              !selected && 'text-foreground',
              className
            )}
          >
            {day}
          </button>
        );
      }

      return days;
    };

    return (
      <div ref={ref} className={cn('p-4 bg-card rounded-lg shadow-neomorph', className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="h-9 w-9 text-xs font-medium text-muted-foreground flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export { Calendar };

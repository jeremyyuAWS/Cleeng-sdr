import React, { useState } from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface CalendarProps {
  onDateSelected: (date: Date, timeSlot: string) => void;
  selectedDate?: Date;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelected, 
  selectedDate = new Date(),
  className
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '9:00 AM', available: true },
    { id: '2', time: '9:30 AM', available: true },
    { id: '3', time: '10:00 AM', available: true },
    { id: '4', time: '10:30 AM', available: false },
    { id: '5', time: '11:00 AM', available: true },
    { id: '6', time: '11:30 AM', available: true },
    { id: '7', time: '1:00 PM', available: true },
    { id: '8', time: '1:30 PM', available: false },
    { id: '9', time: '2:00 PM', available: true },
    { id: '10', time: '2:30 PM', available: true },
    { id: '11', time: '3:00 PM', available: true },
    { id: '12', time: '3:30 PM', available: true },
    { id: '13', time: '4:00 PM', available: false },
    { id: '14', time: '4:30 PM', available: true },
  ];

  // Get days in the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  
  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setSelectedTimeSlot(null);
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
    setSelectedTimeSlot(null);
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setSelectedTimeSlot(null);
  };
  
  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    
    if (selectedDay) {
      // Clone the date to avoid mutations
      const selectedDateTime = new Date(selectedDay);
      // Split the time string to get hours and minutes
      const [time, period] = timeSlot.split(' ');
      const [hourStr, minuteStr] = time.split(':');
      
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      
      // Adjust for PM
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      }
      // Adjust for 12 AM
      if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      selectedDateTime.setHours(hour, minute, 0, 0);
      
      onDateSelected(selectedDateTime, timeSlot);
    }
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const isSelectedDate = (date: Date) => {
    if (!selectedDay) return false;
    
    return date.getDate() === selectedDay.getDate() &&
           date.getMonth() === selectedDay.getMonth() &&
           date.getFullYear() === selectedDay.getFullYear();
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={previousMonth}
            icon={<ChevronLeft size={16} />}
          />
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextMonth}
            icon={<ChevronRight size={16} />}
          />
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysInMonth.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  className={`w-full h-full flex items-center justify-center rounded-md text-sm relative
                    ${isToday(day) ? 'text-blue-600 font-bold' : 'text-gray-700'}
                    ${isPastDate(day) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                    ${isSelectedDate(day) ? 'bg-blue-100 text-blue-700' : ''}
                  `}
                  onClick={() => !isPastDate(day) && handleDayClick(day)}
                  disabled={isPastDate(day)}
                >
                  {day.getDate()}
                  {isToday(day) && (
                    <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))}
        </div>
        
        {selectedDay && (
          <div>
            <div className="flex items-center mb-3 text-sm font-medium text-gray-700">
              <Clock size={16} className="mr-2 text-blue-600" />
              Select a time on {selectedDay.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  className={`
                    py-2 px-3 rounded-md text-sm border
                    ${!slot.available 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                      : selectedTimeSlot === slot.time
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }
                  `}
                  onClick={() => slot.available && handleTimeSlotClick(slot.time)}
                  disabled={!slot.available}
                >
                  {slot.time}
                  {!slot.available && <span className="text-xs"> (Unavailable)</span>}
                </button>
              ))}
            </div>
            
            {selectedTimeSlot && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center text-sm font-medium text-blue-800">
                  <CalendarIcon size={16} className="mr-2" />
                  Selected: {selectedDay.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric'
                  })} at {selectedTimeSlot}
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  This time has a 42% higher response rate than average for your target audience.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
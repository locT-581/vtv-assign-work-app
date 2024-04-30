import React, { useState, useEffect } from 'react';

const ClockWidget = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: false };
  const currentTime: string = time.toLocaleTimeString('en-US', options);

  const days: string[] = ['Chủ Nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const day: string = days[time.getDay()];

  const months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const month: string = months[time.getMonth()];

  const currentDayInWeek: string = `${day}`;
  const currentDate: string = `${time.getDate()}.${month}.${time.getFullYear()}`;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-vtv-green rounded-3xl text-white">
      <div className="text-2xl font-regular mb-1">{currentDayInWeek}</div>
      <div className="text-6xl font-bold">{currentTime}</div>
      <div className="text-2xl font-regular mt-1">{currentDate}</div>
    </div>
  );
}

export default ClockWidget;

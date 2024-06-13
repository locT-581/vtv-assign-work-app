import { useState, useEffect } from 'react';

const ClockWidget = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const days: string[] = ['Chủ Nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const day: string = days[time.getDay()];

  const months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const month: string = months[time.getMonth()];

  const currentDayInWeek: string = `${day}`;
  const currentDate: string = `${time.getDate()}.${month}.${time.getFullYear()}`;

  // Get the current hours, minutes, and seconds
  const currentHour: string = String(time.getHours()).padStart(2, '0');
  const currentMinutes: string = String(time.getMinutes()).padStart(2, '0');
  // const currentSeconds: string = String(time.getSeconds()).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center h-full bg-vtv-green rounded-3xl text-white">
      <div className="text-2xl font-regular mb-1 hidden desktop:block">{currentDayInWeek}</div>
      <div className="text-6xl font-bold hidden desktop:block">
        {currentHour}:{currentMinutes}
      </div>
      <div className="text-6xl font-bold desktop:hidden">
        <div>{currentHour}</div>
        <div>{currentMinutes}</div>
      </div>
      <div className="text-base desktop:text-2xl font-regular mt-1">{currentDate}</div>
    </div>
  );
};

export default ClockWidget;

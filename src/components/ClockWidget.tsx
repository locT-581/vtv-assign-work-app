export default function ClockWidget() {
  // const [time, setTime] = useState<Date>(new Date());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  // const options = { hour: 'numeric', minute: '2-digit', hour12: false };
  // const currentTime = time.toLocaleTimeString('en-US', options);

  // const days = ['Chủ Nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  // const day = days[time.getDay()];

  // const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  // const month = months[time.getMonth()];

  // const currentDayInWheek = `${day}`;
  // const currentDate = `${time.getDate()}.${month}.${time.getFullYear()}`;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-vtv-green rounded-3xl">
      <div className="text-2xl font-regular text-white mb-1">Thứ ba</div>
      <div className="text-6xl font-bold text-white">10:57</div>
      <div className="text-2xl font-regular text-white mt-1">23.5.2024</div>
    </div>
  );
}

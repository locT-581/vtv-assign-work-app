const WeatherWidget = () => {
  return (
    <div className=" text-white flex items-center justify-center h-full bg-vtv-red rounded-3xl py-9 px-4">
      <div className="flex w-[60%] h-full">
        <div className="w-[40%] align-middle items-center"></div>
        <div className=" flex-col w-[60%] h-full">
          <div className="w-full h-[70%]">
            <h1>nhiệt độ</h1>
          </div>
          <div className="w-full h-[30%]">
            <h1>Vị trí</h1>
          </div>
        </div>
      </div>
      <div className="text-center flex w-[40%] h-full">
        <div className=" w-full text-center ">
          <h1>Độ ẩm</h1>
        </div>
        <div className=" w-full text-center ">
          <h1>Tốc độ gió</h1>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;

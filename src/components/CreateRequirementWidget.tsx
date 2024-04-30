import React, { useState, useEffect } from 'react';
import { IoAddCircle } from "react-icons/io5";

const CreateRequirementWidget = () => {

  return (
    <div className="grid h-full grid-cols-4 grid-rows-4 gap-2 p-4 rounded-3xl bg-vtv-green">
        <div className="row-span-2 col-span-2 text-6xl text-white">
            <IoAddCircle />
        </div>
  
        <div className="row-start-4 row-span-1 col-span-4">
          <p className="font-semibold text-3xl text-white">Tạo yêu cầu</p>
        </div>
    </div>
  );
}

export default CreateRequirementWidget;

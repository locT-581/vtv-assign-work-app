import React from 'react';
import ClockWidget from '../ClockWidget';
import WeatherWidget from '../WeatherWidget';
import PictureWidget from '../PictureWidget';
import RequirementList from '../pages/RequirementList';

interface AdminWidgetProps {
  children: React.ReactNode;
}

const AdminWidget = (props: AdminWidgetProps) => {
  return (
    <div className="h-full">
      <div className="grid h-full grid-cols-6 grid-rows-5 gap-4">
        <div className="row-span-1 col-span-1">
          <ClockWidget />
        </div>
        <div className="row-span-1 col-span-3 h-full">
          <WeatherWidget />
        </div>
        <div className="row-span-5 col-span-2">
          <RequirementList />
        </div>
        <div className="row-start-2 row-span-3 col-span-4">{props.children}</div>
        <div className="row-start-5 row-span-1 col-span-4 hidden tablet:block">
          <PictureWidget />
        </div>
      </div>
    </div>
  );
};
export default AdminWidget;

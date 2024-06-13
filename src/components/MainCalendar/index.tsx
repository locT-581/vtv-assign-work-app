/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { EventApi, EventClickArg, EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { EventInput } from '@fullcalendar/core';

import { useAppSelector } from '../../redux/hook';

import './index.css';
import { useLocation, useNavigate } from 'react-router-dom';
import PDF from '../pages/PDFPage';

export default function MainCalender() {
  const location = useLocation();
  const navigate = useNavigate();

  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const [events, setEvents] = React.useState<EventInput[]>([]);

  const [month, setMonth] = React.useState<string>((new Date().getMonth() + 1).toString());
  const [year, setYear] = React.useState<string>(new Date().getFullYear().toString());

  useEffect(() => {
    const temp: EventInput[] = [];
    requirements?.forEach((requirement) => {
      if (requirement.status === 'Đã phân công') {
        temp.push({
          id: requirement.id,
          title: requirement.title,
          start: requirement.startDate,
          end: requirement.endDate,
          backgroundColor:
            requirement?.level === 'Cao'
              ? '#f38b8ba8'
              : requirement?.level === 'Trung bình'
              ? '#8ba3f3a1'
              : '#d5d5d599',
        });
      }
    });
    setEvents(temp);
  }, [requirements]);

  const [requirementToPrint, setRequirementToPrint] = React.useState<any[]>([]);
  //filter requirements by month and year
  useEffect(() => {
    const temp: EventInput[] = [];
    requirements?.forEach((requirement) => {
      if (requirement.status === 'Đã phân công') {
        const startDate = new Date(requirement.startDate);

        if (startDate.getMonth() + 1 === +month && startDate.getFullYear() === +year) {
          temp.push({
            ...requirement,
          });
        }
      }
    });
    setRequirementToPrint(temp);
  }, [month, year, requirements]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo.event._def.publicId);

    navigate(`/chi-tiet-yeu-cau/${clickInfo.event._def.publicId}`);
  };

  const handleEvents = (events: EventApi[]) => {
    console.log(events);
  };
  return (
    <div className="demo-app bg-white rounded-3xl">
      <div className="demo-app-main">
        <FullCalendar
          locale={viLocale}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          initialView="dayGridMonth"
          editable={false}
          selectable={false}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
      {location.pathname === '/lich-trinh' && (
        <div className="py-[2rem] w-[20%] pr-4">
          <h2 className="text-center text-xl font-semibold">Tải về pdf lịch phân công</h2>

          <div className="flex flex-col gap-3 mt-4">
            <label htmlFor="date" className="font-semibold">
              Chọn tháng:
            </label>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="1">Tháng 1</option>
              <option value="2">Tháng 2</option>
              <option value="3">Tháng 3</option>
              <option value="4">Tháng 4</option>
              <option value="5">Tháng 5</option>
              <option value="6">Tháng 6</option>
              <option value="7">Tháng 7</option>
              <option value="8">Tháng 8</option>
              <option value="9">Tháng 9</option>
              <option value="10">Tháng 10</option>
              <option value="11">Tháng 11</option>
              <option value="12">Tháng 12</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <label htmlFor="year" className="font-semibold">
              Chọn năm:
            </label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {Array.from(new Array(3), (_, index) => new Date().getFullYear() - index).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-10">
            <PDF requirementToPrint={requirementToPrint} month={month} year={year} />
          </div>
        </div>
      )}
    </div>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  console.log('🚀 ~ renderEventContent ~ eventContent:', eventContent);
  return (
    <>
      {/* <b>{eventContent.timeText}</b> */}
      <div style={{ backgroundColor: eventContent.event.extendedProps.backgroundColor }} className="p-1">
        <i className="capitalize text-black font-normal text-sm">{eventContent.event.title}</i>
      </div>
    </>
  );
}

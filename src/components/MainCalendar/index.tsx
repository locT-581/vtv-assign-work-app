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

export default function MainCalender() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const [events, setEvents] = React.useState<EventInput[]>([]);

  useEffect(() => {
    const temp: EventInput[] = [];
    requirements?.forEach((requirement) => {
      temp.push({
        id: requirement.id,
        title: requirement.title,
        start: requirement.startDate,
        end: requirement.endDate,
      });
    });
    setEvents(temp);
  }, [requirements]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo.event._def.publicId);
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
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
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
    </div>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </>
  );
}

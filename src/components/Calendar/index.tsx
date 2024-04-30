import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, ButtonGroup } from '@mui/material';
import { useState } from 'react';
// import MonthCalendar from './month';
import { Calendar as CLD, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export interface ICalendarProps {}

export default function Calendar() {
  const localizer = momentLocalizer(moment);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [active, setActive] = useState(0);
  const events = [
    {
      title: 'Meeting',
      start: new Date(2024, 3, 1, 10, 0), // (year, month, day, hour, minute)
      end: new Date(2024, 3, 1, 12, 0),
    },
    {
      title: 'Lunch',
      start: new Date(2024, 3, 2, 12, 0),
      end: new Date(2024, 3, 2, 13, 0),
    },
  ];
  return (
    <div className="flex flex-col gap-4 bg-white rounded-3xl px-8 py-9 h-[60%] ">
      <div className="header flex justify-between items-center flex-wrap">
        <div className="[font-size:_clamp(20px,1.7vw,6em)] text-black font-semibold">Tháng 9 năm 2024</div>
        <div className="flex gap-4 items-center">
          <button className="!bg-transparent !border !border-[#999999] text-[#999999] !rounded-lg !py-2 !px-2 !text-sm !h-fit ">
            Hôm nay
          </button>
          <div className="flex text-[#999999]">
            <ArrowBackIosNewIcon color="inherit" className="cursor-pointer" />
            <ArrowForwardIosIcon color="inherit" className="cursor-pointer" />
          </div>
        </div>
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          sx={{
            background: '#E4E4E4',
            borderRadius: '4px',
            padding: '1px 2px',
            '& button': {
              color: '#000',
              borderRadius: '4px',
              padding: '2px 12px',
              outline: 'none',
            },
            '& button:hover': {
              background: '#fff',
            },
          }}
        >
          <Button
            sx={{
              background: active === 0 ? '#fff' : 'none',
            }}
          >
            Ngày
          </Button>
          <Button
            sx={{
              background: active === 1 ? '#fff' : 'none',
            }}
          >
            Tuần
          </Button>
          <Button
            sx={{
              background: active === 2 ? '#fff' : 'none',
            }}
          >
            Tháng
          </Button>
        </ButtonGroup>
      </div>
      {/* <div className="relative w-full h-full"> {active === 0 && <MonthCalendar />}</div> */}

      <CLD localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: '1500px' }} />
    </div>
  );
}





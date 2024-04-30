import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export interface IRequirementItemProps {
  title: string;
  avatar: string;
  username: string;
  address: string;
  date: string;
  status: string;
}

export default function RequirementItem(props: IRequirementItemProps) {
  return (
    <div className="cursor-pointer flex flex-col w-full gap-1 rounded-lg bg-[#F5F5F5] p-4 text-black">
      <h2 className="text-black text-base font-semibold">{props.title}</h2>
      <div className="flex gap-1 items-center">
        <img src={props.avatar} alt="" className="w-5 h-5 rounded-full" />
        <p className="text-xs font-medium">{props.username}</p>
      </div>
      <div className="flex mt-3 justify-between">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <div className="flex open:items-center gap-1">
              <LocationOnIcon color="error" sx={{ fontSize: '14px' }} />
              <p className="text-[10px]">{props.address}</p>
            </div>
            <div className="flex items-center gap-1">
              <CalendarTodayIcon color="inherit" sx={{ fontSize: '14px' }} />
              <p className="text-[10px]">{props.date}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <FiberManualRecordIcon color="warning" sx={{ fontSize: '14px' }} />
          <p className="text-[10px]">{props.status}</p>
        </div>
      </div>
    </div>
  );
}

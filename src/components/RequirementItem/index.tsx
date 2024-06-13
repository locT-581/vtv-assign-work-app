import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { RequirementStatus } from '../../types/requirement';

export interface IRequirementItemProps {
  title: string;
  avatar: string;
  username: string;
  address: string;
  date: string;
  status: RequirementStatus;
  onClick?: () => void;
  level: 'Thấp' | 'Trung bình' | 'Cao';
}

export default function RequirementItem(props: IRequirementItemProps) {
  return (
    <div
      onClick={props.onClick}
      className={`cursor-pointer flex flex-col w-full gap-1 rounded-lg  p-4 text-black ${
        props.level === 'Cao' ? 'bg-[#f38b8b68]' : props.level === 'Trung bình' ? 'bg-[#8ba3f371]' : 'bg-[#f5f5f5e8]'
      }`}
    >
      <h2 className="text-black text-base font-semibold capitalize">{props.title}</h2>
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
          <FiberManualRecordIcon
            color={props.status === 'Đã phân công' ? 'success' : props.status === 'Đang chờ' ? 'warning' : 'error'}
            sx={{ fontSize: '14px' }}
          />
          <p className="text-[10px]">{props.status}</p>
        </div>
      </div>
    </div>
  );
}

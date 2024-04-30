import LocationOnIcon from '@mui/icons-material/LocationOn';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useState } from 'react';

export interface ITagProps {
  title: string;
  avatar: string;
  username: string;
  address: string;
  status: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Tag(props: ITagProps) {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  return (
    <div
      style={props.style}
      onMouseEnter={() => {
        setShowDetail(true);
      }}
      onMouseLeave={() => {
        setShowDetail(false);
      }}
      className={
        'cursor-pointer  flex flex-col max-w-[350px] w-full gap-1 rounded-lg py-2 px-4 text-black ' + props.className
      }
    >
      <h2 className="text-black text-sm font-semibold">{props.title}</h2>
      {showDetail && (
        <>
          <div className="flex gap-1 items-center ">
            <img src={props.avatar} alt="" className="w-3 h-3 rounded-full" />
            <p className="text-[10px] font-medium">{props.username}</p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex open:items-center gap-1">
              <LocationOnIcon color="error" sx={{ fontSize: '10px' }} />
              <p className="text-[10px]">{props.address}</p>
            </div>
            <div className="flex gap-1">
              <FiberManualRecordIcon color="warning" sx={{ fontSize: '10px' }} />
              <p className="text-[10px]">{props.status}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

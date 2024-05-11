import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../redux/hook';

export interface ITagProps {
  avatar: string;
  content: string;
  backgroundColor?: string;
  onClickRemove?: () => void;
}

export default function Tag(props: ITagProps) {
  const { user } = useAppSelector((state) => state.userSlice);
  return (
    <div
      className="relative h-fit flex gap-2 items-center justify-center rounded-xl px-2 py-2 text-sm cursor-default"
      style={{ background: props.backgroundColor + '88' }}
    >
      <div
        onClick={props.onClickRemove}
        className={`absolute z-10 -top-1 -right-1 bg-[#999] rounded-full w-3 h-3 flex justify-center items-center text-white text-xs aspect-square ${
          user?.isAdmin ? 'cursor-pointer' : 'hidden'
        }`}
      >
        <CloseIcon sx={{ width: '10px', height: '10px' }} />
      </div>
      <img src={props.avatar} alt="" className="w-5 h-5 rounded-full shadow-sm" />
      <p>{props.content}</p>
    </div>
  );
}

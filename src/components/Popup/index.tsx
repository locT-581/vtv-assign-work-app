import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { switchPopup } from '../../redux/reducers/commonSlice';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Popup() {
  const { isShowPopup, popupElement } = useAppSelector((state) => state.commonSlice);
  const dispatch = useAppDispatch();
  return (
    isShowPopup && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
        <div className="flex flex-col gap-4 w-fit h-fit bg-white p-12 rounded-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-fit cursor-pointer flex float-right text-[#999999]"
            onClick={() => dispatch(switchPopup({ isShowPopup: false }))}
          >
            <ArrowBackIosNewIcon color="inherit" />
            <p>Quay lại</p>
          </div>
          <div className="w-fit">{popupElement}</div>
        </div>
      </div>
    )
  );
}

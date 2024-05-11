import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { switchPopup } from '../../../redux/reducers/commonSlice';
import DefaultLayout from '../../layouts/DefaultLayout';
import RequirementList from '../RequirementList';
import { getAllRequirementAsync } from '../../../redux/reducers/requirementSlice';
import ClockWidget from '../../ClockWidget';
import WeatherWidget from '../../WeatherWidget';
import PictureWidget from '../../PictureWidget';
import CreateRequirementWidget from '../../CreateRequirementWidget';
import MainCalendar from '../../MainCalendar';
import { Link } from 'react-router-dom';

export interface IUserHomeProps {}

export default function UserHome() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && !requirements) dispatch(getAllRequirementAsync({ userId: user.id }));

    return () => {
      dispatch(switchPopup({ isShowPopup: false, popupElement: null }));
    };
  }, [dispatch, requirements, user]);

  return (
    <DefaultLayout>
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
          <div className="row-start-2 row-span-3 col-span-4">
            <MainCalendar />
          </div>
          <div className="row-start-5 row-span-1 col-span-1">
            <Link to="/tao-yeu-cau-moi">
              <CreateRequirementWidget />
            </Link>
          </div>
          <div className="row-start-5 col-start-2 row-span-1 col-span-3">
            <PictureWidget />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

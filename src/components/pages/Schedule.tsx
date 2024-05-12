import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import { switchPopup } from '../../redux/reducers/commonSlice';
import MainCalendar from '../MainCalendar';
import DefaultLayout from '../layouts/DefaultLayout';

export interface ScheduleProps {}

export default function Schedule() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (user && !requirements) dispatch(getAllRequirementAsync({ userId: null }));

    return () => {
      dispatch(switchPopup({ isShowPopup: false, popupElement: null }));
    };
  }, [dispatch, requirements, user]);
  return (
    <DefaultLayout>
      <MainCalendar />
    </DefaultLayout>
  );
}

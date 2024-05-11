import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import AdminWidget from '../../AdminWidget';
import DefaultLayout from '../../layouts/DefaultLayout';
import MainCalendar from '../../MainCalendar';
import { getAllRequirementAsync } from '../../../redux/reducers/requirementSlice';
import { switchPopup } from '../../../redux/reducers/commonSlice';

export interface IAdminHomeProps {}

export default function AdminHome() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && !requirements) dispatch(getAllRequirementAsync({ userId: null }));

    return () => {
      dispatch(switchPopup({ isShowPopup: false, popupElement: null }));
    };
  }, [dispatch, requirements, user]);

  return (
    <DefaultLayout>
      <AdminWidget>
        <MainCalendar />
      </AdminWidget>
    </DefaultLayout>
  );
}

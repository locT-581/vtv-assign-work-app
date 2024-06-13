import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import AdminWidget from '../../AdminWidget';
import DefaultLayout from '../../layouts/DefaultLayout';
import MainCalendar from '../../MainCalendar';
import { getAllRequirementAsync } from '../../../redux/reducers/requirementSlice';
import { switchPopup } from '../../../redux/reducers/commonSlice';
import { getAllUsers } from '../../../apis/userAPI';
import { User } from '../../../types/user';

export interface IAdminHomeProps {}

export default function AdminHome() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();

  const [allUser, setAllUser] = useState<User[]>([]);

  useEffect(() => {
    if (user && !requirements) dispatch(getAllRequirementAsync({ userId: null }));

    if (allUser.length === 0) {
      getAllUsers().then((users: User[] | null) => {
        console.log('🚀 ~ getUserById ~ user:', users);
        if (users) setAllUser(users);
        else setAllUser([]);
      });
    }
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

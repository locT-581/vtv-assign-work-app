import { useAppSelector } from '../../redux/hook';
import AdminSideBar from '../SideBar/AdminSidebar';
import UserSidebar from '../SideBar/UserSidebar';

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { user } = useAppSelector((state) => state.userSlice);
  return (
    <section className="flex h-full w-screen">
      {user?.isAdmin ? <AdminSideBar /> : <UserSidebar />}
      <div className="w-full px-4 py-8 ">{props.children}</div>
    </section>
  );
}

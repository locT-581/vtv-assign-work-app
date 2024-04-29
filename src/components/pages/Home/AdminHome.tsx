import AdminWidget from '../../AdminWidget';
import DefaultLayout from '../../layouts/DefaultLayout';

export interface IAdminHomeProps {}

export default function AdminHome() {
  return (
    <DefaultLayout>
      <AdminWidget></AdminWidget>
    </DefaultLayout>
  );
}

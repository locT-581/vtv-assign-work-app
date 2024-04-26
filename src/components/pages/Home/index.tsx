import { lazy, useEffect } from 'react';
import { auth } from '../../../configs/firebase';
import { useNavigate } from 'react-router-dom';

const AdminHome = lazy(() => import('./AdminHome'));
const UserHome = lazy(() => import('./UserHome'));

export interface HomeProps {}

export default function Home() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    auth.authStateReady().then(() => {
      !auth.currentUser && (navigate('/dang-nhap'), { replace: true });
    });
  }, [user, navigate]);

  // Check if user is admin
  return user?.uid === import.meta.env.VITE_USER_ID ? <AdminHome /> : <UserHome />;
}

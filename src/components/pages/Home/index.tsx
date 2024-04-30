import { lazy, useEffect, useState } from 'react';
import { auth } from '../../../configs/firebase';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';

const AdminHome = lazy(() => import('./AdminHome'));
const UserHome = lazy(() => import('./UserHome'));

export interface HomeProps {}

export default function Home() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userState, setUserState] = useState<User | null>(null);

  useEffect(() => {
    auth.authStateReady().then(() => {
      setUserState(auth.currentUser);
      !auth.currentUser && (navigate('/dang-nhap'), { replace: true });
    });
  }, [user, navigate]);

  // Check if user is admin
  return userState ? userState?.uid === import.meta.env.VITE_USER_ID ? <AdminHome /> : <UserHome /> : null;
}

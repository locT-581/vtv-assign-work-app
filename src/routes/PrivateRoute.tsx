import { Navigate } from 'react-router-dom';
import { auth } from '../configs/firebase'
import { ReactElement } from 'react';

const PrivateRoute = ({ children }:{children: ReactElement}) => {
  const user = auth.currentUser;
  return user?.uid === import.meta.env.VITE_USER_ID ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;

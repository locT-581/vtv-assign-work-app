import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { Suspense, lazy, useEffect } from 'react';
import PrivateRoute from './routes/PrivateRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './configs/firebase';
import { useAppDispatch } from './redux/hook';
import { clearUser, getUserByIdAsync } from './redux/reducers/userSlice';

const Home = lazy(() => import('./components/pages/Home'));
const Login = lazy(() => import('./components/pages/Login'));
const MyRequirements = lazy(() => import('./components/pages/MyRequirements'));
const Schedule = lazy(() => import('./components/pages/Schedule'));

const RequirementList = lazy(() => import('./components/pages/RequirementList'));
const UserList = lazy(() => import('./components/pages/UserList'));
const RequirementDetail = lazy(() => import('./components/pages/RequirementDetail'));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Như là người quan sát trạng thái của user có đăng nhập hay đăng xuất không
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in');
        dispatch(getUserByIdAsync(user.uid));
      } else {
        dispatch(clearUser());
      }
    });
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading</div>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/yeu-cau-cua-toi" element={<MyRequirements />} />
          <Route path="/lich-trinh" element={<Schedule />} />

          <Route path="*" element={<div>Not found</div>} />

          <Route
            path="/danh-sach-yeu-cau"
            element={
              <PrivateRoute>
                <RequirementList />
              </PrivateRoute>
            }
          />
          <Route
            path="/danh-sach-nguoi-dung"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/chi-tiet-yeu-cau/:id"
            element={
              <PrivateRoute>
                <RequirementDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;

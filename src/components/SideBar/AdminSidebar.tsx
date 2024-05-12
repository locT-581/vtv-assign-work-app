import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../apis/userAPI';
import getIcon from '../../utils/getIcon';
import { useAppSelector } from '../../redux/hook';

import { FaUserAlt, FaCheckCircle, FaRegCalendarCheck } from 'react-icons/fa';

export default function AdminSideBar() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.userSlice);

  const handleSignOut = () => {
    logout()
      .then(() => {
        console.log('Sign Out');
        navigate('/');
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="sidebar w-1/4">
      <div className="sidebarinside">
        <div className="logo-placeholder">
          <img src={getIcon('logoVTV')} alt="logo" className="logosidebar" />
        </div>
        <div className="title text-vtv-blue">
          <p className="text-3xl font-medium">Xin Chào,</p>
          <p className="text-7xl font-bold">{user?.fullName.split(' ')[user?.fullName.split(' ').length - 1]}</p>
        </div>
        <ul>
          <li className="flex justify-start items-center">
            <FaUserAlt className="mr-2" />
            <Link to="/danh-sach-nguoi-dung">Quản lý người dùng</Link>
          </li>
          <li className="flex justify-start items-center">
            <FaCheckCircle className="mr-2" />
            <Link to="/quan-ly-phuong-tien">Quản lý phương tiện</Link>
          </li>
          <li className="flex justify-start items-center">
            <FaRegCalendarCheck className="mr-2" />
            <Link to="/lich-trinh">Lịch trình</Link>
          </li>
        </ul>
        <div className="logout-button">
          <button onClick={handleSignOut}>Đăng xuất</button>
        </div>
        <div>
          <h6>VTVapp v1.0</h6>
        </div>
      </div>
    </div>
  );
}

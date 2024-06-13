import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { logout } from '../../apis/userAPI';
import getIcon from '../../utils/getIcon';
import { useAppSelector } from '../../redux/hook';

import { FaUserAlt, FaCheckCircle, FaRegCalendarCheck, FaHome, FaSignOutAlt } from 'react-icons/fa';

const UserSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.userSlice);

  const handleSignOut = () => {
    logout()
      .then(() => {
        console.log('Sign Out');
        navigate('/dang-nhap');
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="sidebar w-[8vh] desktop:w-1/5">
      <div className="px-4 py-12 desktop:px-8 h-full flex flex-col justify-between">
        <div className="logo-placeholder">
          <img src={getIcon('logoVTV')} alt="logo" className="logosidebar" />
        </div>
        <div className="title text-vtv-blue hidden desktop:block">
          <p className="text-3xl font-medium">Xin Chào,</p>
          <p className="text-7xl font-bold">{user?.fullName.split(' ')[user?.fullName.split(' ').length - 1]}</p>
        </div>
        <ul className="flex-row items-center">
          <li className="flex justify-center items-center desktop:justify-start">
            <Link to="/" className="flex items-center my-2">
              <FaHome className="desktop:mr-4" />
              <h2 className="hidden desktop:block text-xl">Trang chủ</h2>
            </Link>
          </li>
          <li className="flex justify-center items-center desktop:justify-start">
            <Link to="/thong-tin-tai-khoan" className="flex items-center my-2">
              <FaUserAlt className="desktop:mr-4" />
              <h2 className="hidden desktop:block text-xl">Thông tin tài khoản</h2>
            </Link>
          </li>
          <li className="flex justify-center items-center desktop:justify-start">
            <Link to="/yeu-cau-cua-toi" className="flex items-center my-2">
              <FaCheckCircle className="desktop:mr-4" />
              <h2 className="hidden desktop:block text-xl">Yêu cầu của tôi</h2>
            </Link>
          </li>
          <li className="flex justify-center items-center desktop:justify-start">
            <Link to="/lich-trinh" className="flex items-center my-2">
              <FaRegCalendarCheck className="desktop:mr-4" />
              <h2 className="hidden desktop:block text-xl">Lịch trình sắp tới</h2>
            </Link>
          </li>
        </ul>
        <div className="mt-auto flex justify-center">
          <button onClick={handleSignOut} className="hidden desktop:block">
            Đăng xuất
          </button>
          <FaSignOutAlt onClick={handleSignOut} className="desktop:hidden" />
        </div>
        <div>
          <h6>VTVapp v1.0</h6>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

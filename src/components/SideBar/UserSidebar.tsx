import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { logout } from '../../apis/userAPI';
import getIcon from '../../utils/getIcon';
import { useAppSelector } from '../../redux/hook';

const UserSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.userSlice);

  const handleSignOut = () => {
    logout()
      .then(() => {
        console.log('Sign Out');
        navigate('/dang-nhap');
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="sidebar">
      <div className="sidebarinside">
        <div className="logo-placeholder">
          <img src={getIcon('logoVTV')} alt="logo" className="logosidebar" />
        </div>
        <div className="title !mb-2">
          <h2>Xin Chào,</h2>
          <h1>{user?.fullName?.split(' ')[user?.fullName?.split(' ').length - 1]}</h1>
        </div>
        <ul>
          <li>
            <Link to="/xem-yeu-cau">Xem yêu cầu</Link>
          </li>
          <li>Menu Item 2</li>
          <li>Menu Item 3</li>
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
};

export default UserSidebar;

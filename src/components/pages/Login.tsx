import getIcon from '../../utils/getIcon';

import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../apis/userAPI';
import { useAppSelector } from '../../redux/hook';

export interface LoginProps {}

export default function Login() {
  const { user } = useAppSelector((state) => state.userSlice);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    if (!email || !password) return;
    login({ email, password }).then(() => navigate('/'));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event?.target?.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  return (
    <div
      className="bg-cover h-screen w-screen items-center justify-center flex"
      style={{ backgroundImage: "url('/src/assets/img/BG-TD.jpg')" }}
    >
      <div className="justify-center flex flex-col text-center  w-1/4">
        <img src={getIcon('logoVTV')} alt="logo" className=" h-24 px-4" />
        <form>
          <div className="Card w-full p-8 mt-6">
            <p className="text-4xl font-semibold text-3xl text-vtv-blue">Chào mừng!</p>
            <p className="text-base">Phần mềm chấm công tác của đài truyền hình VTV</p>
            <div className="inputLogin">
              <div className="input">
                <FaEnvelope />
                <input value={email} type="email" id="email" placeholder="Email" onChange={handleEmailChange} />
              </div>
              <div className="input">
                <FaLock />
                <input
                  value={password}
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <button type="button" onClick={handleSignIn} style={{ marginTop: '26px' }}>
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
      <Link to="/dang-nhap-lan-dau" className="absolute text-sm bottom-4 left-4 text-vtv-blue italic">
        Đăng nhập lần đầu?
      </Link>
    </div>
  );
}

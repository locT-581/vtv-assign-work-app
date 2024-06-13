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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password }).then(() => navigate('/'));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event?.target?.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  return (
    <div
      className="bg-cover h-screen w-screen items-center justify-center flex"
      style={{
        backgroundImage:
          "url('https://firebasestorage.googleapis.com/v0/b/vtv-app-e0209.appspot.com/o/assets%2FBG-TD.jpg?alt=media&token=da8627cb-e201-4714-a10a-fd88c4724fba')",
      }}
    >
      <div className="justify-center flex flex-col text-center min-w-[350px] w-1/4">
        <img src={getIcon('logoVTV')} alt="logo" className=" h-24 px-4" />
        <form onSubmit={handleSignIn}>
          <div className="Card w-full p-8 mt-6">
            <p className=" font-semibold text-3xl text-vtv-blue">Chào mừng!</p>
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
            <button type="submit" style={{ marginTop: '26px' }}>
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

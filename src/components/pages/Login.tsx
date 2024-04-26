import getIcon from '../../utils/getIcon';

import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import { useNavigate } from 'react-router-dom';
import { login } from '../../apis/userAPI';

export interface LoginProps {}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) return;
    login({ email, password }).then(() => navigate('/'));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event?.target?.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  return (
    <section className="LoginPage">
      <div className="justify-center flex flex-col">
        <img src={getIcon('logoVTV')} alt="logo" className=" h-24 px-4" />
        <form>
          <div className="Card">
            <legend>Chào mừng!</legend>
            <p>Phần mềm chấm công tác của đài truyền hình VTV</p>
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
            <button
              type="button"
              onClick={() => {
                signOut(auth).then((res) => {
                  console.log('Sign out', res);
                });
              }}
              style={{ marginTop: '26px' }}
            >
              Đăng xuất
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

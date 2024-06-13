import * as React from 'react';
import { Link } from 'react-router-dom';
import { checkEmailExist, createUserInAuth } from '../../apis/userAPI';
import getIcon from '../../utils/getIcon';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import ErrorIcon from '@mui/icons-material/Error';
import { User } from '../../types/user';

export interface IFirstLoginProps {}

type Step = 'confirmEmail' | 'setPassword' | 'done';

export default function FirstLogin() {
  const [error, setError] = React.useState<string>('');

  const [step, setStep] = React.useState<Step>('confirmEmail');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleCreateUser = async () => {
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    await createUserInAuth(email, password).then(() => {
      setError('Kích hoạt thành công');
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event?.target?.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);

  const handleConfirmEmail = async () => {
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    await checkEmailExist(email).then((res: User | null) => {
      if (res) {
        console.log(res);
        if (res?.firstLogin) {
          setStep('setPassword');
          return;
        }
        setError('Tài khoản đã được kích hoạt');
      } else {
        setError('Email không tồn tại');
      }
    });
  };

  return (
    <>
      {error && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
            <ErrorIcon color={error === 'Kích hoạt thành công' ? 'success' : 'error'} />
            <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo</h2>
            <p className="text-[#999999] text-xl font-semibold">{error}</p>
            {error !== 'Kích hoạt thành công' && error !== 'Tài khoản đã được kích hoạt' && (
              <button
                onClick={() => setError('')}
                type="button"
                className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right"
              >
                Xác nhận
              </button>
            )}
            {(error === 'Kích hoạt thành công' || error === 'Tài khoản đã được kích hoạt') && (
              <Link to="/dang-nhap">
                <button
                  onClick={() => setError('')}
                  type="button"
                  className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right"
                >
                  Đăng nhập
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
      <div
        className="bg-cover h-screen w-screen items-center justify-center flex"
        style={{
          backgroundImage:
            "url('https://firebasestorage.googleapis.com/v0/b/vtv-app-e0209.appspot.com/o/assets%2FBG-TD.jpg?alt=media&token=da8627cb-e201-4714-a10a-fd88c4724fba')",
        }}
      >
        <div className="justify-center flex flex-col text-center  w-1/4">
          <img src={getIcon('logoVTV')} alt="logo" className=" h-24 px-4" />
          <form>
            <div className="Card w-full p-8 mt-6">
              <p className="text-4xl font-semibold text-vtv-blue">Chào mừng!</p>
              <p className="text-base mb-4">Phần mềm chấm công tác của đài truyền hình VTV</p>
              {step === 'confirmEmail' && (
                <>
                  <div className="inputLogin">
                    <p className="text-[#999999] text-start">*Nhập email</p>
                    <div className="input !my-1">
                      <FaEnvelope />
                      <input
                        required
                        value={email}
                        type="email"
                        id="email"
                        placeholder="Email"
                        onChange={handleEmailChange}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={handleConfirmEmail} style={{ marginTop: '26px' }}>
                    Tiếp tục
                  </button>
                </>
              )}
              {step === 'setPassword' && (
                <div className="inputLogin">
                  <p className="text-[#999999] text-start">*Tạo mật khẩu</p>
                  <div className="input !my-1">
                    <FaLock />
                    <input
                      value={password}
                      type="password"
                      id="password"
                      placeholder="Mật khẩu"
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button type="button" onClick={handleCreateUser} style={{ marginTop: '26px' }}>
                    Xác nhận
                  </button>
                  <p
                    className="italic underline text-sm mt-2 cursor-pointer text-center"
                    onClick={() => setStep('confirmEmail')}
                  >
                    Quay lại
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
        <Link to="/dang-nhap" className="absolute text-sm bottom-4 left-4 text-vtv-blue italic">
          Quay lại
        </Link>
      </div>
    </>
  );
}

import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useRef, useState } from 'react';
import { getAllDepartments, updateUserInfo, uploadAvatar } from '../../apis/userAPI';
import { Department } from '../../types/requirement';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppSelector } from '../../redux/hook';
import { User } from '../../types/user';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
export interface IUserInfoProps {}

export default function UserInfo() {
  const { user } = useAppSelector((state) => state.userSlice);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [form, setForm] = useState<User>({
    id: user?.id ?? '',
    email: user?.email ?? '',
    fullName: user?.fullName ?? '',
    password: '',
    phoneNumber: user?.phoneNumber ?? '',
    address: user?.address ?? '',
    department: user?.department ?? '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    setAvatar(null);
    setAvatarPreview('');
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result as string);
        setAvatar(reader.result as string);
      }
    };
    reader.readAsDataURL(e.target.files![0]);
  };

  useEffect(() => {
    setForm({
      id: user?.id ?? '',
      email: user?.email ?? '',
      fullName: user?.fullName ?? '',
      password: '',
      phoneNumber: user?.phoneNumber ?? '',
      address: user?.address ?? '',
      department: user?.department ?? '',
      avatar: user?.avatar ?? '',
    });
  }, [user]);

  useEffect(() => {
    (async () => {
      await getAllDepartments().then((data) => setDepartments(data));
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    uploadAvatar(avatar ?? '', form.id).then(() => {
      console.log('Upload avatar success');
    });

    updateUserInfo(form).then(() => {
      console.log('Update user info success');
    });
  };

  return (
    <DefaultLayout>
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
            <CheckCircleIcon color="success" />
            <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo </h2>
            <p className="text-[#999999] text-xl font-semibold">Bạn đã gửi yêu cầu thành công</p>
            <button
              onClick={() => setShowPopup(false)}
              type="button"
              className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
      <div className="w-full h-full justify-between flex flex-col bg-white py-12 px-12 rounded-3xl">
        <div className="w-full py-2">
          <div
            className="cursor-pointer select-none font-normal flex float-left text-[#999999]"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon color="inherit" />
            <p>Quay lại</p>
          </div>
        </div>

        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col gap-4 mt-12">
            <h2 className="w-full text-start text-2xl laptop:text-4xl desktop:text-6xl text-[#2D3581] font-semibold">
              Thông tin tài khoản
            </h2>
            <span className="text-xs text-[#999999]">*Email sẽ không được phép thay đổi</span>
          </div>
          <div
            onClick={() => {
              inputRef.current?.click();
            }}
            className="cursor-pointer flex flex-col justify-center items-center text-[#999999]"
          >
            <input onChange={handleAvatarChange} accept="image/*" type="file" className="hidden" ref={inputRef} />
            <img
              src={
                avatarPreview
                  ? avatarPreview
                  : user?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user?.fullName.split(' ')[user?.fullName.split(' ').length - 1][0]
                    }&background=2D3581&color=fff`
              }
              alt="avatar"
              className="w-20 h-20 desktop:w-32 desktop:h-32 rounded-full object-cover"
            />
            <div className="bg-[#DBDBDB] w-[30px] h-[30px] rounded-full flex justify-center items-center border -mt-4">
              <CameraAltIcon color="inherit" fontSize="small" />
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-10 mt-2">
          <div className="flex gap-4 items-center">
            <label htmlFor="fullName" className="text-lg font-medium text-black flex flex-shrink-0">
              Họ & tên
            </label>
            <input
              required
              title=""
              onChange={handleChange}
              value={form.fullName}
              id="fullName"
              name="fullName"
              type="text"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="email" className="text-lg font-medium text-black flex flex-shrink-0">
              Email
            </label>
            <input
              disabled
              title=""
              value={form.email}
              id="email"
              name="email"
              type="email"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>
          {/* <div className="flex gap-4 items-center">
            <label htmlFor="password" className="text-lg font-medium text-black flex flex-shrink-0">
              Mật khẩu
            </label>
            <input
              required
              title=""
              value={form.password}
              id="password"
              name="password"
              type="password"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div> */}
          <div className="flex gap-20">
            <div className="flex gap-4 items-center">
              <label htmlFor="phoneNumber" className="text-lg font-medium text-black flex flex-shrink-0">
                Số điện thoại
              </label>
              <input
                onChange={handleChange}
                required
                title=""
                value={form.phoneNumber}
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
              />
            </div>

            <div className="flex gap-4 items-center">
              <label htmlFor="address" className="text-lg font-medium text-black flex flex-shrink-0">
                Phòng
              </label>
              <select
                required
                title=""
                onChange={handleChange}
                value={form.address}
                name="address"
                id="address"
                className="cursor-pointer !bg-transparent max-w-[300px] !border !border-[#D9DBE9] rounded-lg py-1 px-4  text-black"
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="address" className="text-lg font-medium text-black flex flex-shrink-0">
              Địa chỉ
            </label>
            <input
              required
              title=""
              onChange={handleChange}
              value={form.address}
              id="address"
              name="address"
              type="text"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>
        </form>
        <div className="w-full py-4">
          <button type="submit" className=" w-fit text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right">
            Cập nhật
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}

import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { createUserInDatabase, getAllDepartments, getAllUsers, removeUser } from '../../apis/userAPI';
import RowItem from '../RowItem';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Department } from '../../types/requirement';
import { useAppDispatch } from '../../redux/hook';
import { switchPopup } from '../../redux/reducers/commonSlice';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const itemPerPage = 6;

type PopupType = 'warning' | 'success';

export interface IUserListProps {}

export default function UserList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>('warning');
  const [currentUserToRemove, setCurrentUserToRemove] = useState<string | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [usersPerPage, setUsersPerPage] = useState<User[]>([]);

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const start = (page - 1) * itemPerPage;
    const end = start + itemPerPage;
    setUsersPerPage(allUsers.slice(start, end));
    setCount(Math.max(~~(allUsers.length / itemPerPage) + (allUsers.length % itemPerPage === 0 ? 0 : 1), 1));
  }, [page, allUsers]);

  useEffect(() => {
    (async () => {
      await getAllUsers().then((data) => {
        setAllUsers(data ?? []);
      });

      await getAllDepartments().then((data) => {
        setDepartments(data ?? []);
      });
    })();
  }, []);

  const handleAddUser = () => {
    dispatch(switchPopup({ isShowPopup: true, popupElement: <AddUserPopup /> }));
  };

  const handleRemoveUser = async () => {
    await removeUser(currentUserToRemove ?? '').then(async () => {
      await getAllUsers().then((data) => {
        setPopupType('success');
        setShowPopup(true);
        setAllUsers(data ?? []);
        setCurrentUserToRemove(null);
      });
    });
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          {popupType === 'warning' && (
            <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
              <ErrorIcon color="error" fontSize="large" />
              <h2 className="text-[#2D3581] text-3xl font-bold">Cảnh báo</h2>
              <p className="text-[#999999] text-xl font-semibold">Bạn có chắc chắn sẽ xoá người dùng này không?</p>
              <div className="flex gap-2 items-center font-semibold ">
                <div
                  onClick={() => setShowPopup(false)}
                  className="text-vtv-blue px-4 border border-vtv-blue rounded-full !py-1 cursor-pointer"
                >
                  Hủy
                </div>
                <button
                  onClick={() => {
                    handleRemoveUser();
                  }}
                  type="button"
                  className="text-white bg-[#2D3581] rounded-full !py-1 !px-4 float-right"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}
          {popupType === 'success' && (
            <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
              <CheckCircleIcon color="success" fontSize="large" />
              <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo</h2>
              <p className="text-[#999999] text-xl font-semibold">Xóa người dùng thành công</p>
              <button
                onClick={() => setShowPopup(false)}
                type="button"
                className="text-white bg-[#2D3581] rounded-full !py-1 !px-4 float-right"
              >
                Xác nhận
              </button>
            </div>
          )}
        </div>
      )}
      <DefaultLayout>
        <div className="h-full max-h-full w-full flex flex-col gap-2 bg-white p-12 rounded-3xl">
          <div className="w-full py-2">
            <div
              className="cursor-pointer select-none font-normal flex float-left text-[#999999]"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosNewIcon color="inherit" />
              <p>Quay lại</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">Danh sách người dùng</h2>
            <div className="flex gap-2 justify-end text-xs text-black">
              <button className="flex gap-1 items-center !py-1" type="button" onClick={handleAddUser}>
                <AddIcon />
                <p>Thêm</p>
              </button>
            </div>
          </div>
          <div className="w-full relative h-full ">
            <div className="flex h-full flex-col gap-3">
              {usersPerPage?.map((user, i) => (
                <RowItem key={user.id || i}>
                  <div className="w-full flex justify-between items-center">
                    <div className="w-1/3 flex gap-2 items-center">
                      <img src={user?.avatar} alt="" className="w-5 h-5 rounded-full" />
                      <p className="font-semibold">
                        {(user?.fullName.split(' ')[user?.fullName.split(' ').length - 2] ?? '') +
                          ' ' +
                          (user?.fullName.split(' ')[user?.fullName.split(' ').length - 1] ?? '')}
                      </p>
                    </div>
                    <div className="w-1/3 text-start">{user?.email}</div>
                    <div className="w-1/3 text-end flex justify-between">
                      {departments.find((department) => department.id === user.department)?.name}
                      <p
                        onClick={() => {
                          setPopupType('warning');
                          setShowPopup(true);
                          setCurrentUserToRemove(user.id);
                        }}
                        className="flex text-vtv-red cursor-pointer"
                      >
                        Xóa
                      </p>
                    </div>
                  </div>
                </RowItem>
              ))}
            </div>
            <div className="absolute bottom-0 px-4 py-2 text-[#999999] text-sm">{`Tổng số người dùng: ${
              page * usersPerPage.length
            }/${allUsers?.length}`}</div>
            <Stack spacing={2} sx={{ alignItems: 'center', position: 'absolute', bottom: '-30px', left: 0, right: 0 }}>
              <Pagination
                onChange={(_, page) => setPage(page)}
                count={count}
                renderItem={(item) => (
                  <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                )}
              />
            </Stack>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}

const AddUserPopup = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState<User>({
    id: '',
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
    address: '',
    department: '',
  });

  useEffect(() => {
    (async () => {
      await getAllDepartments().then((data) => {
        form.department = data[0].id;
        setDepartments(data);
      });
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserInDatabase(form)
      .then(() => {
        dispatch(switchPopup({ isShowPopup: false }));
      })
      .catch((error) => {
        setError(error.toString().split('Error: ')[1]);
      });
  };

  useEffect(() => {
    console.log(form);
  }, [form]);
  return (
    <>
      {error && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
            <ErrorIcon color="error" />
            <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo</h2>
            <p className="text-[#999999] text-xl font-semibold">{error}</p>
            <button
              onClick={() => setError('')}
              type="button"
              className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">Thêm người dùng</h2>
            <span className="text-xs text-[#999999]">*Email sẽ được dùng để đăng nhập</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-[50vw] min-w-[600px] max-w-[1042px] flex flex-col gap-5">
          <div className="flex gap-4 items-center">
            <label htmlFor="fullName" className="text-lg font-medium text-black flex flex-shrink-0">
              Họ & tên
            </label>
            <input
              placeholder="Nhập họ tên"
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
              onChange={handleChange}
              placeholder="Nhập email"
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
          <div className="flex gap-10">
            <div className="flex gap-4 items-center">
              <label htmlFor="phoneNumber" className="text-lg font-medium text-black flex flex-shrink-0">
                Số điện thoại
              </label>
              <input
                placeholder="Số điện thoại"
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

            <div className="flex gap-1 items-center">
              <label htmlFor="department" className="text-lg font-medium text-black flex flex-shrink-0">
                Phòng
              </label>
              <select
                required
                title=""
                onChange={handleChange}
                value={form.address}
                name="department"
                id="department"
                className="cursor-pointer !bg-transparent max-w-[300px] !border !border-[#D9DBE9] rounded-lg py-1 px-4  text-black"
              >
                {departments.map((department, i) => (
                  <option key={department.id ?? i} value={department.id}>
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
              placeholder="Nhập địa chỉ"
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

          <div className="w-full py-4">
            <button type="submit" className=" w-fit text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

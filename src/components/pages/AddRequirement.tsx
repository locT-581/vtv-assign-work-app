/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from 'react';
import { createRequirement, getCities } from '../../apis/userAPI';
import { Province } from '../../types/common';
import { Requirement } from '../../types/requirement';
import { Checkbox } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppDispatch, useAppSelector } from '../../redux/hook';

import Select from 'react-select';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';

export interface IAddRequirementProps {}

export default function AddRequirement() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.userSlice);

  const [cities, setCities] = useState<Province[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [form, setForm] = useState<Requirement>({
    id: '',
    title: '',
    address: '',
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    note: '',
    supportTeams: [],
    user: user?.id ?? '',
    status: 'Đang chờ',
    filming: { quantity: 0, member: [''] },
    lightingTechniques: { quantity: 0, member: [''] },
    vehicles: undefined,
    soundTechniques: { quantity: 0, member: [''] },
    studioTechniques: null,
    level: 'Thấp',
    km: '',
  });

  useEffect(() => {
    (async () => {
      await getCities().then((data) => {
        // Check if data element have province_name field include 'Tỉnh' or 'Thành phố' then remove this word
        data.forEach((element) => {
          if (element.province_name.includes('Tỉnh')) {
            element.province_name = element.province_name.replace('Tỉnh', '').trim();
          }
          if (element.province_name.includes('Thành phố')) {
            element.province_name = element.province_name.replace('Thành phố', '').trim();
          }
        });
        setCities([{ province_id: '00', province_name: 'Chọn tỉnh/thành phố', province_type: '' }, ...data]);
      });
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // check if name is startDate or endDate then convert to timestamp
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createRequirement({
      ...form,
      user: user?.id ?? '',
      startDate: new Date(form.startDate).getTime(),
      endDate: new Date(form.endDate).getTime(),
      status: 'Đang chờ',
    }).then(() => {
      setShowPopup(true);
      dispatch(getAllRequirementAsync({ userId: user?.id ?? '' }));
      // reset
      setForm({
        level: 'Thấp',
        id: '',
        title: '',
        address: '',
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        note: '',
        supportTeams: [],
        user: user?.id ?? '',
        status: 'Đang chờ',
        filming: { quantity: 0, member: [''] },
        lightingTechniques: { quantity: 0, member: [''] },
        vehicles: undefined,
        soundTechniques: { quantity: 0, member: [''] },
        studioTechniques: null,
        km: '',
      });

      const checkboxes = document.querySelectorAll('.supportTeam') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.group('Yêu cầu');
      console.table(form);
      console.groupEnd();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [form]);
  return (
    <DefaultLayout>
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
            <CheckCircleIcon color="success" />
            <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo</h2>
            <p className="text-[#999999] text-xl font-semibold">Bạn đã gửi yêu cầu thành công</p>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate(-1);
              }}
              type="button"
              className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
      <div className="w-full h-full flex flex-col justify-around bg-white py-6 px-12 rounded-3xl">
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
          <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">Yêu cầu mới</h2>
          <span className="text-xs text-black">Được tạo bởi bạn</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-4 items-center">
            <label htmlFor="title" className="text-lg font-medium text-black flex flex-shrink-0">
              <p>Đề tài </p>
              <p className="text-red">*</p>
            </label>
            <input
              required
              title=""
              onChange={handleChange}
              value={form.title}
              id="title"
              name="title"
              type="text"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
              placeholder="Tên đề tài"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="address" className="text-lg font-medium text-black flex flex-shrink-0">
              <p>Địa bàn </p>
              <p className="text-red">*</p>
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
              {cities.map((city) => (
                <option key={city.province_id} value={city.province_id}>
                  {city.province_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <label htmlFor="startDate" className="text-lg font-medium text-black flex flex-shrink-0">
                <p>Ngày bắt đầu</p>
                <p className="text-red">*</p>
              </label>
              <input
                title=""
                required
                onChange={handleChange}
                value={form.startDate}
                id="startDate"
                name="startDate"
                type="date"
                className="text-black cursor-pointer !bg-transparent max-w-[200px] w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="endDate" className="text-lg font-medium text-black flex flex-shrink-0">
                <p>Ngày kết thúc</p>
                <p className="text-red">*</p>
              </label>
              <input
                onChange={handleChange}
                value={form.endDate}
                id="endDate"
                name="endDate"
                type="date"
                className="text-black cursor-pointer !bg-transparent max-w-[200px] w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-lg font-medium text-black flex flex-shrink-0">Số km</label>
              <input
                value={form.km}
                onChange={(e) => {
                  const { value } = e.target;
                  Number(value) < 0 && setForm({ ...form, km: '0' });
                  setForm({ ...form, km: value });
                }}
                type="number"
                className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor="note" className="text-lg font-medium text-black flex flex-shrink-0">
              <p>Ghi chú</p>
            </label>
            <textarea
              onChange={handleChange}
              value={form.note}
              id="note"
              name="note"
              className="text-black min-h-[36px] !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
              placeholder="Ghi chú"
            />
          </div>

          <div className=" flex flex-col h-fit gap-4">
            <p className="text-[#2D3581] text-base">
              Vui lòng đánh dấu vào các tùy chọn dưới đây nếu bạn cần sự hỗ trợ từ bất kỳ đội nào.
            </p>
            <div className="w-3/4 min-w-[400px] flex gap-x-[5vw] flex-wrap gap-y-4 ">
              <div className="flex gap-2 items-center">
                <div className="text-lg font-medium">Quay phim</div>
                <Select
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      filming: { quantity: Number(e.value), member: Array.from({ length: Number(e.value) }, () => '') },
                    })
                  }
                  placeholder="0-12"
                  styles={customStyles(false)}
                  options={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                    { value: 6, label: '6' },
                    { value: 7, label: '7' },
                    { value: 8, label: '8' },
                    { value: 9, label: '9' },
                    { value: 10, label: '10' },
                    { value: 11, label: '11' },
                    { value: 12, label: '12' },
                  ]}
                />
              </div>

              <div className="flex gap-2 items-center">
                <div className="text-lg font-medium">Ánh sáng</div>
                <Select
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      lightingTechniques: {
                        quantity: Number(e.value),
                        member: Array.from({ length: Number(e.value) }, () => ''),
                      },
                    })
                  }
                  placeholder="0-2"
                  styles={customStyles(false)}
                  options={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                  ]}
                />
              </div>

              <div className="flex gap-2 items-center">
                <div className="text-lg font-medium">Âm thanh</div>
                <Select
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      soundTechniques: {
                        quantity: Number(e.value),
                        member: Array.from({ length: Number(e.value) }, () => ''),
                      },
                    })
                  }
                  placeholder="0-2"
                  styles={customStyles(false)}
                  options={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                  ]}
                />
              </div>

              <div className="flex gap-2 items-center">
                <div className="text-lg font-medium">Phương tiện di chuyển</div>
                <Select
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      vehicles: e.value === 'Xe taxi' ? { type: 'Xe taxi' } : { type: 'Xe cơ quan', cars: [] },
                    })
                  }
                  placeholder="Chọn loại xe"
                  styles={customStyles(false)}
                  options={[
                    { value: 'Xe taxi', label: 'Xe taxi' },
                    { value: 'Xe cơ quan', label: 'Xe cơ quan' },
                  ]}
                />
              </div>

              <div className="flex gap-2 items-center">
                <div className="text-lg font-medium">Mức độ</div>
                <Select
                  onChange={(e: any) => setForm({ ...form, level: e.value })}
                  placeholder="Chọn mức độ "
                  styles={customStyles(false)}
                  options={[
                    { value: 'Cao', label: 'Cao' },
                    { value: 'Trung bình', label: 'Trung bình' },
                    { value: 'Thấp', label: 'Thấp' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-1 cursor-pointer">
                <Checkbox
                  className="supportTeam select-none"
                  onChange={(e) => setForm({ ...form, studioTechniques: e.target.checked ? { member: [''] } : null })}
                  id="studioTechniques"
                  name="studioTechniques"
                />
                <label
                  htmlFor="studioTechniques"
                  className="text-black flex-shrink-0 text-lg font-medium cursor-pointer"
                >
                  Kỹ thuật trường quay
                </label>
              </div>
            </div>
          </div>

          <div>
            <p className="w-full text-end text-xs text-black italic ">
              Xin hãy xác nhận rằng bạn đã kiểm tra kỹ thông tin mà bạn đã nhập.
              <br /> Khi bạn nhấn vào nút "gửi", các thông tin sẽ không thể được chỉnh sửa sau đó.
            </p>
            <button type="submit" className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right">
              Gửi đi
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}

const customStyles = (isDarkMode: boolean) => ({
  control: (styles: any) => ({
    ...styles,
    backgroundColor: isDarkMode ? '#141416' : '#F7F9FB',
    color: isDarkMode ? '#fff' : '#F7F9FB',
    padding: '0',
    borderRadius: '12px',
    outline: 'none',
    '&:placeholder': {
      color: isDarkMode ? '#636363' : '#D1D1D1',
    },
    cursor: 'pointer',
    borderColor: isDarkMode ? '#141416' : '#D1D1D1',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: isDarkMode ? '#fff' : '#000',
    outline: 'none',
    padding: 0,
  }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: isDarkMode ? '#333' : '#fff',
    outline: 'none',
  }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? (isDarkMode ? '#555' : '#eee') : isDarkMode ? '#333' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
    outline: 'none',
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: isDarkMode ? '#fff' : '#000',
    outline: 'none',
  }),
  indicatorSeparator: (styles: any) => ({
    ...styles,
    display: 'none',
  }),
  input: (styles: any) => ({
    ...styles,
    outline: 'none',
    boxShadow: 'none',
    '&:focus': {
      boxShadow: 'none',
    },
  }),
});

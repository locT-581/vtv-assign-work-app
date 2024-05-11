import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from 'react';
import { createRequirement, getAllSupportTeams, getCities } from '../../apis/userAPI';
import { Province } from '../../types/common';
import { Requirement, SupportTeams } from '../../types/requirement';
import { Checkbox } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppSelector } from '../../redux/hook';

export interface IAddRequirementProps {}

export default function AddRequirement() {
  const { user } = useAppSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const [cities, setCities] = useState<Province[]>([]);
  // const [districts, setDistricts] = useState<District[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [supportTeams, setSupportTeams] = useState<SupportTeams[]>([]);

  const [form, setForm] = useState<Requirement>({
    id: '',
    title: '',
    address: '',
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    note: '',
    supportTeams: [],
    user,
    status: '',
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

      await getAllSupportTeams().then((data) => {
        setSupportTeams(data);
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) {
      setForm({ ...form, supportTeams: [...form.supportTeams, { id: name, team: name }] });
    } else {
      setForm({ ...form, supportTeams: form.supportTeams.filter((team) => team.id !== name) });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createRequirement({
      ...form,
      user,
      startDate: new Date(form.startDate).getTime(),
      endDate: new Date(form.endDate).getTime(),
      status: 'Đang chờ',
    }).then(() => {
      setShowPopup(true);
      // reset form
      setForm({
        id: '',
        title: '',
        address: '',
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        note: '',
        supportTeams: [],
        user,
        status: '',
      });
      // reset support teams
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
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-slate-950 bg-opacity-50">
          <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
            <CheckCircleIcon color="success" />
            <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo</h2>
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
            {/* <select
              defaultValue=""
              id="address"
              className="cursor-pointer !bg-transparent !border !border-[#D9DBE9] max-w-[300px] rounded-lg py-1 px-4  text-black"
            >
              {cities.map((city) => (
                <option key={city.province_id} value={city.province_id}>
                  {city.province_name}
                </option>
              ))}
            </select> */}
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
            <div className="w-3/4 min-w-[400px] flex gap-x-[5vw] flex-wrap  ">
              {supportTeams.map((team) => (
                <div key={team.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox className="supportTeam" onChange={handleCheckboxChange} id={team.id} name={team.id} />
                  <label htmlFor={team.id} className="text-black flex-shrink-0 text-lg font-medium cursor-pointer">
                    {team.team}
                  </label>
                </div>
              ))}
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

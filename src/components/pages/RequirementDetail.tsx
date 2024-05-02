import { useNavigate, useParams } from 'react-router-dom';
import { Requirement, SupportTeams } from '../../types/requirement';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useEffect, useState } from 'react';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Province } from '../../types/common';
import { getAllSupportTeams, getCities } from '../../apis/userAPI';
import formatDate from '../../utils/formatDate';
import { Checkbox } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Tag from '../../Tag';

import ErrorIcon from '@mui/icons-material/Error';

export interface IRequirementDetailProps {}

export default function RequirementDetail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);

  const [supportTeams, setSupportTeams] = useState<SupportTeams[]>([]);
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [cities, setCities] = useState<Province[]>([]);

  useEffect(() => {
    !requirements && dispatch(getAllRequirementAsync({ userId: user?.id ?? '' }));
    if (requirements) {
      const requirement = requirements.find((requirement) => requirement.id === id);
      if (requirement) {
        setRequirement(requirement);
      }
    }

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
  }, [requirements, id, dispatch, user]);

  return (
    <DefaultLayout>
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
          <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">{requirement?.title}</h2>
          {requirement?.status === 'Đã từ chối' && (
            <div className="flex bg-[#D8242866] px-8 py-1 items-center gap-4 rounded-xl">
              <ErrorIcon color="error" />
              <p className="text-sm font-semibold">Yêu cầu bị hủy do: {requirement?.reasonReject}</p>
            </div>
          )}
          <div className="cursor-pointer text-xl flex w-full gap-10 p-4 text-black">
            <div className="flex gap-1 items-center">
              <img src={user?.avatar} alt="" className="w-5 h-5 rounded-full" />
              <p>
                {(user?.fullName.split(' ')[user?.fullName.split(' ').length - 2] ?? '') +
                  ' ' +
                  (user?.fullName.split(' ')[user?.fullName.split(' ').length - 1] ?? '')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <LocationOnIcon color="error" />
              <p className="">{cities.find((city) => city.province_id === requirement?.address)?.province_name}</p>
            </div>
            <div className="flex text-[#999999] items-center gap-1">
              <CalendarTodayIcon color="inherit" />
              <p className="">{formatDate(requirement?.startDate ?? 0)}</p>
            </div>
            <div className="flex gap-1 items-center">
              <FiberManualRecordIcon color="warning" sx={{ fontSize: '14px' }} />
              <p className="text-[14px]">{requirement?.status}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold">Yêu cầu</h2>
          <div className="w-full flex flex-col ">
            {supportTeams.map((team) => (
              <div key={team.id} className="flex items-center gap-2 ">
                <Checkbox
                  className="supportTeam"
                  disabled
                  id={team.id}
                  name={team.id}
                  checked={!!requirement?.supportTeams.find((spr) => spr.id === team.id)}
                />
                <label htmlFor={team.id} className="text-black flex-shrink-0 text-lg font-medium ">
                  {team.team}
                </label>
                {requirement?.supportTeams
                  .find((spr) => spr.id === team.id)
                  ?.members?.map((member) => (
                    <Tag
                      backgroundColor={member.color || '#0281ee'}
                      avatar={member.avatar || 'https://ui-avatars.com/api/?name=o&background=0281ee&color=fff'}
                      content={
                        (member.fullName.split(' ')[member.fullName.split(' ').length - 2] ?? '') +
                        ' ' +
                        (member.fullName.split(' ')[member.fullName.split(' ').length - 1] ?? '')
                      }
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-1 items-center ">
          <p className=" font-semibold">Ghi chú:</p>
          <p>{requirement?.note}</p>
        </div>
      </div>
    </DefaultLayout>
  );
}

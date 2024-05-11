import { useNavigate, useParams } from 'react-router-dom';
import { Requirement, SupportTeams } from '../../types/requirement';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { ChangeEvent, useEffect, useState } from 'react';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Province } from '../../types/common';
import { getAllSupportTeams, getAllUsers, getCities, updateRequirement } from '../../apis/userAPI';
import formatDate from '../../utils/formatDate';
import { Checkbox } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Tag from '../../Tag';

import ErrorIcon from '@mui/icons-material/Error';
import { User } from '../../types/user';

export interface IRequirementDetailProps {}

export default function RequirementDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);

  const [supportTeams, setSupportTeams] = useState<SupportTeams[]>([]);
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [cities, setCities] = useState<Province[]>([]);

  const [allSupportTeam, setAllSupportTeam] = useState<{ [key: string]: User[] }>({});
  const [suggestList, setSuggestList] = useState<{ inputIndex: number | null; user: User[] } | null>(null);

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
        // get data.name and add it to as a field in allSupportTeam
        data.forEach((element) => {
          allSupportTeam[element.id] = [
            requirements
              ?.find((requirement) => requirement.id === id)
              ?.supportTeams.find((team) => team.id === element.id)?.members || [],
          ][0];
        });
      });
    })();
  }, [requirements, id, dispatch, user]);

  const handleChangeSupportTeam = (e: ChangeEvent<HTMLInputElement>, id: string, index: number) => {
    const value = e.target.value;
    const timeout = setTimeout(() => {
      clearTimeout(timeout);

      if (value[value.length - 1] === ' ' || value === '') {
        setSuggestList({ inputIndex: null, user: [] });
      } else {
        getAllUsers().then((data) => {
          const result = data?.filter((element: User) => {
            return element.fullName.toLocaleLowerCase().includes(value.toLocaleLowerCase());
          });

          // filter out the user that already in allSupportTeam
          const allSupportTeamId = allSupportTeam[id].map((element) => element.id);
          setSuggestList({
            inputIndex: index,
            user: result?.filter((element) => !allSupportTeamId.includes(element.id)) || [],
          });
        });
      }
    }, 200);
  };
  useEffect(() => {
    console.log(allSupportTeam);
  }, [allSupportTeam]);

  useEffect(() => {
    console.log(suggestList);
  }, [suggestList]);

  const handleClickConfirm = async () => {
    if (requirement) {
      console.log(requirement);
      console.log('allSupportTeam', allSupportTeam);
      await updateRequirement({
        ...requirement,
        supportTeams: requirement.supportTeams.map((team) => {
          return {
            ...team,
            members: allSupportTeam[team.id],
          };
        }),
        status: 'Đã phân công',
      }).then(() => {
        dispatch(getAllRequirementAsync({ userId: user?.id ?? '' }));
        navigate(-1);
      });
    }
  };

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
          <div className="w-full flex flex-col gap-3">
            {supportTeams.map((team, i: number) => (
              <div key={team.id} className="flex justify-start">
                <div className="w-1/3 flex items-center gap-2">
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
                </div>
                <div
                  onClick={() => {
                    (document.getElementById('su-' + team.id) as HTMLInputElement).focus();
                  }}
                  className={'w-2/3 border border-[#999999] rounded-lg flex flex-wrap px-2 py-2 items-center gap-2'}
                  style={{
                    backgroundColor: user?.isAdmin
                      ? requirement?.supportTeams.find((spr) => spr.id === team.id)
                        ? 'transparent'
                        : '#f5f5f5'
                      : '#f5f5f5',

                    cursor: user?.isAdmin
                      ? requirement?.supportTeams.find((spr) => spr.id === team.id)
                        ? 'text'
                        : 'default'
                      : 'default',
                  }}
                >
                  {allSupportTeam[team.id]?.map((member) => (
                    <Tag
                      onClickRemove={
                        !user?.isAdmin
                          ? () => undefined
                          : () => {
                              setAllSupportTeam({
                                ...allSupportTeam,
                                [team.id]: allSupportTeam[team.id]?.filter((user) => user.id !== member.id),
                              });
                            }
                      }
                      backgroundColor={member.color || '#0281ee'}
                      avatar={member.avatar || 'https://ui-avatars.com/api/?name=o&background=0281ee&color=fff'}
                      content={
                        (member.fullName.split(' ')[member.fullName.split(' ').length - 2] ?? '') +
                        ' ' +
                        (member.fullName.split(' ')[member.fullName.split(' ').length - 1] ?? '')
                      }
                    />
                  ))}
                  <div className="flex relative w-1/4">
                    <input
                      id={`su-${team.id}`}
                      disabled={
                        user?.isAdmin
                          ? requirement?.supportTeams.find((spr) => spr.id === team.id)
                            ? false
                            : true
                          : true
                      }
                      alt=""
                      style={{ background: 'none' }}
                      type="text"
                      className="outline-none px-2 w-full"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        handleChangeSupportTeam(e, team.id, i);
                      }}
                    />
                    {suggestList?.user && suggestList?.user?.length > 0 && suggestList?.inputIndex === i && (
                      <div id="suggests" className="absolute top-10 z-50 bg-white w-[200px] rounded-[10px] shadow-lg">
                        {suggestList?.user.map((element, j: number) => (
                          <p
                            onClick={() => {
                              const input = document.getElementById('su-' + team.id) as HTMLInputElement;
                              input.value = '';
                              input.focus();
                              setAllSupportTeam({
                                ...allSupportTeam,
                                [team.id]: [...(allSupportTeam[team.id] || []), element],
                              });
                              setSuggestList({ inputIndex: null, user: [] });
                            }}
                            id={`tag-${j}`}
                            key={j}
                            className="w-full text-start px-3 py-2 cursor-pointer hover:bg-[#f5f5f5] transition-all duration-200 ease-in-out"
                          >
                            {element.fullName}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!user?.isAdmin && (
          <div className="flex gap-1 items-center ">
            <p className=" font-semibold">Ghi chú:</p>
            <p>{requirement?.note}</p>
          </div>
        )}

        {user?.isAdmin && (
          <div className="flex gap-1 items-center justify-between">
            <p className="text-sm">*Phần được đánh dấu không thể thay đổi do yêu cầu của biên tập viên.</p>
            <div className="flex gap-4">
              <button type="button" className="!bg-[#ffffff00] text-[#999999] !p-0 !text-base">
                Hủy yêu cầu
              </button>
              <button onClick={handleClickConfirm} type="button" className="!px-4 !py-1 !text-base">
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

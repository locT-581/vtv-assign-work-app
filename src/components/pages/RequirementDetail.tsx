/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from 'react-router-dom';
import { Requirement } from '../../types/requirement';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { useEffect, useState } from 'react';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Province } from '../../types/common';
import { getAllUsers, getCities, updateRequirement, getAllVehicle } from '../../apis/userAPI';
import formatDate from '../../utils/formatDate';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import DriveEtaIcon from '@mui/icons-material/DriveEta';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Select, { StylesConfig } from 'react-select';

export interface IRequirementDetailProps {}

type PopupType = 'success' | 'error';

export default function RequirementDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>('success');
  const [reasonReject, setReasonReject] = useState<string>(
    requirements?.find((requirement) => requirement.id === id)?.reasonReject || '',
  );

  const [allUser, setAllUser] = useState<User[]>([]);

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [cities, setCities] = useState<Province[]>([]);

  const [listFilming, setListFilming] = useState<any[]>([]);
  const [listVehicles, setListVehicles] = useState<any[]>([]);
  const [listSoundTechniques, setListSoundTechniques] = useState<any[]>([]);
  const [listStudioTechniques, setListStudioTechniques] = useState<any[]>([]);
  const [listLightingTechniques, setListLightingTechniques] = useState<any[]>([]);
  const [listDrivers, setListDrivers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        !requirements && dispatch(getAllRequirementAsync({ userId: null }));
      } else {
        !requirements && dispatch(getAllRequirementAsync({ userId: user?.id ?? '' }));
      }
    }

    getAllUsers().then((users: User[] | null) => {
      console.log('🚀 ~ getUserById ~ user:', users);
      if (users) setAllUser(users);
      else setAllUser([]);
    });

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

      getAllVehicle().then((vehicles) => {
        setListVehicles(
          vehicles.map((vehicle: Vehicle) => {
            return {
              value: vehicle.id,
              label: vehicle.licensePlate,
              color: vehicle.color ?? '#f5f5f5',
            };
          }),
        );
      });
    })();
  }, [requirements, id, dispatch, user]);

  useEffect(() => {
    if (user && requirements && allUser) {
      setListSoundTechniques(
        convertToSelectOption(
          allUser.filter((user) => user.department == '4ALMOYK9xcomsUumq4VF'),
          requirementByTime,
        ),
      );
      setListLightingTechniques(
        convertToSelectOption(
          allUser.filter((user) => user.department == 'kh0IbsbhgRA00CsRAm6B'),
          requirementByTime,
        ),
      );
      setListFilming(
        convertToSelectOption(
          allUser.filter((user) => user.department == 'BJZJTflZgpUSZQPe7gTz'),
          requirementByTime,
        ),
      );
      setListStudioTechniques(
        convertToSelectOption(
          allUser.filter((user) => user.department == 'vqucPdPruRyhoEkXu5Nw'),
          requirementByTime,
        ),
      );
      setListDrivers(
        convertToSelectOption(
          allUser.filter((user) => user.department == 'MNGGGncAbu99wFXEyzqz'),
          requirementByTime,
        ),
      );
    }
  }, [allUser, user, requirements, listVehicles]);

  const handleClickConfirm = async () => {
    if (requirement) {
      const temp = { ...requirement };
      temp.status = 'Đã phân công';
      await updateRequirement(temp).then(() => {
        dispatch(getAllRequirementAsync({ userId: user?.isAdmin ? null : user?.id ?? '' }));
        setPopupType('success');
        setShowPopup(true);
      });
    }
  };

  const handleClickReject = async () => {
    if (requirement) {
      await updateRequirement({
        ...requirement,
        vehicles: undefined,
        studioTechniques: null,
        soundTechniques: { quantity: 0, member: [] },
        lightingTechniques: { quantity: 0, member: [] },
        filming: { quantity: 0, member: [] },
        status: 'Đã từ chối',
        reasonReject: reasonReject,
      }).then(() => {
        dispatch(getAllRequirementAsync({ userId: user?.isAdmin ? null : user?.id ?? '' }));
        navigate(-1);
      });
    }
  };

  /**
   * Lấy tất cả các yêu cầu trong khoảng thời gian trùng với khoảng thời gian của yêu cầu hiện tại
   */
  const [requirementByTime, setRequirementByTime] = useState<Requirement[]>([]);
  useEffect(() => {
    if (requirement) {
      setRequirementByTime(
        getRequirementByTime(requirements ?? [], requirement?.startDate ?? 0, requirement?.endDate ?? 0, requirement),
      );
    }
  }, [requirement]);

  useEffect(() => {
    console.log('🚀 ~ RequirementDetail ~ requirementByTime:', requirementByTime);
  }, [requirementByTime]);

  return (
    <>
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          {popupType === 'success' && (
            <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
              <CheckCircleIcon color="success" />
              <h2 className="text-[#2D3581] text-3xl font-bold">Thông báo</h2>
              <p className="text-[#999999] text-xl font-semibold">Bạn đã phân công thành công!</p>
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
          )}
          {popupType === 'error' && (
            <div className="bg-white rounded-3xl flex flex-col justify-center items-center gap-2 text-center p-9 shadow-md">
              <ErrorIcon color="error" />
              <h2 className="text-[#2D3581] text-3xl font-bold">HUỶ YÊU CẦU</h2>
              <p className="text-[#999999] text-base font-medium">
                Bạn muốn huỷ yêu cầu này?
                <br /> Bạn hãy ghi lí do cho biên tập viên biết nhé!
              </p>
              <textarea
                value={reasonReject}
                onChange={(e) => setReasonReject(e.target.value)}
                className="resize-none border rounded-xl w-full px-4 py-2 outline-none min-h-20"
              ></textarea>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setPopupType('success');
                  handleClickReject();
                }}
                type="button"
                className="text-white bg-[#2D3581] rounded-full !py-1 !px-6 float-right mt-2"
              >
                Xác nhận
              </button>
            </div>
          )}
        </div>
      )}
      <DefaultLayout>
        <div className="w-full h-full flex flex-col justify-around bg-white py-6 px-12 rounded-3xl overflow-y-auto">
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
            <div className=" text-xl flex w-full gap-10 p-4 text-black">
              <div className="flex gap-1 items-center  text-[18px]">
                <img
                  src={allUser.find((user: User) => requirement?.user === user.id)?.avatar}
                  alt=""
                  className="w-5 h-5 rounded-full"
                />
                <p>
                  {(allUser.find((user: User) => requirement?.user === user.id)?.fullName.split(' ')[
                    (allUser.find((user: User) => requirement?.user === user.id)?.fullName.split(' ').length ?? 3) - 2
                  ] ?? '') +
                    ' ' +
                    (allUser.find((user: User) => requirement?.user === user.id)?.fullName.split(' ')[
                      (allUser.find((user: User) => requirement?.user === user.id)?.fullName.split(' ').length ?? 2) - 1
                    ] ?? '')}
                </p>
              </div>
              <div className="flex items-center gap-1 text-base">
                <LocationOnIcon color="error" />
                <p className="">{cities.find((city) => city.province_id === requirement?.address)?.province_name}</p>
              </div>
              <div className="flex text-[#999999] items-center gap-1 text-base">
                <CalendarTodayIcon color="inherit" />
                <p className="">{formatDate(requirement?.startDate ?? 0)}</p>
                <p>-</p>
                <p className="">{formatDate(requirement?.endDate ?? 0)}</p>
              </div>
              <div className="flex gap-1 items-center">
                <FiberManualRecordIcon
                  color={
                    requirement?.status === 'Đã phân công'
                      ? 'success'
                      : requirement?.status === 'Đang chờ'
                      ? 'warning'
                      : 'error'
                  }
                  sx={{ fontSize: '14px' }}
                />
                <p className="text-[14px]">{requirement?.status}</p>
              </div>

              <div className="flex gap-1 items-center">
                <DriveEtaIcon color={'inherit'} />
                <p className="text-[14px]">{requirement?.km + ' km'}</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-base">Mức độ: </p>
                <p className="text-[14px]">{requirement?.level}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Yêu cầu</h2>
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-start gap-1">
                <div className="w-1/3 flex items-center gap-2">
                  <label className="text-black text-lg font-medium ">Kỹ thuật trường quay</label>
                  <p className="py-1 px-4 rounded-xl bg-[#999] text-white">
                    {requirement?.studioTechniques ? 'Có' : 'Không'}
                  </p>
                </div>
                {/* <div
                  onClick={() => {}}
                  className={'w-2/3 border border-[#999999] rounded-lg flex flex-wrap px-2 py-2 items-center gap-2'}
                  style={{
                    backgroundColor: user?.isAdmin
                      ? requirement?.studioTechniques
                        ? 'transparent'
                        : '#f5f5f5'
                      : '#f5f5f5',

                    cursor: user?.isAdmin ? (requirement?.studioTechniques ? 'text' : 'default') : 'default',
                  }}
                ></div> */}

                <Select
                  placeholder={user?.isAdmin ? (requirement?.studioTechniques ? 'Chọn thành viên' : '') : ''}
                  isDisabled={user?.isAdmin ? (requirement?.studioTechniques ? false : true) : true}
                  closeMenuOnSelect={false}
                  isMulti
                  value={listStudioTechniques.filter((item) => {
                    return requirement?.studioTechniques?.member.includes(item.value);
                  })}
                  options={listStudioTechniques}
                  styles={colourStyles}
                  onChange={(value: any) => {
                    if (requirement)
                      setRequirement({
                        ...requirement,
                        studioTechniques: {
                          ...requirement.studioTechniques,
                          member: value.map((item: any) => item.value),
                        },
                      });
                    console.log('🚀 ~ RequirementDetail ~ value:', value);
                  }}
                />
              </div>

              <div className="flex justify-start gap-1">
                <div className="w-1/3 flex items-center gap-2">
                  <label className="text-black text-lg font-medium ">Kỹ thuật âm thanh</label>
                  <p className="py-1 px-4 rounded-xl bg-[#999] text-white">
                    {requirement?.soundTechniques.quantity ?? 0}
                  </p>
                </div>
                <Select
                  placeholder={user?.isAdmin ? (requirement?.soundTechniques ? 'Chọn thành viên' : '') : ''}
                  isDisabled={user?.isAdmin ? (requirement?.soundTechniques.quantity ? false : true) : true}
                  closeMenuOnSelect={false}
                  isMulti
                  value={listSoundTechniques.filter((item) => {
                    return requirement?.soundTechniques?.member.includes(item.value);
                  })}
                  options={listSoundTechniques}
                  styles={colourStyles}
                  onChange={(value: any) => {
                    if (requirement)
                      setRequirement({
                        ...requirement,
                        soundTechniques: {
                          ...requirement.soundTechniques,
                          member: value.map((item: any) => item.value),
                        },
                      });
                    console.log('🚀 ~ RequirementDetail ~ value:', value);
                  }}
                />
              </div>

              <div className="flex justify-start gap-1">
                <div className="w-1/3 flex items-center gap-2">
                  <label className="text-black text-lg font-medium ">Kỹ thuật ánh sáng</label>
                  <p className="py-1 px-4 rounded-xl bg-[#999] text-white">
                    {requirement?.lightingTechniques.quantity ?? 0}
                  </p>
                </div>

                <Select
                  placeholder={user?.isAdmin ? (requirement?.lightingTechniques ? 'Chọn thành viên' : '') : ''}
                  isDisabled={user?.isAdmin ? (requirement?.lightingTechniques.quantity ? false : true) : true}
                  closeMenuOnSelect={false}
                  isMulti
                  value={listLightingTechniques.filter((item) => {
                    return requirement?.lightingTechniques?.member.includes(item.value);
                  })}
                  options={listLightingTechniques}
                  styles={colourStyles}
                  onChange={(value: any) => {
                    if (requirement)
                      setRequirement({
                        ...requirement,
                        lightingTechniques: {
                          ...requirement.lightingTechniques,
                          member: value.map((item: any) => item.value),
                        },
                      });
                    console.log('🚀 ~ RequirementDetail ~ value:', value);
                  }}
                />
              </div>

              <div className="flex justify-start gap-1">
                <div className="w-1/3 flex items-center gap-2">
                  <label className="text-black text-lg font-medium ">Quay phim</label>
                  <p className="py-1 px-4 rounded-xl bg-[#999] text-white">{requirement?.filming.quantity ?? 0}</p>
                </div>

                <Select
                  placeholder={user?.isAdmin ? (requirement?.filming ? 'Chọn thành viên' : '') : ''}
                  isDisabled={user?.isAdmin ? (requirement?.filming.quantity ? false : true) : true}
                  closeMenuOnSelect={false}
                  isMulti
                  options={listFilming}
                  styles={colourStyles}
                  value={listFilming.filter((item) => {
                    return requirement?.filming?.member.includes(item.value);
                  })}
                  onChange={(value: any) => {
                    if (requirement)
                      setRequirement({
                        ...requirement,
                        filming: {
                          ...requirement.filming,
                          member: value.map((item: any) => item.value),
                        },
                      });
                    console.log('🚀 ~ RequirementDetail ~ value:', value);
                  }}
                />
              </div>

              <div className="flex justify-start gap-1">
                <div className="w-1/3 flex items-center gap-2">
                  <label className="text-black text-lg font-medium ">Phương tiện di chuyển</label>
                  <p className="py-1 px-4 rounded-xl bg-[#999] text-white">{requirement?.vehicles?.type}</p>
                </div>

                <Select
                  placeholder={user?.isAdmin ? (requirement?.vehicles ? 'Chọn xe' : '') : ''}
                  isDisabled={user?.isAdmin ? (requirement?.vehicles?.type === 'Xe cơ quan' ? false : true) : true}
                  closeMenuOnSelect={false}
                  isMulti
                  options={listVehicles.map((vh: any) => {
                    return {
                      ...vh,
                      isDisabled: JSON.stringify(requirementByTime).includes(vh.id),
                    };
                  })}
                  styles={colourStyles}
                  value={listVehicles.filter((item) => {
                    return requirement?.vehicles?.cars?.includes(item.value);
                  })}
                  onChange={(value: any) => {
                    if (requirement)
                      setRequirement({
                        ...requirement,
                        vehicles: {
                          type: requirement?.vehicles?.type ?? 'Xe taxi',
                          cars: value.map((item: any) => item.value),
                        },
                      });
                    console.log('🚀 ~ RequirementDetail ~ value:', value);
                  }}
                />
              </div>

              {requirement?.vehicles?.type === 'Xe cơ quan' && (
                <div className="flex justify-start gap-1">
                  <div className="w-1/3 flex items-center gap-2">
                    <label className="text-black text-lg font-medium ">Lái xe</label>
                  </div>

                  <Select
                    placeholder={user?.isAdmin ? 'Chọn thành viên' : ''}
                    isDisabled={user?.isAdmin ? (requirement?.vehicles?.type === 'Xe cơ quan' ? false : true) : true}
                    closeMenuOnSelect={false}
                    isMulti
                    options={listDrivers}
                    styles={colourStyles}
                    value={listDrivers.filter((item) => {
                      return requirement?.vehicles?.drivers?.includes(item.value);
                    })}
                    onChange={(value: any) => {
                      if (requirement)
                        setRequirement({
                          ...requirement,
                          vehicles: {
                            ...(requirement?.vehicles ?? null),
                            drivers: value.map((item: any) => item.value),
                          },
                        });
                      console.log('🚀 ~ RequirementDetail ~ value:', value);
                    }}
                  />
                </div>
              )}
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
                <button
                  onClick={() => {
                    setPopupType('error');
                    setShowPopup(true);
                  }}
                  type="button"
                  className="!bg-[#ffffff00] text-[#999999] !p-0 !text-base !outline-none"
                >
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
    </>
  );
}

const convertToSelectOption = (data: User[], requirementInTime: Requirement[]) => {
  const result = data.map((item) => {
    return {
      value: item.id,
      label: item.fullName,
      color: item.color ?? '#f5f5f5',
      isDisabled: JSON.stringify(requirementInTime).includes(item.id),
    };
  });
  return result.sort((a, b) => (a.isDisabled > b.isDisabled ? 1 : -1));
};

import chroma from 'chroma-js';
import { User } from '../../types/user';
import { Vehicle } from '../../types/vehicle.';
// import MyPDF from './PDFPage';

const colourStyles: StylesConfig<
  {
    value: string;
    label: string;
    color: string;
  },
  true
> = {
  container: (styles, { isDisabled }) => ({
    ...styles,
    width: '66.66%',
    backgroundColor: isDisabled ? '#d5d5d5af' : 'white',
    borderRadius: '10px',
    border: '1px solid #999999',
  }),
  control: (styles) => ({ ...styles, backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }),
  option: (styles, { data, isDisabled, isSelected }) => {
    const color = chroma(data.color ?? '#fff');
    return {
      ...styles,
      backgroundColor: 'transparent',
      // color: isDisabled ? '#ccc' : isSelected ? (chroma.contrast(color, 'white') > 2 ? 'white' : 'black') : data.color,
      color: isDisabled ? '#ccc' : '#000',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.3).css()) : undefined,
      },
      ':hover': {
        background: '#f5f5f5',
      },
    };
  },
  multiValue: (styles, { data }) => {
    // const color = chroma(data.color ?? '#fff');
    return {
      ...styles,
      // backgroundColor: color.alpha(0.1).css(),
      backgroundColor: data.color + '70',
      padding: '4px 10px',
      borderRadius: '10px',
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: '#000',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      color: '#000',
    },
  }),
};

// Get all requests within the admitted time period
const getRequirementByTime = (
  requirements: Requirement[],
  startDate: number,
  endDate: number,
  currentRequirement: Requirement,
) => {
  return requirements.filter((requirement) => {
    console.log('🚀 ~ returnrequirements.filter ~ currentRequirement.id === requirement.id:', requirement.id);
    if (currentRequirement.id === requirement.id) return false;
    if (
      new Date(requirement.startDate).getTime() <= new Date(startDate).getTime() &&
      new Date(startDate).getTime() <= new Date(requirement.endDate).getTime()
    ) {
      return true;
    }
    if (
      new Date(requirement.startDate).getTime() <= new Date(endDate).getTime() &&
      new Date(endDate).getTime() <= new Date(requirement.endDate).getTime()
    ) {
      return true;
    }

    if (
      new Date(startDate).getTime() <= new Date(requirement.startDate).getTime() &&
      new Date(endDate).getTime() >= new Date(requirement.endDate).getTime()
    ) {
      return true;
    }

    return false;
  });
};

import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useRef, useState } from 'react';
import { addVehicle, getAllVehicle, removeVehicle, updateVehicle, uploadVehicleImage } from '../../apis/userAPI';
import RowItem from '../RowItem';
import { Pagination, PaginationItem, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAppDispatch } from '../../redux/hook';
import { switchPopup } from '../../redux/reducers/commonSlice';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Vehicle } from '../../types/vehicle.';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const itemPerPage = 6;

type PopupType = 'warning' | 'success';

export interface IVehicleListProps {}

export default function VehicleList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<PopupType>('warning');
  const [currentVehicleToRemove, setCurrentVehicleToRemove] = useState<string | null>(null);

  const [allVehicle, setAllVehicle] = useState<Vehicle[]>([]);

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [vehiclePerPage, setVehiclePerPage] = useState<Vehicle[]>([]);

  useEffect(() => {
    const start = (page - 1) * itemPerPage;
    const end = start + itemPerPage;
    setVehiclePerPage(allVehicle.slice(start, end));
    setCount(Math.max(~~(allVehicle.length / itemPerPage) + (allVehicle.length % itemPerPage === 0 ? 0 : 1), 1));
  }, [page, allVehicle]);

  useEffect(() => {
    (async () => {
      await getAllVehicle().then((data) => {
        console.log('🚀 ~ awaitgetAllVehicle ~ data:', data);
        setAllVehicle(data ?? []);
      });
    })();
  }, []);

  const handleAddUser = () => {
    dispatch(switchPopup({ isShowPopup: true, popupElement: <AddVehiclePopup /> }));
  };

  const handleRemoveVehicle = async () => {
    await removeVehicle(currentVehicleToRemove ?? '').then(async () => {
      await getAllVehicle().then((data) => {
        setPopupType('success');
        setShowPopup(true);
        setAllVehicle(data ?? []);
        setCurrentVehicleToRemove(null);
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
              <p className="text-[#999999] text-xl font-semibold">Bạn có chắc chắn sẽ xoá phương tiện này không?</p>
              <div className="flex gap-2 items-center font-semibold ">
                <div
                  onClick={() => setShowPopup(false)}
                  className="text-vtv-blue px-4 border border-vtv-blue rounded-full !py-1 cursor-pointer"
                >
                  Hủy
                </div>
                <button
                  onClick={() => {
                    handleRemoveVehicle();
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
              <p className="text-[#999999] text-xl font-semibold">Xóa phương tiện thành công</p>
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
            <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">Danh sách phương tiện di chuyển</h2>
            <div className="flex gap-2 justify-end text-xs text-black">
              <button className="flex gap-1 items-center !py-1" type="button" onClick={handleAddUser}>
                <AddIcon />
                <p>Thêm</p>
              </button>
            </div>
          </div>
          <div className="w-full relative h-full ">
            <div className="flex h-full flex-col gap-3">
              {vehiclePerPage?.map((vehicle, i) => (
                <RowItem key={vehicle.id || i}>
                  <div className="w-full flex justify-between items-center">
                    <div className="w-1/3 flex gap-2 items-center">
                      <img src={vehicle?.image} alt="" className="w-8 h-8 rounded-full" />
                      <p className="font-semibold">{vehicle?.licensePlate}</p>
                    </div>
                    <div className="w-1/3 text-start flex items-center justify-between pr-[5%]">
                      <p>{vehicle?.model}</p>
                      <p>{vehicle?.dominantColor}</p>
                    </div>
                    <div className="w-1/3 text-end flex justify-between">
                      <div className="flex items-center gap-1">
                        <FiberManualRecordIcon
                          color={vehicle.status === 'Đang chờ' ? 'success' : 'error'}
                          sx={{ fontSize: '14px' }}
                        />
                        {vehicle?.status}
                      </div>
                      <div className="flex gap-4">
                        <p
                          onClick={() => {
                            dispatch(
                              switchPopup({
                                isShowPopup: true,
                                popupElement: (
                                  <AddVehiclePopup
                                    onSuccess={() => {
                                      getAllVehicle().then((data) => {
                                        setAllVehicle(data ?? []);
                                      });
                                    }}
                                    vehicle={allVehicle.find((veh) => veh.id === vehicle.id)}
                                  />
                                ),
                              }),
                            );
                            setCurrentVehicleToRemove(vehicle.id);
                          }}
                          className="flex text-vtv-blue cursor-pointer"
                        >
                          Sửa
                        </p>
                        <p
                          onClick={() => {
                            setPopupType('warning');
                            setShowPopup(true);
                            setCurrentVehicleToRemove(vehicle.id);
                          }}
                          className="flex text-vtv-red cursor-pointer"
                        >
                          Xóa
                        </p>
                      </div>
                    </div>
                  </div>
                </RowItem>
              ))}
            </div>
            <div className="absolute bottom-0 px-4 py-2 text-[#999999] text-sm">{`Tổng số phương tiện: ${
              page * vehiclePerPage.length
            }/${allVehicle?.length}`}</div>
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

interface AddVehiclePopupProps {
  vehicle?: Vehicle;
  onSuccess?: () => void;
}
const AddVehiclePopup = (props: AddVehiclePopupProps) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');
  const avatarChange = useRef<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(props.vehicle?.image ?? '');
  const [avatarPreview, setAvatarPreview] = useState(props.vehicle?.image ?? '');

  const [form, setForm] = useState<Vehicle>({
    id: props.vehicle?.id ?? '',
    licensePlate: props.vehicle?.licensePlate ?? '',
    model: props.vehicle?.model ?? '',
    color: props.vehicle?.color ?? '',
    image: props.vehicle?.image ?? '',
    createdAt: props.vehicle?.createdAt ?? '',
    dominantColor: props.vehicle?.dominantColor ?? '',
    status: props.vehicle?.status ?? 'Đang chờ',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (props.vehicle) {
      updateVehicle({ ...form }).then(() => {
        //Check if avatar is changed
        if (!avatarChange.current) {
          dispatch(switchPopup({ isShowPopup: false }));
        } else {
          uploadVehicleImage(avatar ?? '', form.id).then(() => {
            dispatch(switchPopup({ isShowPopup: false }));
            avatarChange.current = false;
          });
        }
      });
    } else {
      if (!avatarChange.current || !avatar) {
        setError('Vui lòng nhập hình ảnh của xe');
      } else
        addVehicle(form)
          .then((vehicle) => {
            updateVehicle({ ...vehicle }).then(() => {
              uploadVehicleImage(avatar ?? '', vehicle.id).then(() => {
                console.log('Upload avatar success');
              });
            });
            dispatch(switchPopup({ isShowPopup: false }));
          })
          .catch((error) => {
            setError(error.toString().split('Error: ')[1]);
          });
    }
    props.onSuccess && props.onSuccess();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    avatarChange.current = true;
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
            <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">Thêm phương tiện</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-[50vw] min-w-[600px] max-w-[1042px] flex flex-col gap-5">
          <div
            onClick={() => {
              inputRef.current?.click();
            }}
            className="cursor-pointer flex flex-col justify-center items-center text-[#999999]"
          >
            <input onChange={handleAvatarChange} accept="image/*" type="file" className="hidden" ref={inputRef} />
            <img
              src={avatarPreview ? avatarPreview : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="bg-[#DBDBDB] w-[30px] h-[30px] rounded-full flex justify-center items-center border -mt-4">
              <CameraAltIcon color="inherit" fontSize="small" />
            </div>
            Nhập hình ảnh của xe
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="licensePlate" className="text-lg font-medium text-black flex flex-shrink-0">
              Biển số xe
            </label>
            <input
              placeholder="Nhập biển số xe"
              required
              title=""
              onChange={handleChange}
              value={form.licensePlate}
              id="licensePlate"
              name="licensePlate"
              type="text"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="dominantColor" className="text-lg font-medium text-black flex flex-shrink-0">
              Màu chủ đạo của xe
            </label>
            <input
              onChange={handleChange}
              placeholder="Nhập màu sắc chủ đạo của xe"
              title=""
              value={form.dominantColor}
              id="dominantColor"
              name="dominantColor"
              type="dominantColor"
              className="text-black !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="model" className="text-lg font-medium text-black flex flex-shrink-0">
              Mẫu xe
            </label>
            <input
              placeholder="Mẫu xe, ví dụ: Camry 2021, CRV 2020..."
              onChange={handleChange}
              required
              title=""
              value={form.model}
              id="model"
              name="model"
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

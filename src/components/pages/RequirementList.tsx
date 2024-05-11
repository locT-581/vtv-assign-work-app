import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import RequirementItem from '../RequirementItem';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import { switchPopup } from '../../redux/reducers/commonSlice';
import { getCities } from '../../apis/userAPI';
import { Province } from '../../types/common';
import { useNavigate } from 'react-router-dom';

export interface IRequirementListProps {}

export default function RequirementList() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [cities, setCities] = useState<Province[]>([]);

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

  useEffect(() => {
    if (user && !requirements) dispatch(getAllRequirementAsync({ userId: null }));
    return () => {
      dispatch(switchPopup({ isShowPopup: false, popupElement: null }));
    };
  }, [dispatch, requirements, user]);

  return (
    <div className="bg-white max-w-[400px] h-[calc(100vh-64px)] rounded-3xl px-4 py-10">
      <h2 className="w-full text-start text-2xl text-black font-semibold">Yêu cầu sắp tới</h2>
      <div className="w-full h-full flex flex-col gap-4 overflow-y-auto pt-2">
        {requirements?.map((item, i) => (
          <RequirementItem
            onClick={() => navigate(`/chi-tiet-yeu-cau/${item.id}`)}
            key={item.id || i}
            title={item.title || ''}
            avatar={item.user?.avatar || ''}
            username={item.user?.fullName || ''}
            address={cities.find((city) => city.province_id === item.address)?.province_name || ''}
            date={
              `${new Date(item.startDate).getDay()}-${new Date(item.startDate).getMonth() + 1}-${new Date(
                item.startDate,
              ).getFullYear()}` + '' || ''
            }
            status={item.status || ''}
          />
        ))}
      </div>
    </div>
  );
}

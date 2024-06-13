import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import RequirementItem from '../RequirementItem';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import { switchPopup } from '../../redux/reducers/commonSlice';
import { getAllUsers, getCities } from '../../apis/userAPI';
import { Province } from '../../types/common';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import { Requirement } from '../../types/requirement';

export interface IRequirementListProps {}

export default function RequirementList() {
  const { requirements } = useAppSelector((state) => state.requirementSlice);
  const { user } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [cities, setCities] = useState<Province[]>([]);

  const [allUser, setAllUser] = useState<User[]>([]);
  const [sortedRequirements, setSortedRequirements] = useState<Requirement[]>([]);

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

      await getAllUsers().then((users: User[] | null) => {
        if (users) setAllUser(users);
        else setAllUser([]);
      });
    })();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        !requirements && dispatch(getAllRequirementAsync({ userId: null }));
      } else {
        !requirements && dispatch(getAllRequirementAsync({ userId: user?.id ?? '' }));
      }
    }

    if (user && requirements) {
      // sort by status and date
      const sorted = [...requirements].sort((a, b) => {
        if (a.status === b.status) {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return a.status === 'Đang chờ' ? -1 : 1;
      });
      setSortedRequirements(sorted);
    }
    return () => {
      dispatch(switchPopup({ isShowPopup: false, popupElement: null }));
    };
  }, [dispatch, requirements, user]);

  return (
    <div className="bg-white w-full h-[calc(100vh-64px)] rounded-3xl px-4 py-10">
      <h2 className="w-full text-start text-2xl text-black font-semibold">Yêu cầu sắp tới</h2>
      <div className="w-full h-full flex flex-col gap-4 overflow-y-auto pt-2">
        {sortedRequirements?.map((item, i) => (
          <RequirementItem
            level={item.level || 'Thấp'}
            onClick={() => navigate(`/chi-tiet-yeu-cau/${item.id}`)}
            key={item.id || i}
            title={item.title || ''}
            avatar={allUser.find((user: User) => item.user === user.id)?.avatar || ''}
            username={allUser.find((user: User) => item.user === user.id)?.fullName || ''}
            address={cities.find((city) => city.province_id === item.address)?.province_name || ''}
            date={
              `${new Date(item.startDate).getDate()}-${new Date(item.startDate).getMonth() + 1}-${new Date(
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

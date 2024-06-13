import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RowItem from '../RowItem';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { getAllRequirementAsync } from '../../redux/reducers/requirementSlice';
import { Requirement } from '../../types/requirement';
import { useEffect, useState } from 'react';
import { getCities } from '../../apis/userAPI';
import { Province } from '../../types/common';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import formatDate from '../../utils/formatDate';
import { Link } from 'react-router-dom';
const itemPerPage = 7;

export interface IAppProps {}

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userSlice);
  const { requirements } = useAppSelector((state) => state.requirementSlice);

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [requirementsPerPage, setRequirementsPerPage] = useState<Requirement[]>([]);
  const [cities, setCities] = useState<Province[]>([]);

  useEffect(() => {
    if (requirements) {
      const start = (page - 1) * itemPerPage;
      const end = start + itemPerPage;
      setRequirementsPerPage(requirements.slice(start, end));
      setCount(Math.max(~~(requirements.length / itemPerPage), 1));
    }
  }, [requirements, page]);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        !requirements && dispatch(getAllRequirementAsync({ userId: null }));
      } else {
        !requirements && dispatch(getAllRequirementAsync({ userId: user?.id ?? '' }));
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
    })();
  }, [requirements, dispatch, user]);

  return (
    <div className="w-full relative h-full ">
      <div className="flex h-full flex-col gap-4">
        {requirementsPerPage?.map((requirement) => (
          <Link key={requirement.id} to={'/chi-tiet-yeu-cau/' + requirement.id}>
            <RowItem key={requirement.id}>
              <div className="w-[40%] text-vtv-blue text-lg font-semibold">
                {
                  // Truncate the title to 50 characters
                  requirement.title.length > 20 ? requirement.title.slice(0, 20) + '...' : requirement.title
                }
              </div>
              <div className="w-[60%] flex justify-between items-center">
                <div className="w-1/4 flex gap-1 items-center">
                  <img src={user?.avatar} alt="" className="w-5 h-5 rounded-full" />
                  <p>
                    {(user?.fullName.split(' ')[user?.fullName.split(' ').length - 2] ?? '') +
                      ' ' +
                      (user?.fullName.split(' ')[user?.fullName.split(' ').length - 1] ?? '')}
                  </p>
                </div>
                <div className="w-1/4 text-center">
                  {cities.find((city) => city.province_id === requirement.address)?.province_name}
                </div>
                <div className="w-1/4 text-center">{formatDate(requirement.startDate)}</div>
                <div className="w-1/4 flex gap-1  justify-end">
                  <FiberManualRecordIcon
                    color={
                      requirement.status === 'Đã phân công'
                        ? 'success'
                        : requirement.status === 'Đang chờ'
                        ? 'warning'
                        : 'error'
                    }
                    sx={{ fontSize: '14px' }}
                  />
                  <p className="text-[10px]">{requirement.status.toString()}</p>
                </div>
              </div>
            </RowItem>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-0 px-4 py-2 text-[#999999] text-sm">{`Tổng số yêu cầu: ${
        page * requirementsPerPage.length
      }/${requirements?.length}`}</div>
      <Stack spacing={2} sx={{ alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Pagination
          onChange={(_, page) => setPage(page)}
          count={count}
          renderItem={(item) => (
            <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
          )}
        />
      </Stack>
    </div>
  );
}

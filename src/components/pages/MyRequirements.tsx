import * as React from 'react';
import TableList from '../TableList';
import DefaultLayout from '../layouts/DefaultLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

export interface IMyRequirementProps {}

export default function MyRequirement() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="h-full max-h-full w-full flex flex-col bg-white p-12 rounded-3xl">
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
          <h2 className="w-full text-start text-4xl text-[#2D3581] font-semibold">Danh sách yêu cầu</h2>
          <span className="text-xs text-black">Lọc theo</span>
        </div>
        <TableList />
      </div>
    </DefaultLayout>
  );
}

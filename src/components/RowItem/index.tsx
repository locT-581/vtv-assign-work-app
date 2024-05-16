import * as React from 'react';

export interface IRowItemProps {
  children: React.ReactNode;
}

export default function RowItem(props: IRowItemProps) {
  return (
    <div className="justify-between bg-white rounded-2xl border border-[#DBDBDB] shadow-md flex px-10 py-4">
      {props.children}
    </div>
  );
}

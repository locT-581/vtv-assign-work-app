import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tag from '../../Tag';

export interface IMonthCalendarProps {}

export default function MonthCalendar() {
  const [cellWidth, setCellWidth] = React.useState<string>('');
  React.useEffect(() => {
    const containerWidth = document.getElementById('container')?.getBoundingClientRect().width ?? 0;
    setCellWidth(`${containerWidth / 7 - 2}px`);
  }, []);
  return (
    <>
      <TableContainer
        id="container"
        component={Paper}
        sx={{ position: 'absolute', height: '100%', padding: '0px !important', boxShadow: 'none' }}
      >
        <Table sx={{ minWidth: 650, height: '100%' }} aria-label="simple table">
          <TableHead sx={{ border: '1px solid #D6D6D6' }}>
            <TableRow sx={{ background: '#F5F5F5' }}>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Thứ 2
              </TableCell>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Thứ 3
              </TableCell>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Thứ 4
              </TableCell>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Thứ 5
              </TableCell>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Thứ 6
              </TableCell>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Thứ 7
              </TableCell>
              <TableCell sx={{ width: cellWidth, padding: '6px 0' }} align="center">
                Chủ nhật
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                id="1"
                sx={{
                  width: cellWidth,
                  borderRight: '1px solid #D6D6D6',
                  borderLeft: '1px solid #D6D6D6',
                  padding: '0px',
                  height: '100px',
                }}
                align="center"
              ></TableCell>
              <TableCell
                id="2"
                sx={{ width: cellWidth, borderRight: '1px solid #D6D6D6', padding: '0px', height: '100px' }}
                align="center"
              ></TableCell>
              <TableCell
                id="3"
                sx={{ width: cellWidth, borderRight: '1px solid #D6D6D6', padding: '0px', height: '100px' }}
                align="center"
              ></TableCell>
              <TableCell
                id="4"
                sx={{ width: cellWidth, borderRight: '1px solid #D6D6D6', padding: '0px', height: '100px' }}
                align="center"
              ></TableCell>
              <TableCell
                id="5"
                sx={{ width: cellWidth, borderRight: '1px solid #D6D6D6', padding: '0px', height: '100px' }}
                align="center"
              ></TableCell>
              <TableCell
                id="6"
                sx={{ width: cellWidth, borderRight: '1px solid #D6D6D6', padding: '0px', height: '100px' }}
                align="center"
              ></TableCell>
              <TableCell
                id="7"
                sx={{ width: cellWidth, borderRight: '1px solid #D6D6D6', padding: '0px', height: '100px' }}
                align="center"
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className="absolute top-[50px] bottom-0 overflow-auto flex flex-col gap-y-2">
        <Tag
          title="Title"
          avatar="https://via.placeholder.com/150"
          username="Username"
          address="Address"
          status="Status"
          className={'bg-[#D3FDE5] '}
          style={{ width: cellWidth }}
        />
        <Tag
          title="Title"
          avatar="https://via.placeholder.com/150"
          username="Username"
          address="Address"
          status="Status"
          className="bg-[#ffb5a3] w-[350px]"
        />
      </div>
    </>
  );
}

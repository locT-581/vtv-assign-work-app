/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

import Roboto from '../../assets/fonts/Roboto-Medium.ttf'; // Đường dẫn đến tệp font chữ của bạn
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Requirement } from '../../types/requirement';
import { Province } from '../../types/common';
import { getAllUsers, getAllVehicle, getCities } from '../../apis/userAPI';
import { User } from '../../types/user';
import { Vehicle } from '../../types/vehicle.';
// Register font
Font.register({
  family: 'Roboto',
  src: Roboto,
});
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
    fontFamily: 'Roboto',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    margin: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '14%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

// Create Document Component

interface PDFProps {
  requirementToPrint: any;
  month: string;
  year: string;
}

function PDF({ requirementToPrint, month, year }: PDFProps) {
  console.log('🚀 _++++  :', requirementToPrint, month, year);

  // const firstDay = new Date(Number(year), +month, 1);
  // const lastDay = new Date(Number(year), +month + 1, 0);

  const [cities, setCities] = useState<Province[]>([]);
  const [allUser, setAllUser] = useState<User[]>([]);
  const [listVehicles, setListVehicles] = useState<any[]>([]);

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

      getAllVehicle().then((vehicles) => {
        setListVehicles(vehicles);
      });
    })();
  }, []);

  const PdfDocument = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>LỊCH CÔNG TÁC THÁNG VTV5 TÂY NAM BỘ</Text>
          <Text style={styles.subtitle}>{`Tháng ${month}/${year}`}</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Ngày giờ</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Đề tài</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Âm thanh + Ánh sáng</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Quay phim + Kỹ thuật</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Địa bàn</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Xe + Lái xe + Km</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Ghi chú</Text>
              </View>
            </View>
            {requirementToPrint.map((requirement: Requirement, i: number) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {`${new Date(requirement.startDate).getDate()}-${new Date(requirement.endDate).getDate()}/${
                      new Date(requirement.startDate).getMonth() + 1
                    }/${new Date(requirement.startDate).getFullYear()}` + '' || ''}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{requirement.title}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {getNameOfUser(
                      [...requirement.lightingTechniques.member, ...requirement.soundTechniques.member],
                      allUser,
                    )}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {requirement?.studioTechniques
                      ? getNameOfUser(
                          [...requirement.filming.member, ...(requirement?.studioTechniques?.member ?? [])],
                          allUser,
                        )
                      : getNameOfUser([...requirement.filming.member], allUser)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {cities.find((city) => city.province_id === requirement.address)?.province_name || ''}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {(requirement?.vehicles?.type === 'Xe cơ quan'
                      ? `${getNameOfVehicles([...(requirement?.vehicles?.cars ?? [])], listVehicles)} + ${getNameOfUser(
                          [...(requirement?.vehicles.drivers ?? [])],
                          allUser,
                        )}`
                      : 'Taxi') +
                      '  - ' +
                      (requirement?.km || 0) +
                      'km'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{requirement.note}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };
  return (
    <div
      className={`  py-2 text-center rounded-full ${
        requirementToPrint?.length > 0 ? 'bg-vtv-blue text-white' : 'bg-[#939393] color-black'
      }`}
    >
      {requirementToPrint?.length > 0 ? (
        <PDFDownloadLink document={<PdfDocument />} fileName={`VTV5-Phan-cong-cong-tac-thang-${month}.pdf`}>
          {({ loading }) =>
            loading ? (
              'Đang khởi tạo...'
            ) : (
              <div className="flex items-center justify-center gap-1 ">
                <p>Tải xuống</p>
                <FileDownloadIcon />
              </div>
            )
          }
        </PDFDownloadLink>
      ) : (
        'Không có dữ liệu'
      )}
    </div>
  );
}

export default PDF;

const getNameOfUser = (membersId: string[] = [], allUser: User[]) => {
  const temp: string[] = [];
  membersId.forEach((id) => {
    const user = allUser.find((user) => user.id === id);
    if (user) {
      temp.push(user.fullName?.slice(user.fullName?.lastIndexOf(' ') + 1));
    }
  });
  console.log('🚀 ~ getNameOfUser ~ members:', temp);

  return temp.join(', ');
};

const getNameOfVehicles = (carId: string[] = [], allVehicle: Vehicle[]) => {
  const temp: string[] = [];

  carId.forEach((id) => {
    const vehicle = allVehicle.find((vehicle) => vehicle.id === id);
    if (vehicle) {
      temp.push(vehicle.licensePlate);
    }
  });

  return temp.join(', ');
};

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  color: string; // hex color, color of tag
  dominantColor: string;
  image: string;
  createdAt: string;
  status: 'Đang hoạt động' | 'Đang chờ' | 'Đã ngừng hoạt động';
}

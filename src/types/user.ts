export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  department: string;
  isAdmin?: boolean;
}

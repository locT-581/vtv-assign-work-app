import { User } from 'firebase/auth';
import { auth } from '../configs/firebase';

const isAuthenticated = (): User | null => auth.currentUser;

export default isAuthenticated;

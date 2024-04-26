import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types/user';

/**
 * Login user by firebase Auth
 * @param {email, password} - email and password
 * @returns {Promise} - Promise<AuthCredential>
 */
export const login = async ({ email, password }: { email: string; password: string }) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Get user by id in firestore database
 * @param id - user id
 * @returns {Promise} - Promise<DocumentSnapshot<DocumentData>>
 */
export const getUserById = async (id: string): Promise<User | null> => {
  let user: User | null = null;
  await getDoc(doc(db, 'users', id))
    .then((doc) => {
      if (doc.exists()) {
        user = { id: doc.id, ...doc.data() } as User;
      } else {
        console.log('No such document!');
        return null;
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
      return null;
    });

  return user;
};

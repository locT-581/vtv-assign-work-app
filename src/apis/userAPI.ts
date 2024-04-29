import { UserCredential, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { DocumentData, addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';

import { auth, db } from '../configs/firebase';
import { User } from '../types/user';
import { Requirement, SupportTeams } from '../types/requirement';
import axios from 'axios';
import { District, Province } from '../types/common';

/**
 * Login user by firebase Auth
 * @param {email, password} - email and password
 * @returns {Promise} - Promise<AuthCredential>
 */
export const login = async ({ email, password }: { email: string; password: string }): Promise<UserCredential> =>
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

/**
 * Sign out user
 * @returns {Promise} - Promise<void>
 */
export const logout = (): Promise<void> => signOut(auth);

/**
 * Get all requirement from firestore database
 * @returns {Promise} - Promise<Requirement | null>
 */
export const getAllRequirement = async ({ userId }: { userId: string | null }): Promise<Requirement[]> => {
  // Check if userId is null then getAll requirement in requirements collection
  // else get all requirement by userId
  let requirements: Requirement[] = [];
  const requirementRef = collection(db, 'requirements');
  if (userId === null) {
    await getDocs(requirementRef)
      .then((querySnapshot) => {
        const data: Requirement[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Requirement);
        });
        requirements = data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
        return [];
      });
  } else {
    const queryRequirement = query(requirementRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    await getDocs(queryRequirement)
      .then((querySnapshot) => {
        const data: Requirement[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Requirement);
        });
        requirements = data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
        return [];
      });
  }
  return requirements;
};

/**
 *  Get all cities from vapi.vnappmob.com
 * @returns {Promise} - Promise<Province[]>
 */
export const getCities = async (): Promise<Province[]> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.get('https://vapi.vnappmob.com/api/province/', config);
    return [...data.results];
  } catch (error) {
    throw new Error(error + '' || 'Error getting cities');
  }
};

/**
 * Get all districts by provinceId from vapi.vnappmob.com
 * @param provinceId - provinceId
 * @returns {Promise} - Promise<District[]>
 */
export const getDistricts = async (provinceId: string): Promise<District[]> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.get(`https://vapi.vnappmob.com/api/province/${provinceId}`, config);
    return [...data.results];
  } catch (error) {
    throw new Error(error + '' || 'Error getting districts');
  }
};

/**
 * Get all support teams from firestore
 * @returns {Promise} - Promise<SupportTeams[]>
 *
 */
export const getAllSupportTeams = async (): Promise<SupportTeams[]> => {
  // Get all support teams from firestore
  const supportTeams: SupportTeams[] = [];
  const supportTeamsRef = collection(db, 'support-teams');
  await getDocs(supportTeamsRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        supportTeams.push({ id: doc.id, team: doc.data().name });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      return [];
    });
  return supportTeams;
};

/**
 * Create new requirement in firestore
 * @param requirement - requirement
 * @returns {Promise} - Promise<DocumentData>
 */
export const createRequirement = async (requirement: Requirement): Promise<DocumentData> =>
  await addDoc(collection(db, 'requirements'), requirement);

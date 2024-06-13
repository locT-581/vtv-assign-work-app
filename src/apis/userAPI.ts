/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { auth, db, storage } from '../configs/firebase';
import { User } from '../types/user';
import { Department, Requirement } from '../types/requirement';
import axios from 'axios';
import { District, Province } from '../types/common';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Vehicle } from '../types/vehicle.';

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
        const { createAt, ...tempUser } = doc.data();
        console.log('🚀 ~ .then ~ createdAt:', createAt);
        user = { id: doc.id, ...tempUser } as User;
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
    const queryRequirement = query(requirementRef, where('user', '==', userId), orderBy('createdAt', 'desc'));
    await getDocs(queryRequirement)
      .then((querySnapshot) => {
        console.log(querySnapshot);
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
 * Create new requirement in firestore
 * @param requirement - requirement
 * @returns {Promise} - Promise<DocumentData>
 */
export const createRequirement = async (requirement: Requirement): Promise<DocumentData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = requirement;
  return await addDoc(collection(db, 'requirements'), { ...rest, createdAt: serverTimestamp() });
};

/**
 * Get all departments from firestore
 * @returns {Promise} - Promise<Department[]>
 * */
export const getAllDepartments = async (): Promise<Department[]> => {
  const departments: Department[] = [];
  const departmentRef = collection(db, 'departments');
  await getDocs(departmentRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        departments.push({ id: doc.id, name: doc.data().name });
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      return [];
    });
  return departments;
};

/**
 * Update user information
 * @param user User - user information to update
 * @returns  {Promise} - Promise<void>
 */
export const updateUserInfo = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.id);
  return await updateDoc(userRef, { ...user });
};

/**
 * Upload avatar to firebase storage
 * @param file - file path
 * @param userId - user id
 * @returns {Promise} - Promise<void>
 */
export const uploadAvatar = async (file: string, userId: string): Promise<void> => {
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg',
  };
  const storageRef = ref(storage, 'user-avatars/' + userId);
  fetch(file)
    .then((response) => response.blob())
    .then((blobData) => {
      const uploadTask = uploadBytesResumable(storageRef, blobData, metadata);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            getUserById(userId).then((user) => {
              if (user) {
                user.avatar = downloadURL;
                updateUserInfo(user).then(() => {
                  console.log('Update avatar success');
                });
              }
            });
          });
        },
      );
    })
    .catch((error) => {
      console.error('Error fetching image data:', error);
    });
};

/**
 * Get all users from firestore
 * @returns {Promise} - Promise<User[]>
 */
export const getAllUsers = async (): Promise<User[] | null> => {
  const users: User[] = [];
  const usersRef = collection(db, 'users');
  await getDocs(query(usersRef, orderBy('createAt', 'desc')))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        console.log('🚀 ~ querySnapshot.forEach ~ createdAt:', doc.id);
        users.push({ ...doc.data(), id: doc.id } as User);
        console.log('🚀 ~ querySnapshot.forEach ~ users:', users);
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      return [];
    });
  console.log('🚀 ~ getAllUsers ~ users:', users);
  return users;
};

// Khi tạo người dùng mới: Tạo người dùng với email và một số thông tin trong DB, gửi mail cho người dùng
// để đăng nhập lần đầu và đổi mật khẩu, khi người dùng đăng nhập thì kiểm tra mail có trong DB hay chưa
// Nếu có thì createUserWithEmailAndPassword và thêm thông tin vào DB, nếu không thì thông báo mail không tồn tại
export const createUserInDatabase = async (user: User): Promise<DocumentData> => {
  // const randomPassword = Math.random().toString(36).slice(-8);
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Check if email is exist in users collection
  const usersRef = collection(db, 'users');
  const queryUsers = query(usersRef, where('email', '==', user.email));
  const querySnapshot = await getDocs(queryUsers);
  if (!querySnapshot.empty) {
    throw new Error('Tài khoản mail đã được sử dụng!');
  }
  return await addDoc(usersRef, {
    ...user,
    avatar: `https://ui-avatars.com/api/?name=${
      user.fullName.split(' ')[user.fullName.split(' ').length - 1][0]
    }&background=${randomColor}&color=fff`,
    color: '#' + randomColor,
    createAt: serverTimestamp(),
    firstLogin: true,
  });
};

export const checkEmailExist = async (email: string): Promise<User | null> => {
  const usersRef = collection(db, 'users');
  const queryUsers = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(queryUsers);

  if (querySnapshot.empty) {
    return null;
  }
  let user: User | null = null;
  querySnapshot.forEach((doc) => {
    user = { id: doc.id, ...doc.data() } as User;
    user.id = doc.id;
  });

  return user;
};

export const createUserInAuth = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    // get user have email in users collection
    checkEmailExist(email).then(async (res: User | null) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { firstLogin, id, ...newUser } = res as User;
      await setDoc(doc(db, 'users', userCredential.user.uid), { id: userCredential.user.uid, ...newUser }).then(
        async () => {
          await deleteDoc(doc(db, 'users', res ? res.id : ''));
        },
      );
    });
    return userCredential;
  });
};

export const updateRequirement = async (requirement: Requirement): Promise<void> => {
  const requirementRef = doc(db, 'requirements', requirement.id);
  return await updateDoc(requirementRef, { ...requirement });
};

export const removeUser = async (userId: string): Promise<void> => {
  console.log(userId);
  return await deleteDoc(doc(db, 'users', userId));
};

export const getAllVehicle = async (): Promise<any> => {
  const vehicles: Vehicle[] = [];
  const vehicleRef = collection(db, 'vehicles');
  await getDocs(vehicleRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        vehicles.push({ id: doc.id, ...doc.data() } as Vehicle);
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      return [];
    });
  return vehicles;
};

export const getVehicleById = async (vehicleId: string): Promise<Vehicle | null> => {
  let vehicle: Vehicle | null = null;
  await getDoc(doc(db, 'vehicles', vehicleId))
    .then((doc) => {
      if (doc.exists()) {
        vehicle = { id: doc.id, ...doc.data() } as Vehicle;
      } else {
        console.log('No such document!');
        return null;
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
      return null;
    });

  return vehicle;
};

export const addVehicle = async (vehicle: Vehicle): Promise<any> => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  let id = '';
  // check if vehicle.licensePlate is exist in vehicles collection
  const vehiclesRef = collection(db, 'vehicles');
  const queryVehicles = query(vehiclesRef, where('licensePlate', '==', vehicle.licensePlate));
  const querySnapshot = await getDocs(queryVehicles);
  if (!querySnapshot.empty) {
    throw new Error('Biển số xe đã được sử dụng!');
  }
  await addDoc(collection(db, 'vehicles'), {
    ...vehicle,
    createdAt: serverTimestamp(),
    color: '#' + randomColor,
  }).then((docRef) => {
    id = docRef.id;
  });

  return { ...vehicle, color: '#' + randomColor, id, createdAt: serverTimestamp() };
};

export const removeVehicle = async (vehicleId: string): Promise<void> => {
  return await deleteDoc(doc(db, 'vehicles', vehicleId));
};

export const updateVehicle = async (vehicle: Vehicle): Promise<void> => {
  const vehicleRef = doc(db, 'vehicles', vehicle.id);
  return await updateDoc(vehicleRef, { ...vehicle });
};

export const uploadVehicleImage = async (file: string, vehicleId: string): Promise<void> => {
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg',
  };
  const storageRef = ref(storage, 'vehicle-avatars/' + vehicleId);
  fetch(file)
    .then((response) => response.blob())
    .then((blobData) => {
      const uploadTask = uploadBytesResumable(storageRef, blobData, metadata);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            getVehicleById(vehicleId)
              .then((vehicle) => {
                if (vehicle) {
                  vehicle.image = downloadURL;
                  updateVehicle(vehicle).then(() => {
                    console.log('Update avatar success');
                  });
                }
              })
              .catch((error) => {
                console.error('Error getting vehicle data:', error);
              });
          });
        },
      );
    })
    .catch((error) => {
      console.error('Error fetching image data:', error);
    });
};

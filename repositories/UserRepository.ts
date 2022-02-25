import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { AUTH_USER_NOT_FOUND } from "../constants/errorCodes";
import User from "../models/User";
import app from "./firebase";

export class UserRepository {

  async create(name: string, email: string, password: string) {

    const auth = getAuth(app);
   
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    
    const db = getDatabase(app);
    await set(ref(db, `users/${userCredentials.user.uid}`), {
      fullName: name,
      email: email,
      password: password
    });

    return userCredentials.user;
  }
  
  async auth(email: string, password: string) {
    const auth = getAuth(app);
   
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    
    return userCredentials.user;
  }

  async get(id: string) {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `users/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as User;
    } else {
      throw new FirebaseError(AUTH_USER_NOT_FOUND, '');
    }
  }

}

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "./firebase";

export class UserRepository {

  async create(displayName: string, email: string, password: string) {

    const auth = getAuth(app);
   
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    
    updateProfile(userCredentials.user, { displayName });
  }
  
  async auth(email: string, password: string) {
    const auth = getAuth(app);
    return signInWithEmailAndPassword(auth, email, password);
  }
}

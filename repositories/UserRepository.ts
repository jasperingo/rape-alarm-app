import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebase";

export class UserRepository {

  create() {

    // const db = getDatabase(app);
    // await set(ref(db, `users/${userCredentials.user.uid}`), {
    //   username: 'Test user',
    //   email: email,
    //   password: password
    // });
  }

  async auth(email: string, password: string) {
    const auth = getAuth(app);
   
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    
    return userCredentials.user;
  }

}

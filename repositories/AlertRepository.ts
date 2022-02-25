
import { FirebaseError } from "firebase/app";
import { 
  child,
  get,
  getDatabase, 
  limitToFirst, 
  onValue, 
  orderByChild, 
  push, 
  query, 
  ref, 
  set, 
  startAfter
} from "firebase/database";
import { AUTH_USER_NOT_FOUND } from "../constants/errorCodes";
import Alert from "../models/Alert";
import app from "./firebase";

export class AlertRepository {

  async create(alert: Alert) {
    
    const db = getDatabase(app);
    const postListRef = ref(db, 'alerts');
    const newPostRef = push(postListRef);
    await set(newPostRef, alert);
    alert.id = newPostRef.key as string;
    return alert;
  }
  
  async get(id: string) {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `alerts/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as Alert;
    } else {
      throw new FirebaseError(AUTH_USER_NOT_FOUND, '');
    }
  }
  
  async getList(page: string, onResult: (result: Alert[])=> void, onError: (error: Error)=> void) {
    
    const db = getDatabase();
    const alertsRef = query(
      ref(db, 'alerts'), 
      orderByChild('date'), 
      startAfter(page),
      limitToFirst(2)
    );

    onValue(
      alertsRef, 
      (snapshot) => {
        const result: Alert[] = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          result.push({ ...childData, id: childKey });
        });
        onResult(result);
      }, 
      onError,
      {
        onlyOnce: true
      }
    );
  }

}


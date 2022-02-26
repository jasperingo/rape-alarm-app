
import { FirebaseError } from "firebase/app";
import { 
  child,
  endBefore,
  get,
  getDatabase, 
  limitToLast, 
  onChildAdded, 
  onValue, 
  orderByChild, 
  push, 
  query, 
  ref, 
  set,
  startAt,
  update, 
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

  async updateStatus(alert: Alert) {
    const db = getDatabase(app);
    const postListRef = ref(db);
    return update(postListRef, {
      [`alerts/${alert.id}`]: alert
    });
  }
  
  async get(id: string) {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `alerts/${id}`));
    if (snapshot.exists()) {
      const alert = snapshot.val() as Alert;
      alert.id = snapshot.key as string;
      return alert;
    } else {
      throw new FirebaseError(AUTH_USER_NOT_FOUND, '');
    }
  }
  
  async getList(page: string, onResult: (result: Alert[])=> void, onError: (error: Error)=> void) {
    
    const db = getDatabase();
    const alertsRef = page === '' ?
      query(
        ref(db, 'alerts'), 
        orderByChild('date'),
        limitToLast(2)
      )
      :
      query(
        ref(db, 'alerts'), 
        orderByChild('date'), 
        endBefore(page),
        limitToLast(2)
      );
    
    onValue(
      alertsRef, 
      (snapshot) => {
        const result: Alert[] = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          result.unshift({ ...childData, id: childKey });
        });
        onResult(result);
      }, 
      onError,
      {
        onlyOnce: true
      }
    );
  }

  getNew(cb: (alert: Alert)=> void) {
    const db = getDatabase();
    const commentsRef = ref(db, 'alerts/');
    return onChildAdded(
      query(
        commentsRef, 
        orderByChild('date'), 
        startAt((new Date()).toUTCString())
      ), 
      (data) => {
        const alert = data.val() as Alert;
        alert.id = data.key as string;
        cb(alert);
        console.log('----------')
        console.log(alert);
      }
    );
  }

}


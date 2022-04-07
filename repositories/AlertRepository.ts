
import { FirebaseError } from "firebase/app";
import { 
  child,
  get,
  getDatabase, 
  onChildAdded, 
  orderByChild, 
  push, 
  query, 
  ref, 
  set,
  startAt,
  update, 
} from "firebase/database";
import { ALERT_NOT_FOUND } from "../constants/errorCodes";
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
      throw new FirebaseError(ALERT_NOT_FOUND, '');
    }
  }
  
  async getList() {
    
    const db = getDatabase();

    const alertsQuery = query(ref(db, 'alerts'), orderByChild('date'));
    
    const snapshot = await get(alertsQuery);

    const result: Alert[] = [];

    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      result.unshift({ ...childData, id: childKey });
    });
      
    return result;
  }

  getCreated(onSuccess: (alert: Alert)=> void, onError: (error: Error)=> void) {
    const db = getDatabase();
    const commentsRef = ref(db, 'alerts/');
    return onChildAdded(
      query(
        commentsRef, 
        orderByChild('date'), 
        startAt(Date.now())
      ), 
      (data) => {
        const alert = data.val() as Alert;
        alert.id = data.key as string;
        onSuccess(alert);
      },
      onError
    );
  }

}


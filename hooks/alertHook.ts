import { RouteProp, useRoute } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UNKNOWN_ERROR } from "../constants/errorCodes";
import Alert from "../models/Alert";
import { AlertRepository } from "../repositories/AlertRepository";
import app from "../repositories/firebase";
import { ParamList } from "../screens/AlertScreen";


type CreateReturnTuple = [
  (address: string, latitude: number, longitude: number)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useAlertCreate = (): CreateReturnTuple => {

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new AlertRepository(), []);

  const auth = useMemo(()=> getAuth(app), []);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (address: string, longitude: number, latitude: number) => {

    setLoading(true);

    try {
      if (auth.currentUser !== null) {
        await api.create({
          address,
          latitude,
          longitude,
          status: 'Active',
          userId: auth.currentUser.uid,
          date: new Date().toUTCString(),
        });

        setSuccess(true);
      }
    } catch (error) {
      if (error instanceof FirebaseError)
        setError(error.code);
      else 
        setError(UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


type UpdateReturnTuple = [
  (alert: Alert)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useAlertUpdateStatus = (): UpdateReturnTuple => {

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new AlertRepository(), []);

  const auth = useMemo(()=> getAuth(app), []);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (alert: Alert) => {

    setLoading(true);

    try {
      if (auth.currentUser !== null) {
        alert.status = 'Inactive';
        await api.updateStatus(alert);
        setSuccess(true);
      }
    } catch (error) {
      if (error instanceof FirebaseError)
        setError(error.code);
      else 
        setError(UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


type ListFetchReturnType = [
  Alert[], 
  boolean, 
  boolean,
  string | null, 
  () => void,
  (error: string)=> void,
  ()=> void
];

export const useAlertListFetch = (): ListFetchReturnType => {
  
  const [list, setList] = useState<Alert[]>([]);

  const [ended, setEnded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState('');

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new AlertRepository(), []);
  
  const canLoad = useCallback(
    ()=> { 
      setError(null);
      if (!ended)
        setLoading(true);  
    }, 
    [ended]
  );

  const onRefresh = useCallback(
    ()=> { 
      setPage('');
      setList([]);
      setError(null);
      setEnded(false);
      setRefreshing(true);
      setLoading(true); 
    }, 
    []
  );
  
  useEffect(
    () => {

      const fetch = ()=> {
        api.getList(
          page,
          (result)=> {
            setLoading(false);
            setRefreshing(false);
            setList((old)=> old.concat(result));
            setPage(result[result.length-1]?.date);
            setEnded(result.length === 0);
          },
          (error)=> {
            setLoading(false);
            setRefreshing(false);
            if (error instanceof FirebaseError)
              setError(error.code);
            else 
              setError(UNKNOWN_ERROR);
          }
        );
      }

      if (loading && !ended) fetch();
    },
    [loading, ended, page, api]
  );
  
  return [list, loading, refreshing, error, canLoad, setError, onRefresh];
}


type FetchReturnType = [
  Alert | null, 
  boolean, 
  string | null, 
  () => void,
  (error: string)=> void,
  () => void
];

export const useAlertFetch = (): FetchReturnType => {

  const route = useRoute<RouteProp<ParamList, 'Alert'>>();
  
  const [alert, setAlert] = useState<Alert | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new AlertRepository(), []);

  const auth = useMemo(()=> getAuth(app), []);
  
  const canLoad = useCallback(
    ()=> { 
      setError(null);
      setLoading(true);
    }, 
    []
  );

  const onStatusUpdate = useCallback(
    ()=> {
      setAlert(old=> old !== null ? ({ ...old, status: 'Inactive' }) : null);
    },
    []
  );
  
  useEffect(
    () => {

      const fetch = async ()=> {
        try {
          if (auth.currentUser !== null) {
            const alert = await api.get(route.params.id);
            setAlert(alert);
            setLoading(false);
          }
        } catch(error) {
          setLoading(false);
          if (error instanceof FirebaseError)
            setError(error.code);
          else 
            setError(UNKNOWN_ERROR);
        }
      }

      if (loading) fetch();
    },
    [loading, route.params.id, api, auth.currentUser]
  );

  return [alert, loading, error, canLoad, setError, onStatusUpdate];
}

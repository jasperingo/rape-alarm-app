import { RouteProp, useRoute } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { useCallback, useMemo, useState } from "react";
import { UNKNOWN_ERROR } from "../constants/errorCodes";
import Alert from "../models/Alert";
import { AlertRepository } from "../repositories/AlertRepository";
import { ParamList } from "../screens/AlertScreen";
import { useUser } from "./userHook";


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

  const user = useUser() as User;

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
      await api.create({
        address,
        latitude,
        longitude,
        status: 'Active',
        date: Date.now(),
        userId: user.uid,
        userDisplayName: user.displayName as string,
      });

      setSuccess(true);

    } catch (error) {
      setError(error instanceof FirebaseError ? error.code : UNKNOWN_ERROR);
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

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (alert: Alert) => {

    setError(null);
    setLoading(true);

    try {
      alert.status = 'Inactive';
      await api.updateStatus(alert);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof FirebaseError ? error.code : UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


type ListFetchReturnType = [
  () => Promise<void>,
  Alert[], 
  boolean, 
  boolean,
  boolean,
  string | null,
  (error: string)=> void,
  ()=> void,
  ()=> void
];

export const useAlertListFetch = (): ListFetchReturnType => {
  
  const [list, setList] = useState<Alert[]>([]);

  const [loaded, setLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new AlertRepository(), []);

  const onRefresh = ()=> { 
    setList([]);
    setError(null);
    setLoaded(false);
    setRefreshing(true);
  };

  const retryFetch = ()=> setError(null);

  const fetchAlerts = useCallback(
    async () => {

      setError(null);
      setLoading(true);
      setRefreshing(false);

      try {

        const response = await api.getList();
        
        setLoaded(true);
        setLoading(false);
        setList(response);

      } catch (error) {
        setLoading(false);
        setError(error instanceof FirebaseError ? error.code : UNKNOWN_ERROR);
      }
    },
    [api]
  );
  
  return [fetchAlerts, list, loading, loaded, refreshing, error, setError, onRefresh, retryFetch];
}


type FetchReturnType = [
  () => Promise<void>,
  Alert | null, 
  boolean, 
  string | null,
  (error: string)=> void,
  () => void,
  () => void
];

export const useAlertFetch = (): FetchReturnType => {

  const route = useRoute<RouteProp<ParamList, 'Alert'>>();
  
  const [alert, setAlert] = useState<Alert | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new AlertRepository(), []);
  
  const retryFetch = ()=> setError(null);

  const onStatusUpdate = useCallback(()=> setAlert(old=> old !== null ? ({ ...old, status: 'Inactive' }) : null), []);
  
  const fetchAlert = useCallback(
    async ()=> {

      setError(null);
      setLoading(true);

      try {
        const alert = await api.get(route.params.id);
        setAlert(alert);
      } catch(error) {
        setError(error instanceof FirebaseError ? error.code : UNKNOWN_ERROR);
      } finally {
        setLoading(false);
      }
    },
    [route.params.id, api]
  );

  return [fetchAlert, alert, loading, error, setError, onStatusUpdate, retryFetch];
}

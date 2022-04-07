import { FirebaseError } from "firebase/app";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { useState, useMemo, useCallback } from "react";
import { SIGN_OUT_ERROR, UNKNOWN_ERROR } from "../constants/errorCodes";
import app from "../repositories/firebase";
import { UserRepository } from "../repositories/UserRepository";


export const useUser = () => {
  const auth = getAuth(app);
  return auth.currentUser;
}

type UserFetchReturnTuple = [
  ()=> Unsubscribe,
  (error: string) => void,
  boolean, 
  boolean, 
  string | null,
  () => void
];

export const useAuthUserFetch = (): UserFetchReturnTuple => {

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const retryFetch = ()=> setError(null);

  const setPageError = (error: string)=> {
    setError(error);
    setLoading(false);
  }

  const fetchUser = useCallback(
    () => {

      setError(null);
      setLoading(true);

      return onAuthStateChanged(
        getAuth(app), 
        ()=> {
          setSuccess(true);
          setLoading(false);
        },
        ()=> { 
          setLoading(false);
          setError(UNKNOWN_ERROR);
        },
      );
    },
    []
  );
  
  return [fetchUser, setPageError, loading, success, error, retryFetch]
}


type SignInReturnTuple = [
  (email: string, password: string)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignIn = (): SignInReturnTuple => {
  
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new UserRepository(), []);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (email: string, password: string) => {

    setLoading(true);

    try {
      await api.auth(email, password);
      setSuccess(true);
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


type SignUpReturnTuple = [
  (name: string, email: string, password: string)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignUp = (): SignUpReturnTuple => {

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const api = useMemo(()=> new UserRepository(), []);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (name: string, email: string, password: string) => {

    setLoading(true);

    try {
      await api.create(name, email, password);
      setSuccess(true);
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


type SignOutReturnTuple = [
  ()=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignOut = (): SignOutReturnTuple => {
  
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );
  
  const onSubmit = async () => {

    setLoading(true);

    try {
      const auth = getAuth(app);
      await auth.signOut();
      setSuccess(true);
    } catch {
      setError(SIGN_OUT_ERROR);
    } finally{
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}

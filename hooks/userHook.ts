import { FirebaseError } from "firebase/app";
import { useState, useMemo, useCallback } from "react";
import { UserRepository } from "../repositories/UserRepository";

type ReturnTuple = [
  (email: string, password: string)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignIn = (): ReturnTuple => {
  
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
      const user = await api.auth(email, password);
      setSuccess(true);
    } catch (error) {
      if (error instanceof FirebaseError)
        setError(error.code);
    } finally {
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


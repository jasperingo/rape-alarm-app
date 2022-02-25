
import { useState } from 'react';
import validator from 'validator';
import { EMAIL_INVALID, FIELD_REQUIRED, PASSWORD_INVALID } from '../constants/errorCodes';


type StringOrNull = string | null;

type ReturnType = [
  (fullName: string, email: string, password: string)=> boolean,
  StringOrNull,
  StringOrNull,
  StringOrNull
];

export const useSignUpValidation = (): ReturnType => {

  const [nameError, setNameError] = useState<StringOrNull>(null);

  const [emailError, setEmailError] = useState<StringOrNull>(null);

  const [passwordError, setPasswordError] = useState<StringOrNull>(null);

  const validate = (fullName: string, email: string, password: string)=> {

    let error = false;

    if (validator.isEmpty(fullName)) {
      error = true;
      setNameError(FIELD_REQUIRED);
    } else {
      setNameError(null);
    }

    if (!validator.isEmail(email)) {
      error = true;
      setEmailError(EMAIL_INVALID);
    } else {
      setEmailError(null);
    }

    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      error = true;
      setPasswordError(PASSWORD_INVALID);
    } else {
      setPasswordError(null)
    }

    return error;
  }

  return [validate, nameError, emailError, passwordError];
}

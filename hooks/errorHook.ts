import { 
  AUTH_EMAIL_EXISTS,
  AUTH_USER_NOT_FOUND, 
  AUTH_WRONG_PASSWORD, 
  EMAIL_INVALID, 
  FIELD_REQUIRED, 
  NO_INTERNET_CONNECTION, 
  PASSWORD_INVALID 
} from "../constants/errorCodes";

export const useErrorMessage = ()=> {

  return (code: string | null)=> {

    switch(code) {

      case null:
        return '';

      case AUTH_WRONG_PASSWORD:
      case AUTH_USER_NOT_FOUND:
        return 'Credentials incorrect';
      
      case FIELD_REQUIRED:
        return 'This field is required';

      case AUTH_EMAIL_EXISTS:
        return 'Email already in use';

      case EMAIL_INVALID:
        return 'This email is invalid';

      case PASSWORD_INVALID:
        return 'Password must be 5 or more characters';
      
      case NO_INTERNET_CONNECTION:
        return 'No network connection';
        
      default:
        return `An error occured, try again later. ${code}`; 
    }
  }
}

export const BASE_API_URL = process.env.REACT_APP_API_URL

export enum ErrorMessage {
  INVALID_FIRSTNAME = '⛔ First Name is required',
  INVALID_LASTNAME = '⛔ Last Name is required',
  INVALID_EMAIL = '⛔ Email is invalid',
  INVALID_PASSWORD = '⛔ Your password must contain at least an uppercase, a lowercase and a special character.',
  SUCCESSFULLY_SYNCED = `✅ Successfully synced`,
}

export enum ErrorTypes {
  ERROR_EMAIL = 'email',
  ERROR_PASSWORD = 'password',
  ERROR_FIRSTNAME = 'firstname',
  ERROR_LASTNAME = 'lastname',
}

export const errorMessageMap: Record<ErrorTypes, ErrorMessage> = {
  [ErrorTypes.ERROR_EMAIL]: ErrorMessage.INVALID_EMAIL,
  [ErrorTypes.ERROR_PASSWORD]: ErrorMessage.INVALID_PASSWORD,
  [ErrorTypes.ERROR_FIRSTNAME]: ErrorMessage.INVALID_FIRSTNAME,
  [ErrorTypes.ERROR_LASTNAME]: ErrorMessage.INVALID_LASTNAME,
}

export const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const daysList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
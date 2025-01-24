
export enum ErrorMessage {
  ERROR_RANK = '⛔ Rank is required',
  ERROR_EMAIL = '⛔ Email is required',
  ERROR_PHONE = '⛔ Phone Number is required',
  ERROR_PICTURE = '⛔ Picture is required',
  ERROR_FULLNAME = '⛔ Full Name is required',
  ERROR_DAY = '⛔ Day of Birth is required',
  ERROR_MONTH = '⛔ Month of Birth is required',
}

export const SUCCESSFULLY_SUBMITTED = `✅ Form Submitted Successfully`;

export enum ErrorTypes {
  ERROR_RANK = 'rank',
  ERROR_EMAIL = 'email',
  ERROR_PHONE = 'mobile',
  ERROR_PICTURE = 'picture',
  ERROR_DAY = 'day',
  ERROR_MONTH = 'month',
  ERROR_FULLNAME = 'fullname',
}

export const errorMessageMap: Record<ErrorTypes, ErrorMessage> = {
  [ErrorTypes.ERROR_RANK]: ErrorMessage.ERROR_RANK,
  [ErrorTypes.ERROR_EMAIL]: ErrorMessage.ERROR_EMAIL,
  [ErrorTypes.ERROR_PHONE]: ErrorMessage.ERROR_PHONE,
  [ErrorTypes.ERROR_PICTURE]: ErrorMessage.ERROR_PICTURE,
  [ErrorTypes.ERROR_FULLNAME]: ErrorMessage.ERROR_FULLNAME,
  [ErrorTypes.ERROR_DAY]: ErrorMessage.ERROR_DAY,
  [ErrorTypes.ERROR_MONTH]: ErrorMessage.ERROR_MONTH,
}

export const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const daysList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
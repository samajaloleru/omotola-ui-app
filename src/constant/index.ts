
export enum ErrorMessage {
  ERROR_RANK = '⛔ Rank is required',
  ERROR_GENDER = '⛔ Gender is required',
  ERROR_PHONE = '⛔ Phone Number is required',
  ERROR_PICTURE = '⛔ Picture is required',
  ERROR_FULLNAME = '⛔ Full Name is required',
  ERROR_DAY = '⛔ Day of Birth is required',
  ERROR_MONTH = '⛔ Month of Birth is required',
  ERROR_HOMEADDRESS = '⛔ Home Address is required',
}

export const SUCCESSFULLY_SUBMITTED = `✅ Form Submitted Successfully`;
export const SUCCESSFULLY_UPDATED = `✅ Details Updated Successfully`;

export enum ErrorTypes {
  ERROR_RANK = 'rank',
  // ERROR_EMAIL = 'email',
  ERROR_PHONE = 'mobile',
  ERROR_PICTURE = 'picture',
  ERROR_DAY = 'day',
  ERROR_MONTH = 'month',
  ERROR_GENDER = 'gender',
  ERROR_FULLNAME = 'fullname',
  ERROR_HOMEADDRESS = 'homeaddress',
}

export const errorMessageMap: Record<ErrorTypes, ErrorMessage> = {
  [ErrorTypes.ERROR_RANK]: ErrorMessage.ERROR_RANK,
  [ErrorTypes.ERROR_GENDER]: ErrorMessage.ERROR_GENDER,
  [ErrorTypes.ERROR_PHONE]: ErrorMessage.ERROR_PHONE,
  [ErrorTypes.ERROR_PICTURE]: ErrorMessage.ERROR_PICTURE,
  [ErrorTypes.ERROR_FULLNAME]: ErrorMessage.ERROR_FULLNAME,
  [ErrorTypes.ERROR_DAY]: ErrorMessage.ERROR_DAY,
  [ErrorTypes.ERROR_MONTH]: ErrorMessage.ERROR_MONTH,
  [ErrorTypes.ERROR_HOMEADDRESS]: ErrorMessage.ERROR_HOMEADDRESS,
}

export const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const daysList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
export const genderList = ['Male', 'Female']
export const maleRankList = [
  "Brother",
  "Elder Brother",
  "Prophet",
  "Cape Elder Brother",
  "Full Elder Brother",
  "Senior Elder Brother",
  "Superior Senior Elder Brother",
  "Cape Prophet",
  "Assistant Leader",
  "Woleader",
  "Leader",
  "Senior Woleader",
  "Senior Leader",
  "Superior Senior Leader",
  "Superior Senior Woleader",
  "Honorary Assistant Evangelist",
  "Assistant Evangelist",
  "Honorary Evangelist",
  "Evangelist",
  "Honorary Senior Evangelist",
  "Senior Evangelist",
  "Special Most Senior Evangelist",
  "Most Senior Evangelist",
  "Special Venerable Most Senior Evangelist",
  "Venerable Most Senior Evangelist",
  "Assistant Superior Evangelist",
  "Superior Evangelist",
  "Assistant Venerable Superior Evangelist",
  "Venerable Superior Evangelist",
  "Assistant  Most Superior Evangelist",
  "Most Superior Evangelist",
  "Supreme Evangelist"
]
export const femaleRankList = [
  "Sister",
  "Elder Sister",
  "Cape Elder Sister",
  "Prophetess",
  "Cape Prophetess",
  "Wolima",
  "Senior Prophetess",
  "Senior Elder Sister",
  "Superior Senior Prophetess",
  "Superior Senior Elder Sister",
  "Lace Superior Senior Prophetess",
  "Lace Superior Senior Elder Sister",
  "Mother Celestial"
]
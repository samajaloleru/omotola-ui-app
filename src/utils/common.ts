const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const formatDate = (inputDate: string) =>{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }as Intl.DateTimeFormatOptions;
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-US', options);
}


export const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  }
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const addSuffix = (numberStr: string) =>{
    const num = parseInt(numberStr, 10);
    const lastTwo = num % 100;
    let suffix;

    // Handle special cases for 11th, 12th, 13th
    if (lastTwo >= 11 && lastTwo <= 13) {
        suffix = 'th';
    } else {
        // Determine suffix based on the last digit
        const lastDigit = num % 10;
        switch (lastDigit) {
            case 1:
                suffix = 'st';
                break;
            case 2:
                suffix = 'nd';
                break;
            case 3:
                suffix = 'rd';
                break;
            default:
                suffix = 'th';
        }
    }

    // Append suffix to the original string
    return numberStr + suffix;
}

export const formatDate = (inputDate: string) =>{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }as Intl.DateTimeFormatOptions;
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-US', options);
}


export const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  }
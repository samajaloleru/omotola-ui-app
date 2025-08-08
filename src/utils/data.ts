
type searchParams = {
  page: number,
  pageSize: number,
  searchTerm?: string,
}

type verifyParams = {
  day: string,
  month: string,
  mobile: string,
}

export const memberSearchQueryByDayMonthAndMobile = ({day, month, mobile} : verifyParams ) => {
  const query = `*[_type == "member" && day == '${day}' && month == '${month}' && mobile == '${mobile}' ]{
    _id,
    fullName,
    "imageUrl": image.asset->url,
    rank,
    email,
    mobile,
    homeAddress,
    profession,
    gender,
    day,
    month,
    _createdAt
  }`;
  return query;
};

export const memberSearchQueryByMonth = ( month : string ) => {
  const query = `*[_type == "member" && month == '${month}']{
    _id,
    fullName,
    "imageUrl": image.asset->url,
    rank,
    email,
    mobile,
    homeAddress,
    profession,
    gender,
    day,
    month,
    _createdAt
  }`;
  return query;
};
export const fetchMember = ( ) => {
  const query = `*[_type == "member"]{
    _id,
    fullName,
    "imageUrl": image.asset->url,
    rank,
    email,
    mobile,
    homeAddress,
    profession,
    gender,
    day,
    month,
    _createdAt
  }`;
  return query;
};


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


export const fetchMember = (searchParams: any) => {
  const { page, pageSize, month, gender, name } = searchParams;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  let query = `*[_type == "member"`;
  
  // Add filters
  const conditions = [];
  if (month) conditions.push(`month == "${month}"`);
  if (gender) conditions.push(`gender == "${gender}"`);
  if (name) conditions.push(`fullName match "${name}*"`);
  
  if (conditions.length) query += ` && (${conditions.join(' && ')})`;
  
  query += `] | order(_createdAt desc) [${start}..${end}] {
    _id,
    fullName,
    rank,
    "imageUrl": image.asset->url,
    email,
    mobile,
    gender,
    homeAddress,
    profession,
    day,
    month
  }`;
  
  return query;
};

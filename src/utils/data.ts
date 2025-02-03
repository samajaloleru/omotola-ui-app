
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

export const formDetailSearchQuery = ({day, month, mobile} : verifyParams ) => {
  const query = `*[_type == "formDetail" && day == '${day}' && month == '${month}' && mobile == '${mobile}' ]{
    _id,
    fullName,
    "imageUrl": image.asset->url,
    rank,
    email,
    mobile,
    homeAddress,
    gender,
    day,
    month,
    _createdAt
  }`;
  return query;
};

export const professionalListQuery = (type: string) => {  
  const query = `*[_type == "professional" && typeOf == '${type}' ]{
    _id,
    name,
    title,
    body,
    mainImageUrl,
    typeOf,
    role,
    education,
    experience,
    _createdAt
  }`;
  return query;
};

export const postDetailQuery = (postId: string) => {
  const query = `*[_type == "post" && _id == '${postId}']{
    _id,
    title,
    body,
    duration,
    _createdAt
  }`;
  return query;
};

export const newsDetailMoreQuery = (id: string) => {
  if (id) {
    const query = `*[_type == "post" && _id != '${id}' && status == 'active' ]| order(_createdAt desc) [0...3]{
      _id,
      title,
      subtitle,
      duration,
      body
    }`;
    return query;
  } else {
    const query = `*[_type == "post" && status == 'active' ]| order(_createdAt desc) [0...3]{
      _id,
      title,
      subtitle,
      duration,
      body
    }`;
    return query;
  }
};


export const newsQuery = ({page, pageSize}: searchParams) => {  
  const prev = (page - 1) * pageSize;
  const next = page * pageSize;
  
  const query = `*[_type == "post" && status == 'active'] | order(_createdAt desc) [${prev}...${next}]{
    _id,
    title,
    subtitle,
    duration,
    body
  }`;
  
  return query;
};

export const newSearchQuery = ({page, pageSize, searchTerm}: searchParams) => {
  const prev = (page - 1) * pageSize;
  const next = page * pageSize;
  const query = `*[_type == "post" && status == 'active' && title match '${searchTerm}*'] | order(_createdAt desc) [${prev}...${next}]{
    _id,
    title,
    subtitle,
    duration,
    body
  }`;

  return query;
};
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '9pl58hm7',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-06-15',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const MEMBER_PROJECTION = `{
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

module.exports = { client, MEMBER_PROJECTION };

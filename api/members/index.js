const { client, MEMBER_PROJECTION } = require('../_lib/sanity');
const { verifyToken, bearerToken } = require('../_lib/auth');
const { HttpError, route, text, memberFields } = require('../_lib/http');

const CREATE_FIELDS = ['rank', 'fullName', 'mobile', 'homeAddress', 'email', 'profession', 'gender', 'day', 'month', 'imageAssetId'];
const REQUIRED_FIELDS = ['rank', 'fullName', 'mobile', 'homeAddress', 'profession', 'gender', 'day', 'month', 'imageAssetId'];

module.exports = route({
  // GET /api/members — paginated directory, requires a session from /api/access
  GET: async (req, res) => {
    if (verifyToken(bearerToken(req))?.scope !== 'members') {
      throw new HttpError(401, 'Your session has expired. Please enter the access code again.');
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
    const start = (page - 1) * pageSize;
    const params = {
      month: text(req.query.month),
      gender: text(req.query.gender),
      name: text(req.query.name),
    };
    params.namePattern = `${params.name}*`;

    const filter = `_type == "member"
      && ($month == "" || month == $month)
      && ($gender == "" || gender == $gender)
      && ($name == "" || fullName match $namePattern)`;

    const result = await client.fetch(
      `{
        "items": *[${filter}] | order(_createdAt desc) [${start}...${start + pageSize}] ${MEMBER_PROJECTION},
        "total": count(*[${filter}])
      }`,
      params
    );

    res.status(200).json(result);
  },

  // POST /api/members — register a new member (public)
  POST: async (req, res) => {
    const fields = memberFields(req.body || {}, CREATE_FIELDS);
    const missing = REQUIRED_FIELDS.filter((key) => (key === 'imageAssetId' ? !fields.image : !fields[key]));
    if (missing.length) throw new HttpError(400, `Missing required fields: ${missing.join(', ')}`);

    const exists = await client.fetch(
      `count(*[_type == "member" && day == $day && month == $month && mobile == $mobile]) > 0`,
      { day: fields.day, month: fields.month, mobile: fields.mobile }
    );
    if (exists) throw new HttpError(409, 'A member with this phone number and birthday is already registered');

    const created = await client.create({ _type: 'member', ...fields });
    res.status(201).json({ _id: created._id });
  },
});

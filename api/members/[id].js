const { client } = require('../_lib/sanity');
const { verifyToken, bearerToken } = require('../_lib/auth');
const { HttpError, route, memberFields } = require('../_lib/http');

// Phone and gender are fixed after registration, matching the update form
const EDITABLE_FIELDS = ['rank', 'fullName', 'homeAddress', 'profession', 'email', 'day', 'month', 'imageAssetId'];

// PATCH /api/members/:id — update your own record using the token from /api/members/verify
module.exports = route({
  PATCH: async (req, res) => {
    const session = verifyToken(bearerToken(req));
    if (session?.scope !== 'edit' || session.memberId !== req.query.id) {
      throw new HttpError(401, 'Your session has expired. Please verify your details again.');
    }

    const fields = memberFields(req.body || {}, EDITABLE_FIELDS);
    if (!Object.keys(fields).length) throw new HttpError(400, 'Nothing to update');

    await client.patch(req.query.id).set(fields).commit();
    res.status(200).json({ _id: req.query.id });
  },
});

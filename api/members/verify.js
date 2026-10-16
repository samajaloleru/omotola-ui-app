const { client, MEMBER_PROJECTION } = require('../_lib/sanity');
const { signToken } = require('../_lib/auth');
const { HttpError, route, text } = require('../_lib/http');

const EDIT_MINUTES = 30;

// POST /api/members/verify — a member proves who they are with birthday + phone,
// and gets a short-lived token that only allows editing their own record.
module.exports = route({
  POST: async (req, res) => {
    const day = text(req.body?.day, 2);
    const month = text(req.body?.month, 20);
    const mobile = text(req.body?.mobile, 30);
    if (!day || !month || !mobile) throw new HttpError(400, 'Birthday and phone number are required');

    const member = await client.fetch(
      `*[_type == "member" && day == $day && month == $month && mobile == $mobile][0] ${MEMBER_PROJECTION}`,
      { day, month, mobile }
    );
    if (!member) throw new HttpError(404, "We couldn't find a record with that birthday and phone number.");

    res.status(200).json({
      member,
      editToken: signToken({ scope: 'edit', memberId: member._id }, EDIT_MINUTES * 60),
    });
  },
});

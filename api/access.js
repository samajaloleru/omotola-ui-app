const { client } = require('./_lib/sanity');
const { safeEqual, signToken } = require('./_lib/auth');
const { HttpError, route, getIp, text } = require('./_lib/http');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_HOURS = 2;

// POST /api/access — check the members-page access code and log the attempt
module.exports = route({
  POST: async (req, res) => {
    const fullName = text(req.body?.fullName);
    const mobile = text(req.body?.mobile, 30);
    const accessCode = typeof req.body?.accessCode === 'string' ? req.body.accessCode : '';

    if (fullName.length < 2) throw new HttpError(400, 'Please enter your full name');
    if (mobile.length < 7) throw new HttpError(400, 'Please enter a valid phone number');
    if (!accessCode) throw new HttpError(400, 'Access code cannot be empty');

    const ipAddress = getIp(req);
    const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
    const recentFailures = await client.fetch(
      `count(*[_type == "accessLog" && !granted && attemptedAt > $since && (ipAddress == $ip || mobile == $mobile)])`,
      { since, ip: ipAddress, mobile }
    );

    const lockedOut = recentFailures >= MAX_FAILED_ATTEMPTS;
    const granted = !lockedOut && safeEqual(accessCode, process.env.MEMBERS_ACCESS_CODE);

    await client.create({
      _type: 'accessLog',
      fullName,
      mobile,
      granted,
      page: 'members',
      attemptedAt: new Date().toISOString(),
      ipAddress,
      userAgent: text(req.headers['user-agent'], 500),
    });

    if (lockedOut) throw new HttpError(429, `Too many incorrect attempts. Try again in ${LOCKOUT_MINUTES} minutes.`);
    if (!granted) throw new HttpError(401, 'That access code is incorrect');

    res.status(200).json({ token: signToken({ scope: 'members', fullName }, SESSION_HOURS * 60 * 60) });
  },
});

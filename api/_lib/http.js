const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const GENDERS = ['Male', 'Female'];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Wraps a map of { METHOD: handler } with method checks and error handling
const route = (handlers) => async (req, res) => {
  const handler = handlers[req.method];
  if (!handler) {
    res.setHeader('Allow', Object.keys(handlers).join(', '));
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await handler(req, res);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const getIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';

const text = (value, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// Picks and validates the editable member fields from a request body.
// `allowed` limits which fields this request may set.
const memberFields = (body, allowed) => {
  const fields = {};
  for (const key of allowed) {
    if (body[key] === undefined || body[key] === null) continue;
    fields[key] = text(body[key], key === 'homeAddress' ? 400 : 200);
  }

  if (fields.gender !== undefined && !GENDERS.includes(fields.gender)) throw new HttpError(400, 'Invalid gender');
  if (fields.month !== undefined && !MONTHS.includes(fields.month)) throw new HttpError(400, 'Invalid month');
  if (fields.day !== undefined) {
    const day = Number(fields.day);
    if (!Number.isInteger(day) || day < 1 || day > 31) throw new HttpError(400, 'Invalid day');
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) throw new HttpError(400, 'Email is invalid');
  if (fields.imageAssetId !== undefined && !/^image-[A-Za-z0-9-]+$/.test(fields.imageAssetId)) throw new HttpError(400, 'Invalid image');

  const { imageAssetId, ...rest } = fields;
  if (imageAssetId) {
    rest.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } };
  }
  return rest;
};

module.exports = { HttpError, route, getIp, text, memberFields };

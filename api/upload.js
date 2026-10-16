const { client } = require('./_lib/sanity');
const { HttpError, route } = require('./_lib/http');

const MAX_BYTES = 3 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB; the browser resizes before sending
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

// POST /api/upload — { data: base64, contentType } → { _id } of the Sanity image asset
module.exports = route({
  POST: async (req, res) => {
    const { data, contentType } = req.body || {};
    if (!ALLOWED_TYPES.includes(contentType) || typeof data !== 'string') {
      throw new HttpError(400, 'Please upload a JPG or PNG photo');
    }

    const buffer = Buffer.from(data, 'base64');
    if (!buffer.length || buffer.length > MAX_BYTES) throw new HttpError(413, 'That photo is too large');

    const asset = await client.assets.upload('image', buffer, {
      contentType,
      filename: `member-${Date.now()}.${contentType === 'image/png' ? 'png' : 'jpg'}`,
    });
    res.status(201).json({ _id: asset._id });
  },
});

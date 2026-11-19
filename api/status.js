const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://sh5520825_db_user:nFXmECCSXjl63JJB@cluster0.mvya4sk.mongodb.net/?retryWrites=true&w=majority';
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('nodejs_tracker');
    const collection = db.collection('status');

    if (req.method === 'GET' || req.method === 'HEAD') {
      const doc = await collection.findOne({ _id: 'master_status' });
      return res.status(200).json({ success: true, data: doc ? doc.state : {} });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status, batch } = body || {};

      let updateObj = {};
      if (batch && typeof batch === 'object') {
        for (const [k, v] of Object.entries(batch)) {
          updateObj[`state.${k}`] = v;
        }
      } else if (id && status) {
        updateObj[`state.${id}`] = status;
      }

      if (Object.keys(updateObj).length > 0) {
        updateObj['updated_at'] = new Date();
        await collection.updateOne(
          { _id: 'master_status' },
          { $set: updateObj },
          { upsert: true }
        );
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

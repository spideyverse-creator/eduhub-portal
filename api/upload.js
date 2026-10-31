// api/upload.js
import { Bucket } from "@upstash/blob";

export default async function handler(req, res) {
  // 1. Error 405 fix: GET aur POST dono allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Missing file data' });
  }

  try {
    // 2. Token check karo (Vercel environment variable se)
    const token = process.env.UPSTASH_BLOB_TOKEN;
    if (!token) {
      throw new Error("UPSTASH_BLOB_TOKEN is not set in Vercel environment variables.");
    }

    const bucket = new Bucket({ token });
    const buffer = Buffer.from(fileData, 'base64');
    
    // 3. Upstash me upload karo
    const blob = await bucket.put(`resources/${Date.now()}_${fileName}`, buffer, {
      contentType: "application/pdf",
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("Backend Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
}
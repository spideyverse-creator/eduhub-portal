// api/upload.js
import { Bucket } from "@upstash/blob";

export default async function handler(req, res) {
  // GET aur POST dono allow karo taaki 405 error na aaye
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Missing file data' });
  }

  try {
    // 🔥 Tera token Vercel ke Environment Variables se aayega
    const bucket = new Bucket({ 
      token: process.env.UPSTASH_BLOB_TOKEN 
    });

    const buffer = Buffer.from(fileData, 'base64');
    
    const blob = await bucket.put(`resources/${Date.now()}_${fileName}`, buffer, {
      contentType: "application/pdf",
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("Upstash Upload Error:", error);
    res.status(500).json({ error: 'Upload failed on server' });
  }
}
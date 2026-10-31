// api/upload.js
import { Bucket } from "@upstash/blob";

// api/upload.js
import { uploadHandler } from "@upstash/blob";

export const uploads = uploadHandler({
  constraints: {
    maxSize: "5mb",
    contentTypes: ["application/pdf"],
  },
  onBeforeUpload: ({ file }) => {
    // Path decide karo
    return `resources/${Date.now()}_${file.name}`;
  },
  onUploadComplete: ({ file }) => {
    // Yahan tu Firestore me save kar sakta hai agar chahe
    return { url: file.url };
  },
});

export default async function handler(req, res) {
  // Sirf POST request allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData } = req.body;

  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'Missing file data' });
  }

  try {
    // Backend pe token safe hai
    const bucket = new Bucket({ 
      token: process.env.UPSTASH_BLOB_TOKEN 
    });

    // Base64 string ko wapas Buffer (binary) me convert karo
    const buffer = Buffer.from(fileData, 'base64');
    
    // Upstash me upload karo
    const blob = await bucket.put(`resources/${Date.now()}_${fileName}`, buffer, {
      contentType: "application/pdf",
    });

    // URL wapas frontend ko bhejo
    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error("Upstash Upload Error:", error);
    res.status(500).json({ error: 'Upload failed on server' });
  }
}
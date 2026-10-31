// api/upload.js
import { uploadHandler } from "@upstash/blob";

export const uploads = uploadHandler({
  constraints: {
    maxSize: "15mb", // 🔥 Limit 15MB kar di
    contentTypes: ["application/pdf"],
  },
  multipart: "5mb", // 5MB se badi file tukdon me upload hogi (fast)
  onBeforeUpload: ({ file }) => {
    return {
      path: `resources/${Date.now()}_${file.name}`,
    };
  },
  onUploadComplete: ({ url }) => {
    return { url };
  },
});

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    return uploads(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
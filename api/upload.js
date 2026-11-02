// api/upload.js
import { uploadHandler } from "@upstash/blob";

export const uploads = uploadHandler({
  constraints: {
    maxSize: "15mb", // 15MB tak allow
    contentTypes: ["application/pdf"],
  },
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
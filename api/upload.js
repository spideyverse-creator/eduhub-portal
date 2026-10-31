// api/upload.js
import { uploadHandler } from "@upstash/blob";

// 🔥 Upstash handler setup
export const uploads = uploadHandler({
  constraints: {
    maxSize: "5mb",
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
  // GET aur POST dono allow karo (405 error se bachne ke liye)
  if (req.method === 'GET' || req.method === 'POST') {
    return uploads(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
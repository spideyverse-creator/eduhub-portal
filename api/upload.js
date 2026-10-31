import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.UPSTASH_ACCOUNT_ID}.r2.cloudflarestorage.com`, // Agar R2 use kar rahe ho
  // Ya fir Upstash Blob ke liye:
  // endpoint: "https://blob.upstash.com",
  credentials: {
    accessKeyId: process.env.UPSTASH_ACCESS_KEY,
    secretAccessKey: process.env.UPSTASH_SECRET_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fileName, fileType } = req.body;

  const command = new PutObjectCommand({
    Bucket: "eduhub-files", // Tera bucket name
    Key: `resources/${Date.now()}_${fileName}`,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
  const fileUrl = `https://eduhub-files.blob.upstash.com/${Date.now()}_${fileName}`; // Public URL

  res.status(200).json({ uploadUrl, fileUrl });
}
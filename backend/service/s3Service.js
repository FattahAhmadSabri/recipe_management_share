const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3Config");

const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  const imageKey = `recipes/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return imageKey;
};

module.exports = { uploadImage };
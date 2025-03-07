// awsConfig.js
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "YOUR_AWS_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY",
  region: "Asia Pacific (Mumbai) ap-south-1",
});

export const s3 = new AWS.S3();
export const BucketName = "YOUR_S3_BUCKET_NAME";

import * as aws from "aws-sdk";
import config from './config/config.dev';
aws.config.update({
    secretAccessKey: config.awsSecretAccessKey,
    accessKeyId: config.awsAccessKeyId,
    region: config.awsRegion
});
const s3 = new aws.S3();
export default s3;
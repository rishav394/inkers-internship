var AWS = require('aws-sdk');

const BUCKET = process.env.BUCKET;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

AWS.config.update({
	accessKeyId: ACCESS_KEY,
	secretAccessKey: SECRET_KEY,
	region: REGION,
});

const s3 = new AWS.S3();

function uploadLoadToS3(ObjFile) {
	var params = {
		ACL: 'public-read',
		Body: new Buffer(ObjFile.buffer),
		Bucket: BUCKET,
		ContentType: ObjFile.mimetype,
		Key: ObjFile.originalname,
	};
	return s3.upload(params).promise();
}
module.exports = uploadLoadToS3;

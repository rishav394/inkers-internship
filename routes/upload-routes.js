const router = require('express').Router();
const upload = require('multer')();
const uploadLoadToS3 = require('../lib/aws-upload');

var cpUpload = upload.fields([{ name: 'imagelol', maxCount: 8 }]);

router.post('/', cpUpload, (req, res) => {
	var errors = [];
	var promises = [];
	for (let i = 0; i < req.files.imagelol.length; i++) {
		const element = req.files.imagelol[i];

		var mime = [
			'image/gif',
			'image/jpeg',
			'image/png',
			'image/svg+xml',
			'image/apng',
			'image/bmp',
			'image/jpg',
			'image/webp',
		];
		if (mime.includes(element.mimetype) && element.size < 5e6) {
			promises.push(uploadLoadToS3(element));
		} else {
			errors.push(
				`${element.originalname} could not be uploaded as it is not an image or the size is more than 5 MB.`,
			);
		}
	}
	Promise.all(promises)
		.then(function(data) {
			var mes = data.map(d => {
				return `${d.Key} uploaded! ${d.Location}`;
			});
			errors.forEach(e => {
				mes.push(e);
			});
			res.send(mes.join('<br>'));
		})
		.catch(function(err) {
			res.send(
				`A few (or all) images were not uploaded because ${err.message}`,
			);
		});
});

module.exports = router;

const router = require('express').Router();
const upload = require('multer')();
const User = require('../models/user-models');
const uploadLoadToS3 = require('../lib/aws-upload');

var cpUpload = upload.fields([{ name: 'imagelol', maxCount: 8 }]);

router.post('/', cpUpload, (req, res) => {
	User.findById(req.user.id, (err, user) => {
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
				user.uploadActivity.push({
					name: element.originalname,
					success: false,
				});

				errors.push(
					`${element.originalname} could not be uploaded as it is not an image or the size is more than 5 MB.`,
				);
			}
		}

		Promise.all(promises)
			.then(function(data) {
				var mes = data.map(d => {
					user.uploads.push({
						name: d.Key,
						url: d.Location,
					});
					user.uploadActivity.push({
						name: d.Key,
						success: true,
					});

					return `${d.Key.slice(0, 20)} uploaded!`;
				});

				user
					.update(user)
					.then(doc => {})
					.catch(err => {});

				errors.forEach(e => {
					mes.push(e);
				});
				res.redirect(`/?message=${mes.join('%0A').trim()}`);
			})
			.catch(function(err) {
				res.send(
					`A few (or all) images were not uploaded because ${err.message}`,
				);
			});
	});
});

module.exports = router;

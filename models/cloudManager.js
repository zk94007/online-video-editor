/**
 * @ Cloud Manager for work with media files
 * @author Ervis Semanaj
 */

import config from '../config';

const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
});

export default {
    upload(filepath, project, filename, signed = false) {
        return new Promise((resolve, reject) => {
            const fileContent = fs.readFileSync(filepath);

            const params = {
                Bucket: config.s3.bucket,
                Key: `${project}/${filename}`,
                Body: fileContent
            };

            s3.upload(params, (err, data) => {
                if (err) return reject(err);
                if (signed) {
                    const url = s3.getSignedUrl('getObject', {
                        Bucket: config.s3.bucket,
                        Key: `${project}/${filename}`,
                        Expires: config.s3.signedUrlExpireSeconds
                    });
                    return resolve(url);
                } else {
                    return resolve(data.Location);
                }

            });
        });
    },
}
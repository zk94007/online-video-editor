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
    upload(filepath, prefix, filename) {
        return new Promise((resolve, reject) => {
            const fileContent = fs.readFileSync(filepath);

            const params = {
                Bucket: config.s3.bucket,
                Key: `${prefix}/${filename}`,
                Body: fileContent,
                ACL: 'public-read'
            };

            s3.upload(params, (err, data) => {
                if (err) return reject(err);                
                return resolve(data.Location);
            });
        });
    },
}
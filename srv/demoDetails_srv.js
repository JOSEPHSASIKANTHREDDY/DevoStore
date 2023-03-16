const cds = require("@sap/cds");
const { Images } = cds.entities;
console.log(cds.entities);

module.exports = srv => {
    console.log(process.env);
    const vcap_services = process.env
	const AWS = require('aws-sdk')
	const credentials = new AWS.Credentials(
		vcap_services["aws_access_key_id"],
		vcap_services["aws_secret_access_key"])
	AWS.config.update({
		region: vcap_services["region"],
		credentials: credentials
	})
	const s3 = new AWS.S3({
		apiVersion: '2006-03-01'
	})

    srv.on('UPDATE', 'Images', async (req) => {
		const params = {
			Bucket: vcap_services["bucket"],
			Key: req.data.ID,
			Body: req.data.image, 
            ACL: "public-read",
			ContentType: "image/png"
		};
        console.log(credentials)
        try {
            const stored = await s3.upload(params).promise()
            await UPDATE (Images) .with ({ imageURL: `${stored.Location}` }) .where `ID = ${req.data.ID}`
            console.log(stored.Location);
          } catch (err) {
            console.log(err)
          }
	})
}
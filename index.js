// importera s3
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3" // <—— DET HÄR ÄNDRADE JAG
export const handler = async (event) => {
	// hämtar vår s3 bucket och namnet på filen från eventet
	const bucketName = event.Records[0].s3.bucket.name
	console.log("HÄR ÄR VÅRT EVENT!", JSON.stringify(event))
	const keyName = event.Records[0].s3.object.key
	// skapa en s3-instans genom namnen (credentials)
	const s3 = new S3Client({ region: "eu-north-1" })
	try {
		// använda metoden under s3 som gör så att man får
		// tillbaka datans metadata så som content type
		const params = {
			Bucket: bucketName,
			Key: keyName,
		}

		const { ContentType } = await s3.send(new HeadObjectCommand(params)) // <—- DET HÄR ÄNDRADE JAG
		return {
			statusCode: 200,
			body: JSON.stringify({ contentType: ContentType }),
		}
	} catch (err) {
		console.log("error!!!!", err)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Failed to get content type" }),
		}
	}
}

const fs = require("fs");
const { google } = require("googleapis");

const googleApiFolderId = process.env.GOOGLE_API_FOLDER_ID;

async function uploadFileToGoogleDrive(fileName, filePath) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./googlekey.json",
      scopes: "https://www.googleapis.com/auth/drive",
    });

    const driveService = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: fileName,
      parents: [googleApiFolderId],
    };

    const media = {
      mimeType: "application/pdf",
      body: fs.createReadStream(filePath),
    };

    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      field: "id",
    });

    return response.data.id;
  } catch (err) {
    console.log("Upload File Error", err);
  }
}

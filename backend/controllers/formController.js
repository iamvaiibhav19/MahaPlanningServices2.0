const Form = require("../models/formModel");
const fs = require("fs");
const { google } = require("googleapis");
const Upload = require("../models/uploadModel");
const sendEmail = require("../utils/sendEmail");
const googleApiFolderId = process.env.GOOGLE_API_FOLDER_ID;
var html_to_pdf = require("html-pdf-node");
const path = require("path");

// create a new form -- ADMIN - coordinator
exports.createFormWithoutDoc = async (req, res) => {
  try {
    console.log(req.user._id, "user id");
    const form = new Form({
      ...req.body,
      user: req.user._id,
    });

    await form.save();

    res.status(201).json({
      success: true,
      form,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createFormWithoutDoc1 = async (req, res) => {
  try {
    const form = new Form({
      user: req.user._id,
      ...req.body,
    });
    await form.save();

    const { applicationDetails, registrationDetails, paymentInfo } = form;
    //get saved form

    //convert form to pdf
    let options = {
      format: "A4",
    };

    let file = {
      content: `
      <h1
        style="text-align: center; margin-top: 10px; font-size: 25px; font-weight: 700; color: rgb(197, 194, 21);"
    >MAHA PLANNING SERVICES</h1>

    <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-top: 20px;"
    >
  
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">1</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Service Type</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 47%;">
            ${
              registrationDetails?.serviceType === ""
                ? "-"
                : registrationDetails?.serviceType
            }
            </td> 
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">2</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Applicant No.</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              form?.applicationNo
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">3</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Applicant Name</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.applicantName
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">4</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Business Name</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.businessName
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">5</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Communication Address</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.communicationAddress
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">6</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Project Unit Address</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.projectUnitAddress
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">7</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Contact No.</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.contactNo
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">8</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Additional Contact No.</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.additionalContactNo
                ? applicationDetails?.additionalContactNo
                : "-"
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">9</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">E-mail ID</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.emailId
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">10</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Application Date</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.applicationDate
            }</td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px;font-weight: 700; width: 4%;">11</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Validity Date</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 500;width: 47%;">${
              applicationDetails?.validityDate
            }</td>
        </tr>
    </table>
    <table
        style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-top: 20px;"
    >
  
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-size: 15px;font-weight: 700; width: 4%;">Sr. No</td>
            <td style="border: 1px solid black; padding: 10px; font-size: 15px; font-weight: 700; width: 70%;">Registration Fee Structure Details</td>
            <td style="border: 1px solid black; padding: 10px; font-size: 15px; font-weight: 700;width: 20%;">Amount</td> 
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;">1</td>
            <td style="border: 1px solid black; padding: 10px;  font-weight: 700; width: 70%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td> 
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;">2</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 70%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;">3</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 70%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;">4</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 70%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;">5</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 70%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 70%; text-align: right;">Gross Total</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td>
        </tr>
        <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 4%;"></td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 70%; text-align: right;">Total Amount Payable</td>
            <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 20%;"></td>
        </tr>
    </table>  
    
    <div style="text-align: center; border: 1px solid black; margin-top: 20px; padding: 10px; border-bottom: none; font-size: 15px; font-weight: 700;width: auto" >
        Registration Fee Payment Submission details
       </div>
    <table
    style="width: 100%; border: 1px solid black; border-collapse: collapse; "
    >
   
    <tr style="text-align: center;">
     
        <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Payment Status</td>
        <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 47%;"></td>
    </tr>
    <tr style="text-align: center;">
   
        <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Payment Mode</td>
        <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 47%;"></td>
    </tr>
    <tr style="text-align: center;">
       
        <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Transaction No.</td>
        <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 47%;"></td>
    </tr>
    <tr style="text-align: center;">

        <td style="border: 1px solid black; padding: 10px; font-weight: 700; width: 47%;">Payment Date</td>
        <td style="border: 1px solid black; padding: 10px; font-weight: 700;width: 47%;"></td>
    </tr>
  
    </table>
      `,
    };

    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      fs.writeFile("test.pdf", pdfBuffer, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    console.log(path.join(__dirname, "../test.pdf"), "path");
    await sendEmail({
      email: "vaibhavm1901@gmail.com",
      subject: "New Form Created",
      message: "New Form Created",
      html: `<h1>Form Created</h1>`,
      pdf: path.join(__dirname, "../test.pdf"),
    });

    res.status(201).json({
      success: true,
      form,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createForm = async (req, res) => {
  // req.body.user = req.user.id;
  // give unique applicationNo to each form
  // get all fields from form-data
  try {
    console.log(req.body, "req.body");
    const { lead } = req.body;

    const { file } = req.files;
    console.log(file, "file");

    const leadData = JSON.parse(lead);
    console.log(leadData, "leadData");

    const auth = new google.auth.GoogleAuth({
      keyFile: "./googlekey.json",
      scopes: "https://www.googleapis.com/auth/drive",
    });
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: file.name,
      parents: [googleApiFolderId],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(
        //how to get the file path from the request
        "./uploads/" + file.name
      ),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = response.data.id;

    const fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    console.log(fileUrl, "fileUrl");

    const uploadFile = fileUrl;

    console.log(lead.applicationDetails, "form.applicationDetails");

    const form = await Form.create({
      ...leadData,
      user: req.user.id,
      uploadFile: uploadFile,
    });

    res.status(201).json({
      success: true,
      form,
    });
  } catch (err) {
    console.log(err);
  }

  //get applicationNo from form-data
};

//get single form -- USER
exports.getSingleForm = async (req, res) => {
  try {
    const lead = await Form.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        lead,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.searchForm = async (req, res) => {
  //search using applicationName
  const { applicantName } = req.body;

  try {
    //search applicationName in db
    //find all forms where applicationName is equal to applicantName
    const form = await Form.find({
      applicationDetails: {
        applicantName,
      },
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }
    res.status(200).json({
      success: true,
      form,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all forms including coordinator's forma
exports.getAllForms = async (req, res) => {
  try {
    //get all forms from db
    // get all entries from collection
    const leads = await Form.find();

    if (!leads) {
      return res.status(404).json({
        success: false,
        message: "No forms found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        leads,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//delete a form -- ADMIN
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Form deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

//delete all forms -- ADMIN
exports.deleteAllForms = async (req, res) => {
  try {
    const form = await Form.deleteMany();
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }
    res.status(200).json({
      success: true,
      message: "All forms deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

//get forms for a specific user -- USER
exports.getUserForms = async (req, res) => {
  try {
    const leads = await Form.find({ user: req.user.id });
    if (!leads) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        leads,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

//update a form -- USER
exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        form,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

exports.getFormsByServiceType = async (req, res) => {
  try {
    const leads = await Form.find({ serviceType: " " });
    if (!leads) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        leads,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// upload file to google drive and return string url
exports.uploadFile = async (req, res) => {
  try {
    console.log(req.file, "req.file");
    console.log(req.files, "req.files");
    const { file } = req.files;
    const { id } = req.params;
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }

    console.log(form, "form found");
    const auth = new google.auth.GoogleAuth({
      keyFile: "./googlekey.json",
      scopes: "https://www.googleapis.com/auth/drive",
    });
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: file.name,
      parents: [googleApiFolderId],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(
        //how to get the file path from the request
        "./uploads/" + file.name
      ),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = response.data.id;

    const fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    form.uploadFile = [...form.uploadFile, fileUrl];

    await form.save();

    res.status(200).json({
      success: true,
      data: {
        fileUrl,
      },
    });
  } catch (err) {
    console.log("going in erorr", err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

//get single form by id -- ADMIN
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "No form found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        form,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

//upload multiple files to google drive and return string url

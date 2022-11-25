const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
var cors = require("cors");
const File = require("./models/uploadModel");
const multer = require("multer");
var fs = require("fs");

const app = express();

dotenv.config({ path: "./config/.env" });
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//configuration for static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  //accept any file
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);

  try {
    const file = new File({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      data: file,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
});

//remove file from uploads folder
app.post("/remove", (req, res) => {
  const { filename } = req.body;
  console.log(filename);
  fs.unlink(path.join(__dirname, "uploads", filename), (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(200).json({
    status: "success",
  });
});

//   res.send("File uploaded successfully");

app.use(fileUpload());

const form = require("./routes/formRoute");
const defaultRoute = require("./routes/defaultRoute");
const user = require("./routes/userRoute");

app.use("/", defaultRoute);

app.use("/api/v1", form);
app.use("/api/v1", user);

module.exports = app;

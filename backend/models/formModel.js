const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.static("increment", async function (counterName) {
  const count = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    // new: return the new value
    // upsert: create document if it doesn't exist
    { new: true, upsert: true }
  );
  return count.seq;
});

const CounterModel = mongoose.model("Counter", counterSchema);

const formSchema = new mongoose.Schema({
  applicationNo: {
    type: String,
  },
  applicationDetails: {
    applicantName: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    communicationAddress: {
      type: String,
      required: true,
    },
    projectUnitAddress: {
      type: String,
      required: true,
    },
    //accept two contact numbers
    contactNo: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    applicationDate: {
      type: Date,
      required: true,
    },
    validityDate: {
      type: Date,
    },
  },
  registrationFees: {
    bussinessPlanFees: {
      type: Number,
      //required: true
    },
    companyIncorporationFees: {
      type: Number,
    },
    fundAssistanceFees: {
      type: Number,
    },
    projectAssistanceFees: {
      type: Number,
    },
    schemeFees: {
      type: Number,
    },
    serviceType: {
      type: String,
      // //required: true
    },
    documentationVerificationFee: {
      type: Number,
      //required: true
    },
    projectRegistrationFee: {
      type: Number,
      //required: true
    },
    projectManagementFee: {
      type: Number,
      //required: true
    },
    projectDevelopmentFee: {
      type: Number,
      //required: true
    },
    fundingAssistanceFee: {
      type: Number,
      //required: true
    },
    totalAmountPayable: {
      type: Number,
      //required: true
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    paymentStatus: {
      type: String,
      default: "N/A",
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
  },
  bankDetails: {
    bankName: {
      type: String,
    },
    branch: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploadFile: [
    {
      type: String,
    },
  ],
});

formSchema.pre("save", async function () {
  // Don't increment if this is NOT a newly created document
  if (!this.isNew) return;

  const testvalue = await CounterModel.increment("entityId");
  //convert testvalue to three digit number
  const applicationNo = `MAHANSK${currentYear}MPS${testvalue
    .toString()
    .padStart(3, "0")}`;
  this.applicationNo = applicationNo;
});
module.exports = mongoose.model("Form", formSchema);

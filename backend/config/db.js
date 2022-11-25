const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectToDB = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) =>
      console.log(
        `MongoDB connected successfully with server ${data.connection.host}`
      )
    );
};

module.exports = connectToDB;

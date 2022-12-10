const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectToDB = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    })
    .then((data) =>
      console.log(
        `MongoDB connected successfully with server ${data.connection.host}`
      )
    )
    .catch((err) => console.log(err));
};

module.exports = connectToDB;

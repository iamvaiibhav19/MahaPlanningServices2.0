const app = require("./app");

const dotenv = require("dotenv");

const connectToDB = require("./config/db");

dotenv.config({ path: "./config/.env" });

connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

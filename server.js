const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Update the views path
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

const url = `mongodb+srv://${process.env.Mongo_USER}:${process.env.MONGO_PASSWORD}@cluster0.seqjalt.mongodb.net/issa?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

conn.once("open", () => {
  console.log("Database connected successfully");
});

conn.on("error", (error) => {
  console.error("Error connecting to database:", error);
  process.exit();
});

const userRoute = require("./Routes/userRoute");
const requestRoute = require("./Routes/requestRoute");
const donorrouter = require("./Routes/donor_route");
const contactUs = require("./Routes/ContactUsRouter");
const paymentRoute = require("./Routes/paymentRoute");

app.use(userRoute);
app.use(requestRoute);
app.use(donorrouter);
app.use(contactUs);
app.use(paymentRoute);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/", async (req, res) => {
//   try {
//     const adminMessages = await ContactUs.find({ messageType: "admin" });
//     res.render("user", { adminMessages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/admin", async (req, res) => {
//   try {
//     const userMessages = await ContactUs.find({ messageType: "user" });
//     res.render("admin", { userMessages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});

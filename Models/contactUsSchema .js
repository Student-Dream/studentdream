const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contactUsSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  message: { type: String, required: false },
  // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // user: { type: Schema.Types.ObjectId, ref: "admin", required: true },
  senderType: String, // لا تحتاج إلى قيمة افتراضية هنا
});

contactUsSchema.pre("save", function (next) {
  console.log("😊😊😊😊😊");
  console.log(this.user);
  console.log("😊😊😊😊😊");
  // التحقق إذا كانت هناك قيمة للحقل user
  // if (this.user) {
  //   this.senderType = "user";
  // } else {
  //   this.senderType = "admin";
  // }
  next();
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;

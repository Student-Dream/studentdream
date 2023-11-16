const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  university_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // يمكنك استخدام نموذج University إذا كان لديك جدول للجامعات
  student_proof: { type: String, required: true },
  fund: { type: Number, required: true },
  status: { type: String, default: "pending", required: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;

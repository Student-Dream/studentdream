// controllers/contactUsController.js
const ContactUs = require("../Models/contactUsSchema ");
// In controllers/contactUsController.js

const getAllContactMessages = async (req, res) => {
  try {
    const contactMessages = await ContactUs.find();
    console.log("Contact Messages:", contactMessages); // Add this line
    // res.render("Contact-us", { messages: contactMessages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContactMessageById = async (req, res) => {
  const contactId = req.params._id;

  try {
    const contactMessage = await ContactUs.findById(contactId);
    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json(contactMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContactMessageByIduser = async (req, res) => {
  // const contactId = req.params.id;
  const userID = req.params._id;
  console.log(userID);

  try {
    const contactMessage = await ContactUs.find({ user: userID });
    console.log(contactMessage);
    if (!contactMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json(contactMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getContactMessageByIduser = async (req, res) => {
//   const userID = req.user._id;

//   try {
//     const contactMessages = await ContactUs.find({ user: userID });
//     //   const userMessages = contactMessages.filter(message => message.senderType === 'user');
//     const adminMessages = contactMessages.filter(
//       (message) => message.senderType === "admin"
//     );
//     if (!contactMessages || contactMessages.length === 0) {
//       return res.render("Contact-us", {
//         contactMessages: [],
//         adminMessages: [],
//       });
//     }

//     res.render("Contact-us", { contactMessages });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getUserMessages = async (req, res) => {
  try {
    const userMessages = await ContactUs.find({ senderType: "user" });
    res.render("admin", { userMessages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminMessages = async (req, res) => {
  try {
    const adminMessages = await ContactUs.find({ senderType: "admin" });
    res.render("user", { adminMessages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const addContactMessage = async (req, res) => {
//   const formData= { names, email, message }
//    const userID = req.user._id;

//   try {
//     const newMessage = new ContactUs({
//       names:formData.names,
//       email: formData.email,
//       message: formData.message,
//       user: userID, // Reference to the user document
//     });
//     const savedMessage = await newMessage.save();
//     res.json(savedMessage);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const addContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  const userID = req.user._id;
  console.log(userID);
  try {
    let senderType = "user";
    console.log(req.user.role);
    if (req.user.role === "user") {
      senderType = "user";
    } else {
      senderType = "admin";
    }
    console.log(senderType, req.user.role === "user");
    const newMessage = new ContactUs({
      name: name,
      email: email,
      message: message,
      user: userID,
      senderType: senderType,
    });
    console.log(newMessage);
    const savedMessage = await newMessage.save();
    console.log(savedMessage);
    res.json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllContactMessages,
  getContactMessageById,
  getContactMessageByIduser,
  addContactMessage,
  getAdminMessages,
  getUserMessages,
};

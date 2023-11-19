const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();

// const register = async (req, res) => {
//   const { username, email, password, role, phonenumber } = req.body;

//   const schema = Joi.object({
//     username: Joi.string().alphanum().min(3).max(30).required(),
//     email: Joi.string().required(),
//     password: Joi.string()
//       .pattern(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%&])[a-zA-Z\d@#!$%&]{8,}$/
//       )
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one of @, #, !, $, %, or &.",
//       }),
//     phonenumber: Joi.string()
//       .pattern(/^[0-9]{10}$/)
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Invalid phone number format. Please enter a 10-digit phone number.",
//       }),
//   });

//   const { error } = schema.validate({ username, email, password, phonenumber });

//   if (error) {
//     return res.status(400).json({ success: false, error: error.message });
//   }

//   try {
//     await User.checkUserExistence(email, username, phonenumber);
//     await User.register(username, email, password, role, phonenumber);
//     res.render("register", {
//       success: true,
//       message: "User added successfully",
//     });
//     // res.status(201).json({ success: true, message: 'User added successfully' });
//   } catch (err) {
//     console.error(err);
//     if (
//       err.message === "Email already exists" ||
//       err.message === "Username already exists" ||
//       err.message === "Phonenumber already exists"
//     ) {
//       res.status(400).json({ success: false, error: err.message });
//     } else {
//       res
//         .status(500)
//         .json({ success: false, error: "User registration failed" });
//     }
//   }
// };

// const registers = async (req, res) => {
//   const { username, email, password,  phonenumber } = req.body;

//   const schema = Joi.object({
//     username: Joi.string().alphanum().min(3).max(30).required(),
//     email: Joi.string().required(),
//     password: Joi.string()
//       .pattern(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%&])[a-zA-Z\d@#!$%&]{8,}$/
//       )
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one of @, #, !, $, %, or &.",
//       }),
//     phonenumber: Joi.string()
//       .pattern(/^[0-9]{10}$/)
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Invalid phone number format. Please enter a 10-digit phone number.",
//       }),
//   });

//   const { error } = schema.validate({ username, email, password, phonenumber });

//   if (error) {
//     //   return res.status(400).json({ success: false, error: error.message });
//     const errorMessage = "Invalid email or password";
//     return res.status(401).render("register", { errorMessage });
//   }

//   try {
//     await User.checkUserExistence(email, username, phonenumber);
//     await User.register(username, email, password, role, phonenumber);
//     res.render("register", {
//       success: true,
//       message: "User added successfully",
//     });
//     console.log("Login successful");

//     // res.status(201).json({ success: true, message: 'User added successfully' });
//   } catch (err) {
//     console.error(err);
//     if (
//       err.message === "Email already exists" ||
//       err.message === "Username already exists" ||
//       err.message === "Phonenumber already exists"
//     ) {
//       res.status(400).json({ success: false, error: err.message });
//     } else {
//       res
//         .status(500)
//         .json({ success: false, error: "User registration failed" });
//     }
//   }
// };
const register = async (req, res) => {
  const { username, email, password, role, phonenumber } = req.body;

  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%&])[a-zA-Z\d@#!$%&]{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one of @, #, !, $, %, or &.",
      }),
    phonenumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Invalid phone number format. Please enter a 10-digit phone number.",
      }),
  });

  const { error } = schema.validate({ username, email, password, phonenumber });

  if (error) {
    return res
      .status(400)
      .render("signup", { errorMessage: error.message, successMessage: null });
  }

  try {
    await User.checkUserExistence(email, username, phonenumber);
    await User.register(username, email, password, role, phonenumber);
    res.render("signup", {
      successMessage: "register successful",
      errorMessage: null,
    });
    console.log("register successful");
  } catch (err) {
    console.error(err);
    if (
      err.message === "Email already exists" ||
      err.message === "Username already exists" ||
      err.message === "Phonenumber already exists"
    ) {
      res
        .status(400)
        .render("signup", { errorMessage: err.message, successMessage: null });
    } else {
      res
        .status(500)
        .render("signup", {
          errorMessage: "User registration failed",
          successMessage: null,
        });
    }
  }
};

// const register = async (req, res) => {
//   const { username, email, password, role, phonenumber } = req.body;

//   const schema = Joi.object({
//     username: Joi.string().alphanum().min(3).max(30).required(),
//     email: Joi.string().required(),
//     password: Joi.string()
//       .pattern(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%&])[a-zA-Z\d@#!$%&]{8,}$/
//       )
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one of @, #, !, $, %, or &.",
//       }),
//     phonenumber: Joi.string()
//       .pattern(/^[0-9]{10}$/)
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Invalid phone number format. Please enter a 10-digit phone number.",
//       }),
//   });

//   const { error } = schema.validate({ username, email, password, phonenumber });

//   if (error) {
//     //   return res.status(400).json({ success: false, error: error.message });
//     const errorMessage = "Invalid email or password";
//     return res.status(401).render("register", { errorMessage });
//   }

//   try {
//     await User.checkUserExistence(email, username, phonenumber);
//     await User.register(username, email, password, role, phonenumber);
//     res.render("register", {
//       success: true,
//       message: "User added successfully",
//     });
//     // res.status(201).json({ success: true, message: 'User added successfully' });
//   } catch (err) {
//     console.error(err);
//     if (
//       err.message === "Email already exists" ||
//       err.message === "Username already exists" ||
//       err.message === "Phonenumber already exists"
//     ) {
//       res.status(400).json({ success: false, error: err.message });
//     } else {
//       res
//         .status(500)
//         .json({ success: false, error: "User registration failed" });
//     }
//   }
// };

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email);
    if (!user || user === "Email is not found") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    // res.render("login", {
    //     success: true,
    //     message: "Successfully signed in",
    //     user,
    //     token,
    //   });
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ success: true, message: 'Successfully signed in', user,token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.login(email);
//     if (!user || user === "Email is not found") {
//       const errorMessage = "Invalid email or password";
//       return res.status(401).render("login", { errorMessage });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       const errorMessage = "Invalid email or password";
//       return res.status(401).render("login", { errorMessage });
//     }

//     const token = jwt.sign(
//       { userId: user._id, email: user.email, role: user.role },
//       process.env.SECRET_KEY,
//       { expiresIn: "4h" }
//     );
//     res.cookie("token", token, { httpOnly: true });
//     // res.render("login", { successMessage: "Login successful" });
//     res.redirect("http://localhost:5000/allaccepted");
//     console.log("Login successful");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
const logins = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email);
    if (!user || user === "Email is not found") {
      const errorMessage = "Invalid email or password";
      return res.status(401).render("login", { errorMessage });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const errorMessage = "Invalid email or password";
      return res.status(401).render("login", { errorMessage });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    res.cookie("token", token, { httpOnly: true });
    res.render("login", { successMessage: "Login successful" });
    console.log("Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  logins,
};

const userController = require("../Controller/usercontroller");
const express = require("express");
const router = express.Router();

// _________________________________________________😜Register😜___________________________________________________________
router.post("/register", userController.register);
router.get("/register", userController.register);

// ___________________________________________________🤣Login🤣___________________________________________________________
router.get("/login", userController.login);
router.post("/login", userController.login);




module.exports = router;

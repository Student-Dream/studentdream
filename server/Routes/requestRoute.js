const express = require('express');
const router = express.Router();
const requestController = require('../Controller/requestController')
const { authenticateToken } = require('../middleware/authMiddleware');



router.post("/newrequest", authenticateToken, requestController.newrequest);
router.get("/allaccepted", requestController.allaccepted);

// router.get("/allarejected",authenticateToken, requestController.allrejected);
router.get("/all",authenticateToken, requestController.allRequests);
router.get("/myrequests",authenticateToken, requestController.myRequests);
router.get("/pending",authenticateToken, requestController.pendingRequests);
router.get("/rejected",authenticateToken, requestController.myrejectedRequests);
router.get("/accept",authenticateToken, requestController.myacceptedRequests);
router.put("/request/update/:id",authenticateToken, requestController.updateRequest);
router.put("/request/delete/:id",authenticateToken, requestController.deleteRequest);
router.put("/request/accept/:id",authenticateToken, requestController.accept);
router.put("/request/reject/:id",authenticateToken, requestController.reject);

module.exports = router;
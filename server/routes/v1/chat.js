const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../../controllers/v1/chat");

// PRIVATE
router.use(passport.authenticate("jwt", {session: false}));

router.post("/", controller.createChat);
router.get("/", controller.getPendingChats);
router.put("/close", controller.closeChat);

module.exports = router;
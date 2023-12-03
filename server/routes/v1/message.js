const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../../controllers/v1/message");

// PRIVATE
router.use(passport.authenticate("jwt", {session: false}));

router.get("/", controller.getMessage);

module.exports = router;
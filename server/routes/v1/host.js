const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../../controllers/v1/host");

// PRIVATE
router.use(passport.authenticate("jwt", {session: false}));

router.put("/", controller.makeHost);
router.put("/:chatId", controller.assignHost);
router.get("/stats", controller.myStats);


module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../../controllers/v1/user");

// PUBLIC
router.post("/", controller.createUser);
router.get("/sign", controller.getToken);


// PRIVATE
router.use(passport.authenticate("jwt", {session: false}));


module.exports = router;
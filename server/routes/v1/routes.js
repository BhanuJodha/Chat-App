const express = require("express");
const router = express.Router();

router.use("/users", require("./user"))
router.use("/hosts", require("./host"))
router.use("/chats", require("./chat"))
router.use("/messages", require("./message"))

module.exports = router;
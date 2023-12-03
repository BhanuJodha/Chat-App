const express = require("express");
const router = express.Router();

const handlerV1 = require("./v1/routes");

router.use("/v1", handlerV1)

module.exports = router;
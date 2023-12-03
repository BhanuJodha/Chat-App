const { config } = require("dotenv");
config();

const express = require("express");
const app = express();
const cors = require("cors");
const parser = require("body-parser");
const morgan = require('morgan');
const httpServer = require("http").createServer(app);
const apiRouter = require("./routes/api");
const passport = require("./config/passport");
const io = require("./config/socket_io").new(httpServer);
(async () => {
    await require("./config/mongoose")();
    const { subscriber, publisher } = await require("./handlers/redis_pub-sub").inti();
    const activeUsers = await require("./handlers/wb_socket")(io, subscriber, publisher);
})()

// environment
const port = process.env.PORT;

// middelwares
app.use(cors())
app.use(morgan("[:date[iso]] Started :method :url for :remote-addr", {
    immediate: true
}))
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(passport.initialize());

// routes
app.use(express.static("./client"))
app.use("/api", apiRouter);

// start serving
httpServer.listen(port);
if (httpServer.listening)
    console.log("Server is listening on port", port)
else
    console.error("ERROR in starting server")
const passport = require("passport");
const userSocketDictionary = {};
const controller = require("../controllers/v1/message");
const APPID = process.env.APPID;

module.exports = async (io, subscriber, publisher) => {

    // Authenticating using JWT
    io.use((socket, next) => {
        passport.authenticate("jwt", { session: false, failWithError: new Error("Token Expires") })(socket.request, {}, next);
    })

    io.on("connection", (socket) => {
        console.log("New Connection", socket.request.user.email)
        userSocketDictionary[socket.request.user.id] = socket.id;

        // user sends a message
        socket.on("send-message", async (message, cb) => {
            console.log("New message from", socket.request.user.email)
            message = await controller.newMessage(socket.request, message.message, message.chatId);

            message.success && publisher.publish("livechat", JSON.stringify(message.data));
            typeof (cb) === 'function' ?? cb(message)
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected :", socket.request.user.name);
            // Remove socket from dictionary
            delete userSocketDictionary[socket.request.user.id];
        })
    })

    // for checking current sticky sessions
    await subscriber.subscribe("livechat", function (message, channel) {
        try {
            console.log(`Server ${APPID} received message in channel ${channel}`);
            message = JSON.parse(message)
            console.log("MESSAGE:",message)

            // reciver hit
            if (userSocketDictionary[message.reciver]) {
                io.to(userSocketDictionary[message.reciver]).emit("new-message", message);
                console.log("Message sent by host", APPID, "to reciver:", message.reciver);
            }

            // sender hit
            if (userSocketDictionary[message.sender]) {
                io.to(userSocketDictionary[message.sender]).emit("new-message", message);
                console.log("Message sent by host", APPID, "to sender:", message.sender);
            }
        }
        catch (err) {
            console.error("Error in sending message on websocket", err)
        }
    });

    return userSocketDictionary;
}
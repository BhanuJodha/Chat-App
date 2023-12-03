const {Server} = require("socket.io");

exports.new = (server) => {
    const io =  new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    return io;
}
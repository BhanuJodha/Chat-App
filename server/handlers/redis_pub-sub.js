const redis = require("redis");

let subscriber, publisher;

exports.inti = async () => {
    
    publisher = redis.createClient({
        url: process.env.REDIS_HOST
    });

    publisher.on('error', function(err) {
        redisIsReady = false;
        console.log('redis publisher is not running');
        console.log(process.env)
        console.log(err);
    });
    
    publisher.on('ready', function() {
        redisIsReady = true;
        console.log('redis publisher is running');
    });

    await publisher.connect()

    subscriber = publisher.duplicate()

    subscriber.on('error', function(err) {
        redisIsReady = false;
        console.log('redis subscriber is not running');
        console.log(err);
    });
    
    subscriber.on('ready', function() {
        redisIsReady = true;
        console.log('redis subscriber is running');
    });

    await subscriber.connect();

    return { subscriber, publisher };
}
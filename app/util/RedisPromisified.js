const redis = require('redis');
const Promise = require('promise');
const client = redis.createClient();

client.on('connect', function() {
    console.log('db conencted');
});

const RedisPromisified = {
    hgetall: function(key) {
        return new Promise((fulfill, reject) => {
            client.hgetall(key, (err, obj) => {
                if(err) {
                    reject(err);
                } else {
                    fulfill(obj);
                }
            });
        });
    },
    hmset: function(key, hash) {
        return new Promise((fulfill, reject) => {
            client.hmset(key, hash, (err, obj) => {
                if(err) {
                    reject(err);
                } else {
                    fulfill(obj);
                }
            });
        });
    },
    del: function(key) {
        return new Promise((fulfill, reject) => {
            client.del(key, (err, obj) => {
                if(err) {
                    reject(err);
                } else {
                    fulfill(obj);
                }
            })
        });
    },
    exists: function(key) {
        return new Promise((fulfill, reject) => {
            client.exists(key, (err, obj) => {
                if(err) {
                    reject(err);
                } else {
                    fulfill(obj);
                }
            });
        });
    }
};

module.exports = RedisPromisified;
//console.log(redisPromisified.hgetall());
//redisPromisified.hgetall(12).then(console.log);
//redisPromisified.hgetall().then((res) => {console.log(res);});
//redisPromisified.hmset(13, {1:123, 2:32312}).then(console.log);
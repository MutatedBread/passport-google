var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('db conencted');
});

var db = {

    findUser: function(id) {
        client.hgetall(id, function(err, obj) {
            if(err){
                return "error";
            }
            return obj;
        })
    },
    
    newUser: function(id, token, email, name) {
        client.hmset(id, {
            'google.email': email,
            'google.name': name,
            'google.token': token
        });
    },

    deleteUser: function(id) {
        client.del(id, function(err, reply){
            console.log(reply);
        });
    },

    existUser: function(id) {
        client.exists(id , function(err, reply) {
            if (reply === 1) {
                return true;
            }
            return false;
        });
    },
};

module.exports = db;
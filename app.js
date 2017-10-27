const irc = require('irc');

const config = require('./config.js');

const client = new irc.Client(config.SERVER, config.BOT_NICK, {
    userName: config.BOT_USERNAME,
    realName: config.BOT_REALNAME,
    sasl: true,
    password: config.BOT_SASL_PASSWORD,
    channels: config.AUTOJOIN
});

let pluginsManager = null;
const reloadPluginsManager = () => {
    const filename = './src/PluginsManager.js';
    delete require.cache[require.resolve(filename)];
    try{
        const pluginsManagerClass = require(filename);
        pluginsManager = new pluginsManagerClass(client);
        pluginsManager.reloadSelf = reloadPluginsManager;
    }
    catch(err){
        console.log('Error reloading master module:');
        console.log(err);
    }
};
reloadPluginsManager();

client.on('error', (msg) => {
    console.log(msg);
});
client.addListener('message', (from, to, message, messageData) => {
    try{
        pluginsManager.handleMessage(from, to, message, messageData);
    }
    catch(err){
        console.log('Error handling message "' + message + '" from ' + from + ' to ' + to + ':');
        console.log(err);
    }
});
client.on('join', (channel, nick, message) => {
    console.log(nick + ' joined ' + channel + '.');
});
client.on('registered', (msg) => {
    console.log('Connected!');
});

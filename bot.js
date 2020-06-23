// We know this is jank af, don't worry about it

const { Client } = require('discord.js');
require('events').EventEmitter.defaultMaxListeners = 15;
const cycle = require('./js/cycle.js');
const util = require('util');
const client = new Client();

// This keeps the connection open, cause weird things happen
setTimeout(() => {
    client.ws.connection.triggerReady()
},30000)

// Ready event
client.on('ready', () => {
    process.send(`{"evt":"ready", "args":[]}`);
});

// When a message is sent
client.on('message', (...args) => {
    let object = JSON.decycle(args);
    object[0] = enhanceMsg(object[0], args[0]);
    process.send(`{"evt":"message", "args":${JSON.stringify(object)}}`);
});

// Message updating
client.on('messageDelete', (...args) => {
    let object = JSON.decycle(args);
    process.send(`{"evt":"messageDelete", "args":${JSON.stringify(object)}}`);
});

client.on('messageDeleteBulk', (...args) => {
    let object = JSON.decycle(args);
    process.send(`{"evt":"messageDeleteBulk", "args":${JSON.stringify(object)}}`);
});

client.on('messageUpdate', (...args) => {
    let object = JSON.decycle(args);
    for (let i=0;i<2;i++) {
        object[i] = enhanceMsg(object[i], args[i]);
    }
    process.send(`{"evt":"messageUpdate", "args":${JSON.stringify(object)}}`);
});

// Error or disconnect
client.on('error', (...args) => {
    let object = JSON.decycle(args);
    process.send(`{"evt":"error", "args":${JSON.stringify(object)}}`);
});

client.on('disconnect', (...args) => {
    let object = JSON.decycle(args);
    process.send(`{"evt":"disconnect", "args":${JSON.stringify(object)}}`);
});

// // Capture all events, and forward to the manager
// const oldEmit = client.emit.bind(client);
// client.emit = (evt, ...args) => {
//     let object = JSON.decycle(args);

//     // Add custom stuff to the object
//     if (evt == 'message') {
//         object[0] = enhanceMsg(object[0], args[0]);

//     } else if (evt == 'messageUpdate') {
//         // I don't think this one is needed, but it's here as an example
//         for (let i=0;i<2;i++) {
//             object[i] = enhanceMsg(object[i], args[i]);
//         }
//     } else if (evt == 'ready') {
//         //console.log(client.guilds.map(g => g));
//     }

//     // Send event and args to manager
//     process.send(`{"evt":"${evt}", "args":${JSON.stringify(object)}}`);
// }

// Add more information to message objects
function enhanceMsg(object, arg) {
    let localObj = object;
    //console.log(object);
    try {
        localObj.channel.guild = arg.channel.guild
        //localObj.embeds = arg.embeds;
        localObj.guild = arg.guild;
    } catch (e) {}
    return localObj;
}

client.login(client.shard.token);

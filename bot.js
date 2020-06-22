// bot.js
const { Client } = require('discord.js');
const cycle = require('./cycle.js');
const util = require('util');
const client = new Client();

// Capture all events, and forward to the manager
const oldEmit = client.emit.bind(client);
client.emit = (evt, ...args) => {
    let object = JSON.decycle(args);

    // Add custom stuff to the object
    if (evt == 'message' || evt == 'messageUpdate') {
        object[0].channel.guild = args[0].channel.guild
        object[0].embeds = args[0].embeds;
    }

    // Send event and args to manager
    process.send(`{"evt":"${evt}", "args":${JSON.stringify(object)}}`)
}

client.login(client.shard.token);

bot.on('ready', () => {
    
    
});

// A message has been deleted
bot.on('messageDelete', (m) => {
    // Return if it's not the selected channel
    if(m.channel != selectedChan) return;
    // Get the dom element from the message
    let message = document.getElementById(m.id);
    let firstMessage = message.classList.contains('firstmsg');

    // Remove the message element
    removeMessage(message, firstMessage);
});

// Multiple messages have been deleted
bot.on('messageDeleteBulk', (msgs) => {
    // Return if it's not the selected channel
    if(msgs.first().channel != selectedChan) return;
    for(let m of msgs){
        let message = document.getElementById(m[1].id);
        let firstMessage = message.classList.contains('firstmsg');

        // Remove the message element
        removeMessage(message, firstMessage);
    }
});

// A message has been updated
bot.on('messageUpdate', (oldM, m) => {
    // Return if it's not the selected channel or if the message wasn't edited
    if(m.channel != selectedChan || !m.editedAt) return;
    // Get the dom element from the message
    let message = document.getElementById(m.id).querySelector('.messageText');
    message.innerHTML = `${parseMessage(m.cleanContent)} <time class='edited'>(edited)</time>`;
});


// New message recieved
bot.on('message', (m) => {
    // If there is a channel selected
    if (selectedGuild && m.guild.id == selectedGuild.id) {

        let channel = document.getElementById(m.channel.id);
        if (channel && (!selectedChan || (selectedChan && selectedChan.id != m.channel.id))) {
            channel.classList.add("newMsg");
        }

        // If the message was sent to the selected channel
        if (selectedChan && m.channel.id == selectedChan.id) {
            //document.getElementById('message-list').removeChild(document.getElementById('message-list').firstChild);
            let previousMessage;
            fetchLast();

            // Get last message in channel
            async function fetchLast() {
                await m.channel.fetchMessages({ limit: 2 }).then(msg => {
                    previousMessage = msg.map(mseg => mseg)[1];
                });

                let scroll = false;
                if (document.getElementById('message-list').scrollHeight - Math.floor(document.getElementById('message-list').scrollTop) == document.getElementById('message-list').clientHeight) {
                    scroll = true;
                }

                if (barry) {
                    bunch = false;
                    barry = false;
                }

                // Generate and add the message
                let message = generateMsgHTML(m, previousMessage);
                document.getElementById('message-list').appendChild(message);

                // Auto scroll with the message
                // Some debug stuff \/
                // console.log("Client height: " + document.getElementById('message-list').clientHeight);
                // console.log("Message list top: " + document.getElementById('message-list').scrollTop);
                // console.log("Message list scrolled: " + document.getElementById('message-list').scrollHeight);
                // console.log("Total Height: " + (document.getElementById('message-list').scrollHeight - Math.floor(document.getElementById('message-list').scrollTop)));
                if (scroll == true) {
                    document.getElementById('message-list').scrollTop = document.getElementById('message-list').scrollHeight;
                    scroll = false;
                }
            }
        }
    }
});

// Runs when unloaded
bot.on('error', () => {
    // Remove the server list when connection lost
    while (document.getElementById('guild-list').firstChild) {
        document.getElementById('guild-list').removeChild(document.getElementById('guild-list').firstChild);
    }
    
    unloadAllScripts();
});
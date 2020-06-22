const { readSync } = require("fs");

// Load a new token
function load(token) {
    const manager = new ShardingManager('./bot.js', {token: token});

    manager.spawn();
    manager.on('launch', shard => {
        console.log(`Launched shard #${shard.id}`);
    });

    manager.on('message', (shard, message) => {
        let isMessage = false;
        let isEvent = false;
        // Check if this is a message or not
        try {
            if (JSON.parse(message).msg) {
                isMessage = true;
            }
        } catch (e) {}
        try {
            if (JSON.parse(message).evt) {
                isEvent = true;
            }
        } catch (e) {}
    
        // If it's a message, run some code, otherwise run other code
        if (isMessage) {
            console.log(`Message is: ${JSON.parse(message).msg}`);
        } else if (isEvent) {
            let msg = JSON.parse(message);
            let event = msg.evt;
            let args = msg.args;
            console.log(`Event is '${event}'`);
    
            // Event handlers here
            if (event == 'raw') {
                // Uncached stuff happens here
            } if (event == 'ready')
                // Call the ready function
                shard.eval('this').then(e => ready(e));
                

            else if (event == 'message') {
                console.log(args[0]);
            } else if (event == 'messageUpdate') {
                console.log(args);
            }
                
    
        } else {
            console.log(`Not a message`) 
        }
    });
}

function removeMessage(message, firstMessage) {
    // Check if you need to delete just the message or the whole message block
    if (message.parentNode.children.length > 1) {
        if (firstMessage) {
            let embed = message.querySelector('.embed');
            let text = message.querySelector('.messageText');
            let nextElement = message.nextElementSibling;
            
            if (embed)
                message.removeChild(embed);
            if (text)
                message.removeChild(text);

            message.innerHTML += nextElement.innerHTML;
            message.id = nextElement.id;

            message.parentElement.removeChild(nextElement);
        } else {
            message.parentElement.removeChild(message);
        }
    } else {
        document.getElementById('message-list').removeChild(message.parentNode);
    }
}
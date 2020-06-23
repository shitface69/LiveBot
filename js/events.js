async function ready(shard) {
    // Load and start all the scripts
    loadAllScripts();

    console.log('doing the thing')
    let user = await getUser(shard);

    // Log the status of the bot
    try {
        console.log(`Logged in as ${user.tag}`);
        
    } catch (err) {
        console.log('Invalid Token');
        return;
    }

    // Update the user card
    document.getElementById('userCardName').innerHTML = user.username;
    document.getElementById('userCardDiscrim').innerHTML = `#${user.discriminator}`;
    document.getElementById('userCardIcon').src = `${user.displayAvatarURL.replace(/(size=)\d+?($| )/, '$164')}`;

    if (user.bot) {
        document.getElementById('userCardBot').innerHTML = `BOT`;
        document.getElementById('userCardBot').style.marginLeft = `8px`;
    } else {
        document.getElementById('userCardBot').innerHTML = `USER`;
        document.getElementById('userCardBot').style.marginLeft = `5px`;
    }
    
    // Create the guild indicator
    let guildIndicator = document.createElement('div');
    guildIndicator.id = 'guildIndicator';
    document.getElementById('guild-list').appendChild(guildIndicator);

    // Loop through all the guilds and create the element for the icon
    let guilds = await shard.eval('this.guilds.map(g => g)');
    guilds.forEach(async g => {
        g.iconURL = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg`;
        console.log(g);
        let img;
        // If there is no icon url for the server, create the letter icon
        if (g.iconURL == undefined) {
            img = document.createElement('div');

            img.style.backgroundColor = '#2F3136';
            img.style.marginBottom = '4px';

            let abrev = document.createElement('p');
            abrev.id = 'guildAbrev';
            abrev.appendChild(document.createTextNode(g.nameAcronym));
            img.appendChild(abrev);
        } else {
            // The guild has an icon, create the image
            img = document.createElement('img');

            let ico;
            ico = g.iconURL;
            img.src = ico;

            img.alt = g.name;
            img.height = '40';
            img.width = '40';
        }

        // Styling for both image and letter icons
        img.style.height = '40px';
        img.style.width = '40px';
        img.classList.add("guild-icon");
        img.id = g.id;

        // Add the events for the guild icons
        img.onclick = () => {
            guildSelect(g, img, shard);
            selectedGuild = g;
        };
        
        // Add image to the list of guilds
        document.getElementById('guild-list').appendChild(img);
    });
}

// Called when a message is deleted
async function msgDelete(m) {
    // Return if it's not the selected channel
    if(m.channel.id != selectedChan.id) return;
    // Get the dom element from the message
    let message = document.getElementById(m.id);
    let firstMessage = message.classList.contains('firstmsg');

    // Remove the message element
    removeMessage(message, firstMessage);
}

// Called when there is a bulk delete of messages
async function msgBulkDelete(msgs) {
    // Return if it's not the selected channel
    if(msgs.first().channel.id != selectedChan.id) return;
    for(let m of msgs){
        let message = document.getElementById(m[1].id);
        let firstMessage = message.classList.contains('firstmsg');

        // Remove the message element
        removeMessage(message, firstMessage);
    }
}

// Called when a message is updated
async function msgUpdate(oldMsg, m) {
    // Return if it's not the selected channel or if the message wasn't edited
    if(m.channel.id != selectedChan.id || !m.editedAt) return;
    // Get the dom element from the message
    let message = document.getElementById(m.id).querySelector('.messageText');
    message.innerHTML = `${parseMessage(m.cleanContent)} <time class='edited'>(edited)</time>`;
}

// Called when a new message is sent
async function message(m) {
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
}

// Unload and clear the screen when the bot encounters a connection issue
function disconnect() {

    // The below code will have to be replaced. We will need a list of all guild's ids, except for the dead shard, of course
    // Then we sort through the guild list, if the list of ids does not contain that specific guild, kill it. 

    // Remove the server list when connection lost
    while (document.getElementById('guild-list').firstChild) {
        document.getElementById('guild-list').removeChild(document.getElementById('guild-list').firstChild);
    }
    
    unloadAllScripts();
}
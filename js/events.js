function ready(client) {
    // Load and start all the scripts
    loadAllScripts();

    // Log the status of the bot
    try {
        client.shard.eval('this.user.tag').then(botTag => console.log(`Logged in as ${botTag}`));
        
    } catch (err) {
        console.log('Invalid Token');
        return;
    }

    // Update the user card
    document.getElementById('userCardName').innerHTML = bot.user.username;
    document.getElementById('userCardDiscrim').innerHTML = `#${bot.user.discriminator}`;
    document.getElementById('userCardIcon').src = `${bot.user.displayAvatarURL.replace(/(size=)\d+?($| )/, '$164')}`;

    if (bot.user.bot) {
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
    bot.guilds.forEach(g => {
        let img;
        // If there is no icon url for the server, create the letter icon
        if (g.iconURL === null) {
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
            guildSelect(g, img);
            selectedGuild = g;
        };
        
        // Add image to the list of guilds
        document.getElementById('guild-list').appendChild(img);
    });
}
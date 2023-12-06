# Bot discord Tera

***Don't use the `/clear` command in the channel where the messages to be deleted are located.***
***This will return an error in the console and the bot will shutdown.***  
***I advise you to have a channel specifically for bot commands.***

## Sommary
- [Init npm](https://github.com/lybe-source/etar/tree/main#initialiser-npm)
- [Version](https://github.com/lybe-source/etar/tree/main#conna%C3%AEtre-la-version-de-la-librairie-discordjs)
- [Run Bot](https://github.com/lybe-source/etar/tree/main#d%C3%A9marrer-le-code)
- [Commands available - Moderation](https://github.com/lybe-source/etar/tree/main#liste-des-commandes-disponibles-mod%C3%A9ration)
- [Commands available - Everyone](https://github.com/lybe-source/etar/tree/main#liste-des-commandes-disponibles-everyone)
- [Dependencies](https://github.com/lybe-source/etar/tree/main#dependencies)

---

## Installation

### Initialiser npm

```bash
npm init
```

### Connaître la version de la librairie discord.js

```bash
npm ls discord.js
```

### Démarrer le code

```bash
node main
```

---

## Liste des commandes disponibles (Administration)

| Command     | Parameter 1          | Parameter 2          | Parameter 3    | Parameter 4 | Description                                                                                         |
|:------------|:--------------------:|:--------------------:|:--------------:|:-----------:|:---------------------------------------------------------------------------------------:|
| setcaptcha  | on or off            | channel or channelID |                |             | Set the captcha in the server, if the member takes too long or fails the captcha, it will be kicked |
| setantiraid | on or off            |                      |                |             | Set the antiraid in the server, if this is on, no member will be able to join the server            |
| setantispam | on or off            |                      |                |             | Set the antispam in the server, if the member send more than 5 message in 3 secondes |
| setstatus   | activity             | status               | url            |             | Set the status of the bot, choice in the activity list, for streaming activity, the url is required (twitch.tv) |
| setrole     | channel              | messageID            | role           | emoji       | Set the emoji for role reaction attached to the message in the channel |

## Liste des commandes disponibles (Modération)

| Command  | Parameter 1          | Parameter 2          | Parameter 3    | Description                                                                                      |
|:---------|:--------------------:|:--------------------:|:--------------:|:------------------------------------------------------------------------------------------------:|
| kick     | username OR userID   | reason OR null       |                | Kick out a member                                                                                |
| ban      | username OR userID   | reason OR null       |                | Same as kick but prevents it from coming back with an invitation link                            |
| unban    | username OR userID   | reason OR null       |                | Removes the ban if the user is banned from the server                                            |
| mute     | username OR userID   | duration(days OR hours OR seconds) | reason OR null | Prevents the member from writing, reacting or joining a voice channel for up to 28 days. Time unit : Days = d, hours = h, seconds = s |
| unmute   | username OR userID   | reason OR null       |                | Allows the muted user to speak again, react and join voice channels                              |
| clear    | channel OR channelID | number : 1 => 100    |                | Deletes number messages in the channel defined in the command as long as they aren't 14 days old |
| warn     | username OR userID   | reason               |                | Give a warning to a member and record it in the database                                         |
| warnlist | username OR userID   |                      |                | Display the warnings for the member defined in the command                                       |
| lock     | channel              | role                 |                | Prevents the indicate role from writing and sending files in the indicate channel                |
| unlock   | channel              | role                 |                | allows the indicate role to write and send files in the indicate channel                         |

## Liste des commandes pour les évènements
| Command     | Parameter 1          | Parameter 2          | Parameter 3    | Parameter 4 | Parameter 5 | Parameter 6 |Description                                                                             |
|:------------|:--------------------:|:--------------------:|:--------------:|:-----------:|:--------------------:|:--------------:|:---------------------------------------------------------------------------------------:|
| setgiveway  | channel              | prize                | image (URL)    | role        | emoji | timer | Set a giveway in the indicate channel, the embed will be send by the bot with the emoji as reaction, an image of the prize and a timer (no dynamic), change the permission overwrites of the role indicate |
| run-giveway | channel              | messageID            |                |             |       |       | Run the giveway using the id of the giveway message and choose the winner from the members who have reacted |

## Liste des commandes disponibles (Everyone)

| Command     | Parameter 1          | Parameter 2          | Parameter 3    | Description                                                                                      |
|:------------|:--------------------:|:--------------------:|:--------------:|:------------------------------------------------------------------------------------------------:|
| ping        |                      |                      |                | Gives bot latency                                                                                |
| help        | command OR null      |                      |                | Display the commands available and a little description                                          |
| rank        | username OR userID   |                      |                | Displays experience and experience needed to progress to the next level                          |
| leaderboard |                      |                      |                | Displays the top 10 in the experience leaderboard on the server                                  |
| ticket      |                      |                      |                | Create a button, while a member click this, a channel will be create                             |

---

## Dependencies

***NodeJS V18.18.0***

### Installation de la librairie discord.js

```bash
npm i discord.js@latest
```

### Gestionner les fichiers

```bash
npm i fs
```

### Rest de discord.js

```bash
npm i @discordjs/rest
```

### Converti les minutes en millisecondes

```bash
npm i ms
```

### Database mysql

```bash
npm i mysql
```

### Canvas-Easy

```bash
npm i discord-canvas-easy@latest
```

### Canvas

```bash
npm i canvas
```

### @napi-rs/canvas

```bash
npm i @napi-rs/canvas
```
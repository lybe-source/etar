# Bot discord Tera

***Don't use the `/clear` command in the channel where the messages to be deleted are located.***
***This will return an error in the console and the bot will shutdown.***  
***I advise you to have a channel specifically for bot commands.***

## Sommary
- [Init npm](https://github.com/lybe-source/etar/tree/main#initialiser-npm)
- [Version](https://github.com/lybe-source/etar/tree/main#conna%C3%AEtre-la-version-de-la-librairie-discordjs)
- [Run Bot](https://github.com/lybe-source/etar/tree/main#d%C3%A9marrer-le-code)
- [Commands available](https://github.com/lybe-source/etar/tree/main#liste-des-commandes-disponibles)
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

## Liste des commandes disponibles

| Command  | Parameter 1          | Parameter 2          | Parameter 3    | Description                                                                                      |
|:---------|:--------------------:|:--------------------:|:--------------:|:-------------------------------------------------------------------------------------------------|
| ping     |                      |                      |                | Gives bot latency                                                                                |
| kick     | username OR userID   | reason OR null       |                | Kick out a member                                                                                |
| ban      | username OR userID   | reason OR null       |                | Same as kick but prevents it from coming back with an invitation link                            |
| unban    | username OR userID   | reason OR null       |                | Removes the ban if the user is banned from the server                                            |
| mute     | username OR userID   | duration(days OR hours OR seconds) | reason OR null | Prevents the member from writing, reacting or joining a voice channel for up to 28 days. Time unit : Days = d, hours = h, seconds = s |
| unmute   | username OR userID   | reason OR null       |                | Allows the muted user to speak again, react and join voice channels                              |
| clear    | channel OR channelID | number : 1 => 100    |                | Deletes number messages in the channel defined in the command as long as they aren't 14 days old |
| help     | command OR null      |                      |                | Display the commands available and a little description                                          |
| warn     | username OR userID   | reason               |                | Give a warning to a member and record it in the database                                         |
| warnlist | username OR userID   |                      |                | Display the warnings for the member defined in the command                                       |

### Ping
Donne la latence du bot

### Kick
Exclu le membre si les permissions sont valides et si le membre à exclure se trouve bien sur le serveur

### Ban
Ban le membre si les permissions sont valides (Même un membre qui ne se trouve pas sur le serveur)

### Unban
Déban le membre si les permission sont valides

### Mute
Empêche le membre d'écrire des messages, de réagir aux messages, de rejoindre un salon vocal pendant une durée maximale de 28 jours (28d)
Par contre il voit toujours le serveur et les messages postés

### Unmute
Unmute un membre qui a été mute

### Clear
Supprime le nombre de messages spécifié dans la commande dans le channel spécifié lui aussi dans la commande
Il ne peut pas supprimé les messages datant de plus de 14 jours et il ne supprime pas ces propres messages

### Help
Affiche un embed des commandes disponibles

---

## Dependencies

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
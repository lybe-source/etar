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
- ping
- kick [username||userID] [reason||null]
- ban [username||userID] [reason||null]
- unban [username||userID] [reason||null]
- mute [username||userID] [duration(ms||d)] [reason||null]
- unmute [username||userID] [reason||null]
- clear [channel||channelID] [number: 1 => 100]
- help [command||null]

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
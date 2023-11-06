# Bot discord Tera

## Initialiser npm

```bash
npm init
```

## Installation de la librairie discord.js

```bash
npm i discord.js@latest
```

## Connaître la version de la librairie discord.js

```bash
npm ls discord.js
```

## Démarrer le code

```bash
node main
```

## Gestionner les fichiers

```bash
npm i fs
```

## Rest de discord.js

```bash
npm i @discordjs/rest
```

## converti les minutes en millisecondes

```bash
npm i ms
```


## Liste des commandes disponibles
- ping
- kick [username||userID] [reason||null]
- ban [username||userID] [reason||null]
- mute [username||userID] [duration(ms||d)] [reason||null]
- unmute [username||userID] [reason||null]

### Ping
Donne la latence du bot

### Kick
Exclu le membre si les permissions sont valides et si le membre à exclure se trouve bien sur le serveur

### Ban
Ban le membre si les permissions sont valides (Même un membre qui ne se trouve pas sur le serveur)

### Mute
Empêche le membre d'écrire des messages, de réagir aux messages, de rejoindre un salon vocal pendant une durée maximale de 28 jours (28d)
Par contre il voit toujours le serveur et les messages postés

### Unmute
Unmute un membre qui a été mute

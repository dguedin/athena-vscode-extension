# Athena Query Runner

Extension VSCode/Cursor pour exécuter des requêtes AWS Athena avec gestion de profils.

## Fonctionnalités

- ✅ Gestion de profils AWS (créer, sélectionner, supprimer)
- ✅ Exécution de requêtes SQL sur Athena
- ✅ Affichage des résultats en temps réel
- ✅ Raccourci clavier `Cmd+Shift+A` (Mac) / `Ctrl+Shift+A` (Windows)
- ✅ Interface graphique dans la barre latérale

## Prérequis

- Python 3 installé
- AWS CLI configuré avec vos profils
- Boto3 installé (`pip install boto3`)

## Installation

### Depuis le code source

1. Cloner le dépôt
2. Ouvrir le dossier dans VSCode/Cursor
3. Appuyer sur `F5` pour lancer en mode développement

### Depuis le package

1. Télécharger le fichier `.vsix`
2. Installer via l'interface : `Extensions` > `...` > `Install from VSIX`

Ou en ligne de commande :

```bash
code --install-extension athena-query-runner-1.0.0.vsix
```

## Utilisation

### 1. Créer un profil

- Cliquer sur l'icône Athena (base de données) dans la barre latérale
- Cliquer sur le bouton `+` dans la section "Profiles"
- Remplir les informations :
  - Nom du profil
  - Profil AWS (ex: `profil-name`)
  - Région (ex: `your-region`)
  - Bucket S3 de sortie (ex: `output s3 athena`)
  - Base de données par défaut

### 2. Sélectionner un profil

- Cliquer sur un profil dans la liste
- Le profil actif s'affiche dans la barre de statut en bas

### 3. Exécuter une requête

- Ouvrir un fichier `.sql`
- Sélectionner du texte (optionnel, sinon tout le fichier sera exécuté)
- Appuyer sur `Cmd+Shift+A` (Mac) ou `Ctrl+Shift+A` (Windows)
- Les résultats s'affichent dans le panneau "Athena Results"

### 4. Supprimer un profil

- Cliquer sur l'icône poubelle à droite du profil
- Confirmer la suppression

## Configuration

Les profils sont sauvegardés dans `~/.athena-profiles.json`

## Structure du projet

```
src/
├── extension.js              # Point d'entrée
├── commands/
│   ├── profileCommands.js    # Gestion des profils
│   └── queryCommands.js      # Exécution des requêtes
├── providers/
│   ├── profilesProvider.js   # Provider de la vue profils
│   └── databasesProvider.js  # Provider de la vue databases
└── utils/
    └── config.js             # Gestion de la configuration
```

## Développement

```bash
# Installer les dépendances (si nécessaire)
npm install

# Lancer en mode développement
# Appuyer sur F5 dans VSCode
```

## Générer le package .vsix

Pour créer le fichier d'installation `.vsix` :

```bash
# Installer vsce (si pas déjà installé)
npm install -g @vscode/vsce

# Générer le package
vsce package
```

Le fichier `.vsix` sera créé dans le dossier racine du projet.

## License

MIT

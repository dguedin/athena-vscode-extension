const vscode = require('vscode');
const { ProfilesProvider } = require('./providers/profilesProvider');
const { DatabasesProvider } = require('./providers/databasesProvider');
const { createProfile, deleteProfile, selectProfile } = require('./commands/profileCommands');
const { runQuery } = require('./commands/queryCommands');
const { loadProfiles } = require('./utils/config');

let currentProfile = null;
let statusBar = null;

function activate(context) {
    loadProfiles();
    
    const profilesProvider = new ProfilesProvider();
    const databasesProvider = new DatabasesProvider(() => currentProfile);
    
    vscode.window.registerTreeDataProvider('athenaProfiles', profilesProvider);
    vscode.window.registerTreeDataProvider('athenaDatabases', databasesProvider);
    
    context.subscriptions.push(
        vscode.commands.registerCommand('athena.createProfile', () => 
            createProfile(profilesProvider)
        ),
        vscode.commands.registerCommand('athena.deleteProfile', (item) => 
            deleteProfile(item, profilesProvider, () => currentProfile, (profile) => {
                currentProfile = profile;
                updateStatusBar();
            })
        ),
        vscode.commands.registerCommand('athena.selectProfile', (profile) => 
            selectProfile(profile, databasesProvider, (p) => {
                currentProfile = p;
                updateStatusBar();
            })
        ),
        vscode.commands.registerCommand('athena.runQuery', () => 
            runQuery(() => currentProfile)
        )
    );
    
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBar.command = 'athena.createProfile';
    updateStatusBar();
    statusBar.show();
    context.subscriptions.push(statusBar);
}

function updateStatusBar() {
    if (statusBar) {
        statusBar.text = currentProfile 
            ? `$(database) ${currentProfile.name}` 
            : '$(database) No Profile';
    }
}

function deactivate() {}

module.exports = { activate, deactivate };

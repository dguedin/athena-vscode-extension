const vscode = require('vscode');
const { getProfiles, saveProfiles } = require('../utils/config');

async function createProfile(provider) {
    const name = await vscode.window.showInputBox({ 
        prompt: 'Profile name',
        placeHolder: 'my-profile'
    });
    if (!name) return;
    
    const awsProfile = await vscode.window.showInputBox({ 
        prompt: 'AWS Profile name',
        value: 'signature-data-dev'
    });
    if (!awsProfile) return;
    
    const region = await vscode.window.showInputBox({ 
        prompt: 'AWS Region',
        value: 'eu-west-1'
    });
    if (!region) return;
    
    const outputLocation = await vscode.window.showInputBox({ 
        prompt: 'S3 Output Location',
        value: 's3://puydufou-athena-output-dev/'
    });
    if (!outputLocation) return;
    
    const database = await vscode.window.showInputBox({ 
        prompt: 'Default Database',
        value: 'dev_standard_fr_cantoriel'
    });
    if (!database) return;
    
    const profiles = getProfiles();
    profiles[name] = { name, awsProfile, region, outputLocation, database };
    saveProfiles(profiles);
    provider.refresh();
    vscode.window.showInformationMessage(`Profile "${name}" created`);
}

async function deleteProfile(item, provider, getCurrentProfile, setCurrentProfile) {
    const profileName = item.label;
    const confirm = await vscode.window.showWarningMessage(
        `Delete profile "${profileName}"?`,
        { modal: true },
        'Delete'
    );
    
    if (confirm !== 'Delete') return;
    
    const profiles = getProfiles();
    delete profiles[profileName];
    
    const currentProfile = getCurrentProfile();
    if (currentProfile?.name === profileName) {
        setCurrentProfile(null);
    }
    
    saveProfiles(profiles);
    provider.refresh();
    vscode.window.showInformationMessage(`Profile "${profileName}" deleted`);
}

function selectProfile(profile, databasesProvider, setCurrentProfile) {
    setCurrentProfile(profile);
    databasesProvider.refresh();
    vscode.window.showInformationMessage(`Selected profile: ${profile.name}`);
}

module.exports = { createProfile, deleteProfile, selectProfile };

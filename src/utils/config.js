const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_FILE = path.join(os.homedir(), '.athena-profiles.json');
let profiles = {};

function loadProfiles() {
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            profiles = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        } catch (error) {
            console.error('Error loading profiles:', error);
            profiles = {};
        }
    }
}

function saveProfiles(newProfiles) {
    profiles = newProfiles;
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(profiles, null, 2));
    } catch (error) {
        console.error('Error saving profiles:', error);
    }
}

function getProfiles() {
    return profiles;
}

module.exports = { loadProfiles, saveProfiles, getProfiles };

const vscode = require('vscode');
const { getProfiles } = require('../utils/config');

class ProfilesProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element) {
        return element;
    }
    
    getChildren() {
        const profiles = getProfiles();
        return Object.values(profiles).map(profile => {
            const item = new vscode.TreeItem(profile.name, vscode.TreeItemCollapsibleState.None);
            item.command = { 
                command: 'athena.selectProfile', 
                title: 'Select', 
                arguments: [profile] 
            };
            item.iconPath = new vscode.ThemeIcon('database');
            item.description = profile.database;
            item.contextValue = 'profile';
            return item;
        });
    }
}

module.exports = { ProfilesProvider };

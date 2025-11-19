const vscode = require('vscode');

class DatabasesProvider {
    constructor(getCurrentProfile) {
        this.getCurrentProfile = getCurrentProfile;
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
        const currentProfile = this.getCurrentProfile();
        if (!currentProfile) return [];
        
        const databases = [
            'dev_standard_fr_cantoriel',
            'dev_standard_fr_experticket_fr',
            'dev_standard_fr_magento',
            'dev_standard_fr_gts'
        ];
        
        return databases.map(db => {
            const item = new vscode.TreeItem(db, vscode.TreeItemCollapsibleState.None);
            item.iconPath = new vscode.ThemeIcon('symbol-database');
            return item;
        });
    }
}

module.exports = { DatabasesProvider };

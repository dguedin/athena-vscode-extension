const vscode = require('vscode');
const { exec } = require('child_process');

function runQuery(getCurrentProfile) {
    const currentProfile = getCurrentProfile();
    
    if (!currentProfile) {
        vscode.window.showErrorMessage('No profile selected. Please select a profile first.');
        return;
    }
    
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    
    const query = editor.selection.isEmpty 
        ? editor.document.getText() 
        : editor.document.getText(editor.selection);
    
    if (!query.trim()) {
        vscode.window.showErrorMessage('No query to execute');
        return;
    }
    
    const outputChannel = vscode.window.createOutputChannel('Athena Results');
    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine('Executing query...\n');
    
    const pythonScript = buildPythonScript(currentProfile, query);
    
    exec(`python3 -c "${pythonScript}"`, (error, stdout, stderr) => {
        if (error) {
            outputChannel.appendLine(`Error: ${stderr || error.message}`);
        } else {
            outputChannel.appendLine(stdout);
        }
    });
}

function buildPythonScript(profile, query) {
    const escapedQuery = query.replace(/'/g, "\\'").replace(/\n/g, ' ');
    
    return `
import boto3, time
session = boto3.Session(profile_name='${profile.awsProfile}')
client = session.client('athena', region_name='${profile.region}')
resp = client.start_query_execution(
    QueryString='''${escapedQuery}''',
    QueryExecutionContext={'Database': '${profile.database}'},
    ResultConfiguration={'OutputLocation': '${profile.outputLocation}'}
)
qid = resp['QueryExecutionId']
print(f'Query ID: {qid}')
while True:
    status = client.get_query_execution(QueryExecutionId=qid)
    state = status['QueryExecution']['Status']['State']
    if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']: break
    time.sleep(0.5)
if state == 'SUCCEEDED':
    results = client.get_query_results(QueryExecutionId=qid, MaxResults=100)
    print('\\nResults:')
    for row in results['ResultSet']['Rows']:
        print('\\t'.join([col.get('VarCharValue', '') for col in row['Data']]))
else:
    reason = status['QueryExecution']['Status'].get('StateChangeReason', 'Unknown')
    print(f'Query failed: {reason}')
`.replace(/"/g, '\\"');
}

module.exports = { runQuery };

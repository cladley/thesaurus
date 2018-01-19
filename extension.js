const vscode = require('vscode');
const Thesaurus = require('./thesaurus');

function activate(context) {
  const thesaurus = new Thesaurus(vscode);
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.thesaurus', function () {
    if (thesaurus.hasTextSelected()) {
      thesaurus.getResults();
    }
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;

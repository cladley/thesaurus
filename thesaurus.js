const vscode = require('vscode');
const getWordsFor = require('./thesaurus-fetcher');

class Thesaurus {

  hasTextSelected() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;

    this.currentSelectedText = editor.document.getText(editor.selection);
    return this.currentSelectedText.length > 0 ? true : false;
  }

  getResults() {
    let editor = vscode.window.activeTextEditor;
    const {start, end} = editor.selection;
    const startPos = new vscode.Position(start.line, start.character);
    const endPos = new vscode.Position(end.line, end.character);

    getWordsFor(this.currentSelectedText)
        .then(results => {
          const words = results;
          console.log(words);

          if (words.length > 0) {
            vscode.window.showQuickPick(words)
              .then(word => {
                if (word) {
                  const edit = this.createEdit(editor.document, editor.selection, word);
                  vscode.workspace.applyEdit(edit);
                }
              });
          }
        })
        .catch(error => {

        });
  }

  createEdit(document, selection, word) {
    return this.setEditFactory(document.uri, selection, word)
  }

  createTextEdit(coords, content) {
    const start = new vscode.Position(coords.start.line, coords.start.character);
    const end = new vscode.Position(coords.end.line, coords.end.character);
    const range = new vscode.Range(start, end);
    return new vscode.TextEdit(range, content);
  }

  setEditFactory(uri, coords, content) {
    const workspaceEdit = new vscode.WorkspaceEdit();
    var edit = this.createTextEdit(coords, content);

    workspaceEdit.set(uri, [edit]);
    return workspaceEdit;
  }

  dispose() {
  }
}

module.exports = Thesaurus;

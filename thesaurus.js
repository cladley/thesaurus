const getWordsFor = require('./thesaurus-fetcher');

class Thesaurus {
  constructor(vsCode) {
    this.vsCode = vsCode;
  }

  hasTextSelected() {
    let editor = this.vsCode.window.activeTextEditor;
    if (!editor) return;

    this.currentSelectedText = editor.document.getText(editor.selection);
    return this.currentSelectedText.length > 0 ? true : false;
  }

  getResults() {
    let editor = this.vsCode.window.activeTextEditor;
    const {start, end} = editor.selection;
    const startPos = new this.vsCode.Position(start.line, start.character);
    const endPos = new this.vsCode.Position(end.line, end.character);

    getWordsFor(this.currentSelectedText)
        .then(results => {
          const words = results;
          console.log(words);

          if (words.length > 0) {
            this.vsCode.window.showQuickPick(words)
              .then(word => {
                if (word) {
                  const edit = this.createEdit(editor.document, editor.selection, word);
                  this.vsCode.workspace.applyEdit(edit);
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
    const start = new this.vsCode.Position(coords.start.line, coords.start.character);
    const end = new this.vsCode.Position(coords.end.line, coords.end.character);
    const range = new this.vsCode.Range(start, end);
    return new this.vsCode.TextEdit(range, content);
  }

  setEditFactory(uri, coords, content) {
    const workspaceEdit = new this.vsCode.WorkspaceEdit();
    var edit = this.createTextEdit(coords, content);

    workspaceEdit.set(uri, [edit]);
    return workspaceEdit;
  }

  dispose() {
  }
}

module.exports = Thesaurus;

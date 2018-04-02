// https://discuss.atom.io/t/find-specific-scopes-in-a-file/12428/2
const {CompositeDisposable, Point} = require('atom');

module.exports = {
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor',
      {'latex-log:next-error': () => this.nextError()})
    );
  },

  deactivate () {
    this.subscriptions.dispose();
  },

  nextError () {
    editor = atom.workspace.getActiveTextEditor();
    buffer = editor.getBuffer();
    languageMode = buffer.getLanguageMode();

    startRow = editor.getCursorBufferPosition().row + 1;
    lastRow = buffer.getLastRow();
    target = 'invalid.deprecated';

    let result = 0;
    rowIter:
    for (let row = startRow; row <= lastRow; row++) {
      tokens = languageMode.tokenizedLineForRow(row).tokens;
      for (let t = 0, len = tokens.length; t < len; t++) {
        if (tokens[t].scopes.includes(target)) {
           result = new Point(row, 0);
           break rowIter;
        }
      }
    }
    console.log(result);
    editor.setCursorBufferPosition(result);
  },
}

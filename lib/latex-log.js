const {CompositeDisposable, Point} = require('atom');
const Selector = require('first-mate').ScopeSelector;

module.exports = {
  // The scope(s) used by language-latex to mark errors in the log
  // (see grammars/latex-log.cson in the source)
  target: 'invalid.*',

  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'latex-log:next-error': () => this.moveCursorToError(1),
      'latex-log:prev-error': () => this.moveCursorToError(-1),
      })
    );
    this.selector = new Selector(this.target);
  },

  deactivate () {
    this.subscriptions.dispose();
  },

  moveCursorToError (direction) {
    editor = atom.workspace.getActiveTextEditor();
    buffer = editor.getBuffer();
    languageMode = buffer.getLanguageMode();

    // Rows to iterate over
    startRow = editor.getCursorBufferPosition().row + direction;
    lastRow = (direction) > 0 ? buffer.getLastRow() : 0;

    // Row to move to
    result = -1;

    rowIter:  // Iterate over rows
    for (let row = startRow; Math.abs(lastRow - row) > 0; row += direction) {
      // Iterate over tokens in the row
      tokens = languageMode.tokenizedLineForRow(row).tokens;
      for (let t = 0, len = tokens.length; t < len; t++) {
        if (this.selector.matches(tokens[t].scopes)) {
           result = row;
           break rowIter;
        }
      }
    }

    if (result > -1) editor.setCursorBufferPosition(new Point(result, 0));
  },
}

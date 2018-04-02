// https://discuss.atom.io/t/find-specific-scopes-in-a-file/12428/2
const {CompositeDisposable} = require('atom')
const {Selector} = require('selector-kit')


module.exports = {
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-text-editor',
      {'latex-log:next-error': () => this.nextError()})
    )
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  nextError () {
    editor = atom.workspace.getActiveTextEditor()
    editor.insertText('foo')

    position = editor.getCursorBufferPosition()
    editor.setCursorBufferPosition(new Point(position.row + 1, 0))

    selector = new Selector('invalid.deprecated')

    // tokens = tokensForSelector(editor.displayBuffer.tokenizedBuffer, selector)
    console.log('bar')
  },

  // tokensForSelector (tokenizedBuffer, selector) {
  //   matchingTokens = []
  //   for {tokens} in tokenizedBuffer.tokenizedLines
  //     for token in tokens
  //       matchingTokens.push token if selector.matches(token.scopes)
  //   return matchingTokens
  // },
}

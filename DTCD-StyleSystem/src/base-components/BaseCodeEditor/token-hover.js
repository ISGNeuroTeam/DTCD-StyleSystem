import docs from './docs';

// eslint-disable-next-line func-names
(function () {
  const { CodeMirror } = window;

  CodeMirror.registerHelper('textHover', 'otl', (cm, data, node) => {
    console.log('registerHelper callback');
    let html = '';

    if (node && data) {
      const { token } = data;
      if (token.string) {
        if (token.string[0] === '|') {
          html = docs.entityFunctions[token.string.split(' ')[1]];
        }
      }
      if (html) {
        const result = document.createElement('div');
        result.innerHTML = html;
        return result;
      }
    }
    return null;
  });
}());

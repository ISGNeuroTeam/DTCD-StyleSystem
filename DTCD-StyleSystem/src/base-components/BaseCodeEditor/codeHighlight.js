// Example https://codemirror.net/demo/simplemode.html
/* eslint-disable */
/**
 * Export from
 * CodeMirror.defineSimpleMode('otl', { ... });
 *
 var editor = CodeMirror(code, {
    ...
    theme: 'eva',
    mode: "otl",
    ...
 });
 */

// eslint-disable-next-line func-names
(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object') // CommonJS
  // eslint-disable-next-line brace-style,global-require
  { mod(require('codemirror/lib/codemirror'), require('codemirror/addon/mode/simple')); }
  // eslint-disable-next-line no-undef
  else { mod(CodeMirror); }
}((CodeMirror) => {

  window.CodeMirror = CodeMirror;

  CodeMirror.defineSimpleMode('otl', {
    start: [
      {
        token: 'string.quoted.double',
        regex: /"/,
        next: 'string',
      },
      {
        token: 'string.quoted.single',
        regex: /(')/,
        next: 'qstring',
      },
      {
        token: 'constant.numeric',
        regex: /[+-]?\d+\b/,
      },
      {
        token: 'keyword.operator',
        regex: /[-+%=<>*]|![><=]/,
      },
      {
        token: 'lparen',
        regex: /[{([]/,
      },
      {
        token: 'rparen',
        regex: /[)\]}]/,
      },
      {
        token: 'variable.token',
        regex: /\|?\s?\$/,
        next: 'token',
      },
      {
        token: 'entity.name.function',
        regex: /\|\s\w+/,
      },
      {
        token: 'support.parameter',
        regex: /\w+\s?=/,
      },
      {
        token: 'keyword',
        regex: /\b(?:or|and|by|as)\b/,
      },
      {
        token: 'support.function',
        regex: /\b(?:count|sum|round|int|rand|max|p50|avg|dc|case|values|locate|ctime|sin|sqrt|min)\b/,
      },
      {
        regex: /[{[(]/,
        indent: true,
      },
      {
        regex: /[}\])]/,
        dedent: true,
      },
    ],

    qstring: [
      {
        regex: /'/,
        token: 'string',
        next: 'start',
      },
      {
        regex: /[^']+/,
        token: 'string',
      },
    ],
    string: [
      {
        regex: /"/,
        token: 'string',
        next: 'start',
      },
      {
        regex: /[^"]+/,
        token: 'string.big',
      },
    ],
    token: [
      {
        regex: /\$/,
        token: 'variable.token',
        next: 'start',
      },
      {
        regex: /[^$]+/,
        token: 'variable.token',
      },
    ],
    meta: {
      fold: 'indent',
    },
  });

  CodeMirror.defineMIME('text/x-otl', 'otl');
}));

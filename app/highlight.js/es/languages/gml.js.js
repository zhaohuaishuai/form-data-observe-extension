function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/gml" instead of "highlight.js/lib/languages/gml.js"'
      );
    }
  }
  emitWarning();
    import lang from './gml.js';
    export default lang;
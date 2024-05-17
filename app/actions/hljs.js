import hljs from '../highlight.js/lib/core';
import javascript from '../highlight.js/lib/languages/javascript';
import tp from '../highlight.js/lib/languages/tp.js';
import '../highlight.js/styles/a11y-dark.css';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('tp',tp)

export default hljs;
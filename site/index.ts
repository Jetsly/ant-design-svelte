import './theme/static/index.less';
import 'highlight.js/styles/solarized-light.css';
import App from './App.svelte';

new App({
  target: document.body,
  hydrate: true,
});

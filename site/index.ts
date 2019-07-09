import './theme/static/index.less';
import 'highlight.js/styles/solarized-light.css';
import App from './App';

const app = new App({
  target: document.getElementById('app'),
  hydrate: true,
  props: {
    url: location.pathname,
  },
});

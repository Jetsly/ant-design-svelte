import * as IconExit from './icon.svelte';
import { default as Icon } from './icon.svelte';
Object.keys(IconExit).forEach(key => {
  if (key !== 'default') {
    Icon[key] = IconExit[key];
  }
});
export default Icon;

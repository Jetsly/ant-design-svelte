import * as IconExit from './icon.svelte';
import { default as Icon } from './icon.svelte';
Object.keys(IconExit).forEach(key => {
  if (key !== 'defalut') {
    Icon[key] = IconExit[key];
  }
});
export default Icon;

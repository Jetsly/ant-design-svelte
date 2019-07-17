import { writable } from 'svelte/store';

export const store = writable({
  selectedKeys: [],
  mode: 'vertical',
});

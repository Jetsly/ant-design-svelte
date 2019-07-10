import warning from 'warning';

const warned: Record<string, boolean> = {};
export default (valid: boolean, component: string, message: string): void => {
  if (!valid && !warned[message]) {
    warning(false, `[antd-design-svelte: ${component}] ${message}`);
    warned[message] = true;
  }
};

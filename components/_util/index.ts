import classes, { formatStyle } from './classes';
import ResponsiveObserve from './responsiveObserve';


/** 延迟 - 毫秒 */
export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  classes,
  formatStyle,
  ResponsiveObserve,
};

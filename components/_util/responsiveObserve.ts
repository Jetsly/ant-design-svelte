export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type BreakpointMap = Record<Breakpoint, string>;
export type ScreenMap = Partial<Record<Breakpoint, boolean>>;
export type ScreenSizeMap = Partial<Record<Breakpoint, number>>;

export const responsiveArray: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

export const responsiveMap: BreakpointMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};

type SubscribeFunc = (screens: ScreenMap) => void;
const keys = <T>(obj: T): (keyof T)[] => Object.keys(obj) as unknown as (keyof T)[]
const subscribers = new Map<Number, SubscribeFunc>();
let subUid = -1;
let screens = {};

const responsiveObserve = {
  matchHandlers: {} as {
    [prop: string]: {
      mql: MediaQueryList;
      listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
    };
  },
  dispatch(pointMap: ScreenMap) {
    screens = pointMap;
    subscribers.forEach(func => func(screens));
    return subscribers.size >= 1;
  },
  subscribe(func: SubscribeFunc): number {
    if (!subscribers.size) responsiveObserve.register();
    subUid += 1;
    subscribers.set(subUid, func);
    func(screens);
    return subUid;
  },
  unsubscribe(token: number) {
    subscribers.delete(token);
    if (!subscribers.size) responsiveObserve.unregister();
  },
  unregister() {
    keys(responsiveMap).forEach((screen: Breakpoint) => {
      const matchMediaQuery = responsiveMap[screen];
      const handler = responsiveObserve.matchHandlers[matchMediaQuery];
      handler.mql.removeEventListener('change', handler.listener);
    });
    subscribers.clear();
  },
  register() {
    keys(responsiveMap).forEach((screen: Breakpoint) => {
      const matchMediaQuery = responsiveMap[screen];
      const listener = ({ matches }: MediaQueryListEvent | MediaQueryList) => {
        responsiveObserve.dispatch({
          ...screens,
          [screen]: matches,
        });
      };
      const mql = window.matchMedia(matchMediaQuery);
      mql.addEventListener('change', listener);
      responsiveObserve.matchHandlers[matchMediaQuery] = {
        mql,
        listener,
      };
      listener(mql);
    });
  },
};

export default responsiveObserve;

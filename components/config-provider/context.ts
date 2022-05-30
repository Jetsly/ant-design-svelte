import { getContext } from "svelte";

const key = Symbol();

export interface CSPConfig {
  nonce?: string;
}

export type DirectionType = 'ltr' | 'rtl' | undefined;
export type RequiredMark = boolean | 'optional';
export type SizeType = 'small' | 'middle' | 'large' | undefined;


export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  iconPrefixCls?: string;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  // renderEmpty: RenderEmptyHandler;
  // csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  input?: {
    autoComplete?: string;
  };
  // locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  direction?: DirectionType;
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean;
  form?: {
    requiredMark?: RequiredMark;
    colon?: boolean;
  };
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

const getConfigContext = () => {
  const { getPrefixCls, ...restContext } = getContext<ConfigConsumerProps>(key) || {};
  return {
    ...restContext,
    getPrefixCls: getPrefixCls || defaultGetPrefixCls
  }
}

export default getConfigContext

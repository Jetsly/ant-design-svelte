import { alignElement } from 'dom-align';
import Tooltip, { type TooltipPlacement } from './tooltip.svelte';
import { delay } from '../_util';
import { formatStyle } from '../_util/classes';
import getPlacements from '../_util/placements';

export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

export type Parameters = ConstructorParameters<typeof Tooltip>[0]['props'] & {
  trigger: TooltipTrigger,
  defaultVisible: boolean;
  getPopupContainer: (triggerNode: HTMLElement) => HTMLElement,
  mouseEnterDelay: number;
  mouseLeaveDelay: number;
  destroyTooltipOnHide: boolean;
  arrowPointAtCenter: boolean;
  autoAdjustOverflow: boolean;
};

function getOpst(parameters: Parameters): Parameters {
  return {
    trigger: 'hover',
    placement: 'top',
    defaultVisible: false,
    getPopupContainer: () => document.body,
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    destroyTooltipOnHide: false,
    arrowPointAtCenter: false,
    autoAdjustOverflow: false,
    ...parameters,
  };
}


function getComptOpts(parameters: Parameters): ConstructorParameters<typeof Tooltip>[0]['props'] {
  const {
    getPopupContainer, mouseEnterDelay, placement, defaultVisible,
    mouseLeaveDelay, destroyTooltipOnHide,
    overlayStyle,
    ...props
  } = parameters;
  return props
}

function getPos(source: HTMLElement, domNode: HTMLElement, parameters: Parameters): Record<string, string | number> {
  const { arrowPointAtCenter, autoAdjustOverflow, placement } = parameters;
  const rect = domNode.getBoundingClientRect();
  const placements = getPlacements({
    arrowPointAtCenter,
    autoAdjustOverflow,
  });
  console.log(alignElement(source, domNode, placements[placement]));
}



export default function tooltip(node: HTMLElement, parameters: Parameters) {
  let opts = getOpst(parameters);
  let tooltip: Tooltip = null;
  let target: HTMLElement = null;
  const overHander = async () => {
    const {
      getPopupContainer, mouseEnterDelay, placement, defaultVisible,
      mouseLeaveDelay, destroyTooltipOnHide,
      ...props } = opts;
    if (typeof props.title === 'undefined') return;
    if (tooltip === null) {
      target = document.createElement('div');
      target.style.position = 'absolute';
      target.style.top = '0';
      target.style.left = '0';
      target.style.width = '100%';
      getPopupContainer(node).appendChild(target);
      tooltip = new Tooltip({
        hydrate: true,
        target,
        props: getComptOpts(opts)
      });
      console.log(tooltip);
    }
    await delay(mouseEnterDelay * 1000);
    getPos(target.firstChild!, node, opts);
    tooltip.$set({
      ...getComptOpts(opts),
      visible: true,
    });
  };
  const destroyTooltip = () => {
    if (tooltip && opts) {
      tooltip.$destroy();
      opts.getPopupContainer(node).removeChild(target);
      tooltip = null;
    }
  }
  const leaveHander = async () => {
    const { mouseLeaveDelay, destroyTooltipOnHide } = opts;
    if (tooltip !== null) {
      await delay(mouseLeaveDelay * 1000);
      tooltip.$set({ visible: false });
      destroyTooltipOnHide && destroyTooltip()
    }
  };
  node.addEventListener('mouseover', overHander);
  node.addEventListener('mouseleave', leaveHander);
  opts.defaultVisible && overHander()
  return {
    update: (parameters: Parameters) => {
      opts = getOpst(parameters);
      if (tooltip) {
        tooltip.$set(getComptOpts(opts),)
      }
    },
    destroy: () => {
      node.removeEventListener('mouseover', overHander);
      node.removeEventListener('mouseleave', leaveHander);
      destroyTooltip()
    }
  };
}

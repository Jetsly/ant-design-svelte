import Tooltip from './tooltip.svelte';

type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';
type TooltipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';
type Parameters = Partial<{
  placement: TooltipPlacement;
  trigger: TooltipTrigger;
  title: string;
}>;

function getOpst(parameters: Parameters): Parameters {
  return {
    placement: 'top',
    trigger: 'hover',
    ...parameters,
  };
}
  
function getPos(target: HTMLElement, placement: TooltipPlacement) {
  const rect = target.getBoundingClientRect();
  let pos = {
    left: 0,
    top: 0,
    transform: undefined,
  };

  if (placement.indexOf('top') > -1) {
    pos = {
      left: rect.left + rect.width / 2,
      top: rect.top,
      transform: `translate(-50%, -100%)`,
    };
    if (placement.indexOf('Left') > -1) {
      pos = {
        ...pos,
        transform: `translate(0, -100%)`,
      };
    }
    if (placement.indexOf('Right') > -1) {
      pos = {
        ...pos,
        transform: `translate(-100%, -100%)`,
      };
    }
  } else if (placement.indexOf('left') > -1) {
    pos = {
      left: rect.left,
      top: rect.top + rect.height / 2,
      transform: `translate(-100%, -50%)`,
    };
  } else if (placement.indexOf('right') > -1) {
    pos = {
      left: rect.left + rect.width,
      top: rect.top + rect.height / 2,
      transform: `translate(0, -50%)`,
    };
  } else if (placement.indexOf('bottom') > -1) {
    pos = {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height,
      transform: `translate(-50%, 0)`,
    };
    if (placement.indexOf('Left') > -1) {
      pos = {
        ...pos,
        transform: ``,
      };
    }
    if (placement.indexOf('Right') > -1) {
      pos = {
        ...pos,
        transform: `translate(-100%, 0)`,
      };
    }
  }
  if (placement.indexOf('Left') > -1) {
    pos = {
      ...pos,
      left: rect.left,
    };
  } else if (placement.indexOf('Right') > -1) {
    pos = {
      ...pos,
      left: rect.left + rect.width,
    };
  }

  //   if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
  //     transformOrigin.top = `${rect.height - align.offset[1]}px`;
  //   } else if (
  //     placement.indexOf('Top') >= 0 ||
  //     placement.indexOf('bottom') >= 0
  //   ) {
  //     transformOrigin.top = `${-align.offset[1]}px`;
  //   }
  //   if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
  //     transformOrigin.left = `${rect.width - align.offset[0]}px`;
  //   } else if (
  //     placement.indexOf('right') >= 0 ||
  //     placement.indexOf('Left') >= 0
  //   ) {
  //     transformOrigin.left = `${-align.offset[0]}px`;
  //   }
  return pos;
}

export default function tooltip(node: HTMLElement, parameters: Parameters) {
  let opts = getOpst(parameters);
  let tooltip: Tooltip = null;
  const overHander = () => {
    if (typeof opts.title === 'undefined') return;
    if (tooltip === null) {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style['pointer-events'] = 'none';
      document.body.appendChild(container);
      tooltip = new Tooltip({
        hydrate: true,
        target: container,
        props: opts,
      });
    }
    tooltip.$set({
      visible: true,
      style: getPos(node, opts.placement),
    });
  };
  const leaveHander = () => {
    tooltip.$set({ visible: false });
  };
  node.addEventListener('mouseover', overHander);
  node.addEventListener('mouseleave', leaveHander);
  return {
    update: (parameters: Parameters) => {
      opts = getOpst(parameters);
    },
    destroy: () => {
      node.removeEventListener('mouseover', overHander);
      node.removeEventListener('mouseleave', leaveHander);
    },
  };
}

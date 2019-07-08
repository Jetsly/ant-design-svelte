const attributeName = 'ant-click-animating-without-extra-node';
let styleForPesudo;

function isNotGrey(color) {
  const match = (color || '').match(/rgba?\((\d*), (\d*), (\d*)(, [\.\d]*)?\)/);
  if (match && match[1] && match[2] && match[3]) {
    return !(match[1] === match[2] && match[2] === match[3]);
  }
  return true;
}

function clickHandle(node: HTMLElement, waveColor: string) {
  styleForPesudo = styleForPesudo || document.createElement('style');
  node.setAttribute(attributeName, 'true');
  if (
    waveColor &&
    waveColor !== '#ffffff' &&
    waveColor !== 'rgb(255, 255, 255)' &&
    isNotGrey(waveColor) &&
    !/rgba\(\d*, \d*, \d*, 0\)/.test(waveColor) && // any transparent rgba color
    waveColor !== 'transparent'
  ) {
    styleForPesudo.innerHTML = `[ant-click-animating-without-extra-node]:after { --antd-wave-shadow-color:${waveColor};  }`;
    if (!document.body.contains(styleForPesudo)) {
      document.body.appendChild(styleForPesudo);
    }
  }
}

function resetEffect(node: HTMLElement) {
  node.removeAttribute(attributeName);
}
function isHidden(element: HTMLElement) {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return !element || element.offsetParent === null;
}

export default function(node: HTMLElement) {
  let clickWaveTimeoutId = null;
  const onClick = () => {
    if (node.tagName === 'INPUT' || isHidden(node)) {
      return;
    }
    resetEffect(node);

    const waveColor =
      getComputedStyle(node).getPropertyValue('border-top-color') || // Firefox Compatible
      getComputedStyle(node).getPropertyValue('border-color') ||
      getComputedStyle(node).getPropertyValue('background-color');
    clickWaveTimeoutId = window.setTimeout(
      () => clickHandle(node, waveColor),
      0,
    );
  };
  node.addEventListener('click', onClick, true);
  return () => {
    node.removeEventListener('click', onClick, true);
    clearTimeout(clickWaveTimeoutId);
  };
}

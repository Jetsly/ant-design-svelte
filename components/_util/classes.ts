export default function(...obj: Array<{ [key: string]: any } | string>) {
  return obj
    .map(item =>
      typeof item == 'object'
        ? Object.keys(item)
            .filter(key => item[key])
            .join(' ')
        : item,
    )
    .filter(Boolean)
    .join(' ');
}

export function formatStyle(obj: { [key: string]: any } | string = {}) {
  if (typeof obj === 'string') return obj;
  return Object.keys(obj).reduce((style, key) => {
    const value = obj[key];
    if (value === null || value === undefined) {
      return style;
    }
    return style.concat(
      `${key.replace(/([A-Z])/, a => `-${a.toLowerCase()}`)}:${value}`,
    );
  }, []).join(';');
}

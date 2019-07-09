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

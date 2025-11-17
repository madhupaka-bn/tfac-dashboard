export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay = 300
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

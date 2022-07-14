// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(object: any) {
  return Object.prototype.toString.call(object) === '[object Promise]';
}

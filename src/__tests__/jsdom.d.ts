// We're avoiding @types/jsdom because they require DOM lib, which in turn
// conflicts with node types.
declare module 'jsdom' {
  type JSDOMStatic = any;
  export const JSDOM: JSDOMStatic;
}

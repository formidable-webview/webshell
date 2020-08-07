declare module 'espree' {
  const EspreeStatic: {
    parse: (script: string, options: Object) => Object;
  };
  export = EspreeStatic;
}

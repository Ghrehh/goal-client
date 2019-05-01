export default (...args: Array<string | void>): string =>
  args.filter(argument => argument !== undefined).join(' ');

export function enableSSR(varName) {
  return (target, name, descriptor) => {
    if (typeof varName === 'undefined' || varName === '') {
      return descriptor;
    }
    const originMethod = descriptor.value;
    descriptor.value = function(...args) {
      if (varName in window && window[varName].ssr === true) {
        return new Promise((resolve,reject) => {
          resolve(window[varName]);
          delete window[varName];
        });
      } else {
        return originMethod(args);
      } // whether varName exists
    } // override descriptor value
  } // main decorator
} // function wrapper
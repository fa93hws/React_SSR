import { EAjaxStatus } from './enums';

export function enableSSR(varName) {
  return (target, name, descriptor) => {
    if (typeof varName === 'undefined' || varName === '') {
      return descriptor;
    }
    const originMethod = descriptor.value;
    descriptor.value = function(...args) {
      if (varName in window && window[varName].ssr === true) {
        return new Promise((resolve,reject) => {
          const data = window[varName];
          delete window[varName];
          document.getElementById("ssr-placeholder").innerHTML = "";
          resolve(data);
        });
      } else {
        return originMethod(...args);
      } // whether varName exists
    } // override descriptor value
  } // main decorator
} // function wrapper

export function injectSSRState(varName) {
  return (target) => {
    class Output extends target {
      constructor(props) {
        super(props);
        if (typeof props.staticContext !== 'undefined' && props.staticContext.ssr === true) {
          this.state = {
            ...this.state,
            ...props.staticContext.data,
            pageAjaxStatus: EAjaxStatus.done
          } // setState
        } // if calling comes from the server side
        else if (typeof window !== 'undefined' && varName in window && window[varName].ssr === true) {
          const data = window[varName];
          this.setState({
            ...this.state,
            ...data,
            pageAjaxStatus: EAjaxStatus.done
          })
        } // front end rendering, but there is data comes from the server
      } // constructor
    } // injected class
    return Output;
  }
}


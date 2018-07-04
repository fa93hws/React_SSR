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
          resolve(window[varName]);
          delete window[varName];
        });
      } else {
        return originMethod(args);
      } // whether varName exists
    } // override descriptor value
  } // main decorator
} // function wrapper

export function injectSSRState(target) {
  class Output extends target {
    constructor(props) {
      super(props);
      if (typeof props.staticContext !== 'undefined') {
        this.state = {
          ...this.state,
          ...props.staticContext,
          pageAjaxStatus: EAjaxStatus.done
        }
      }
    }
  }
  return Output;
}

// export function connectAndLogHistory (mapStateToProps: ((state: IStoreState) => any)|null, mapDispatchToProps: ((dispatch: Dispatch<AnyAction>) => any)|null) {
//   return <T extends { new (...args: any[]):  React.Component<IPathLogger|{}> }> (target: T) => {
//     const original = target;
//     @(connect(mapStateToProps, mapDispatchToProps) as any)
//     class Output extends target {
//       public componentDidMount () {
//         if (typeof original.prototype.componentDidMount !== 'undefined') {
//           original.prototype.componentDidMount.call(this);
//         }
//         const props = this.props as IPathLogger;
//         props.pushHistory(props.history.location.pathname);
//       } // did mount
//     } // output class
//     return Output;
//   } // return decorator
// } // return decorator factory
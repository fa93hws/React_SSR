# Server Side Rendering (SSR) React

This working demo illustrates a server side rendering (SSR) using the dependency injection and the decorator without the Redux.

## Requirement
* Node.js instance is available at the back-end .
*If other framework other than node like Spring/.Net/PHP/Rails is used, you could establish another Node process and make a reverse proxy using nginx or anything else.*

## How do I xxx
1. Render react element to string: 

	using `renderToString` provided by `react-dom/server`
see https://reactjs.org/docs/react-dom-server.html

2. Make Ajax request

	using axios in the back end to send ajax request to the API server.

3. Know which Ajax request should a component make

	I defined it in the node.js script.

	If you would like a dependency inversion way, you could defined a callback function in the front end router.

	see https://reacttraining.com/react-router/web/guides/server-rendering/data-loading

4. Find the component need rendering from the url

	using `StaticRouter` provided by `react-router-dom/StaticRouter`.


	see https://reacttraining.com/react-router/web/guides/server-rendering
	example of usage:
	```
	const context = {};
	const body = renderToString (
	  <StaticRouter location={ url } context={ context }>
	    <App />
	  </StaticRouter>
	);
	```
5. Render the component with initial state

	The context of the react router is capable to carry any json data to the front end.

	Adding data into it simply do the tricks.

	You can then catch the it via `props.staticContext` in the front end
	
	The constructor of the React component will be something like
	
	```
	import { EAjaxStatus } from '../../enums';

	constructor(props) {
	  super(props);
	  this.state = {
	    // some of your initial state
	    field: value,
	    // you should have a state to represent ajax status.
	    // It is needed to init the loading animation during an ajax call in front end rendering
	    pageAjaxStatus: EAjaxStatus.notSubmitted
	  }

	  // I added a 'ssr' variable to static context to let the client know there is data comes from the back end
	  // Json data will be stored in staticContext.data
	  if (typeof props.staticContext !== 'undefined' && props.staticContext.ssr === true) {
		this.state = {
	      ...this.state,
	      ...props.staticContext.data,
	      pageAjaxStatus: EAjaxStatus.done
	    }
	  }
	}
	```
	
	Don't be panic about adding too many things to the existing code, I will show how to shrink additional code to one line using decorator.

6. Prevent react from rerendering everything

	No, I do not know how to let the React not rerender everything again.

	Instead, by keep the state/props consistent with that provided from the backend, it can be assure that the virtual DOM tree calculated by React must be exactly the same as the one comes from the backend.

	Based on React's algorithm, only virtual but the actual rerendering will be performed.

7. Keep state/props consistent

	Inserting a placeholder script element into the public.html :
	```
	<head>
	  <meta charset="utf-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	  <meta name="theme-color" content="#000000">
	  <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
	  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
	  <!-- you can set any unique id you like  -->
	  <script id='ssr-placeholder'></script>
	  <!-- you can set any unique id you like  -->
	  <title>React App</title>
	</head>
```

	During the backend rendering, replace not only the root div with the rendered html string, buto also the placeholder script element with the one contains the real ajax reply in json format. Leave the data to `window` so that all component can access it.

	One example server side rendered script element:
	
	```
	<script id='ssr-placeholder'>
	  window.__ssr_user_page__ = {
	    "data":{
	      "userAgent":"node-server",
	      "id":"213"
	    },
	    "ssr":true
	  }
	</script>
	```

	Initialized front end app will catch this data, stop making an Ajax call and use it directly.

8. Let the front end app catch data from the back-end

	Dependency Injection (DI)
	
	
	In a typical react component where Ajax call is needed, the request should be sent during `componentDidMount` or `componentWillMount` and the implementation of the request should be in a separated files. 
	
	```
	import axios from 'axios';

	class UserApi {
	  getUser(id) {
	    return axios.get(`/api/user/${ id }`);
	  }
	}

	const userApi = new UserApi();
	export default userApi;
	```
	```
	import userApi from '../../api/user';
	...
	componentDidMount() {
	  userApi.getUser(this.state.userID).then(res => {
	    this.setState({ 
	      userAgent: res.data.userAgent,
	      id: res.data.id
	    })
	  }).finally(() => {
	    this.setState({ pageAjaxStatus: EAjaxStatus.done });
	  });
	}
	```
		
	As a consequence, what we should do is make this api call injected. When there is data comes from the backend, the function will return a promise that mock the usual response from the server.

	```
	class UserApi {
	  getUser(id) {
	    // unique var name from the backend.
	    const varName = '__ssr_user_page__';
	    // found data comes from the back end
	    if (varName in window && window[varName].ssr === true) {
	      return new Promise((resolve,reject) => {
		const data = window[varName];
		delete window[varName];
		document.getElementById("ssr-placeholder").innerHTML = "";
		resolve(data);
	      });
	    } else {
	      // data not found, using front end rendering
	      return axios.get(`/api/user/${ id }`);
	    }
	  }
	}
	```

	Don't be panic about adding too many things to the existing code, I will show how to shrink additional code to one line using decorator.

9. Minimize the change to the existing code
	
	Decorator is a stage-2 feature from the  [proposal](https://tc39.github.io/proposal-decorators/).
	It can be used to create user defined high order function or high order component.
	The usage of creating the decorators to increase the readability and keep the code DRY will be shown.
	
	```
	// decorator factory, return a function to decorate the object
	// factory is used because varable need to be passed into the decorator.
	export function enableSSR(varName) {
	  // return the decorator
	  return (target, name, descriptor) => {
	    if (typeof varName === 'undefined' || varName === '') {
	      return descriptor;
	    }
	    // descriptor is the function that is to be decorated.
	    // descriptor.value = origin function.
	    // the original function will be cached as it will be overwritten lateer and access to the original function is requred
	    const originMethod = descriptor.value;
	    // overwrite the function being decorated
	    descriptor.value = function(...args) {
	      // if the data comes from the server ,do the following
	      if (varName in window && window[varName].ssr === true) {
		return new Promise((resolve,reject) => {
		  const data = window[varName];
		  delete window[varName];
		  document.getElementById("ssr-placeholder").innerHTML = "";
		  resolve(data);
		});
	      } else {
		// if no data comes from the server, use existing method
		return originMethod(...args);
	      }
	    }
	  }
	}
	```
	
	`enableSSR` is a function decorator, it will be used to decorate api function.
	After that, code in `api/user.js` becomes
	
	```
	import { enableSSR } from '../decorator';

	class UserApi {
	  @enableSSR('__ssr_user_page__')
	  getUser(id) {
	    return axios.get(`/api/user/${ id }`);
	  }
	}
	```
	
	By adding `@enableSSR('__ssr_user_page__')` on top of the function will do the magic.
	That could be extremely useful as you only need to add very few lines to the existing codes.
	And the decorator above actually tells reader that this function will be used during server side rendering.
	
	Follow the same logic, we can create another decorator for the class constructor
	
	```
	// when decorator a constructor of a class, it's class instead of itself will be decorated

	// since no input is needed to pass into the decorator
	// the decorator factory can be skipped
	export function injectSSRState(target) {
	  // there is only one input when decorating a class.
	  // it is the class itself, or the constructor function

	  // create a derived class from the class being decorated
	  // as we want all properties from it
	  class Output extends target {
	    // modify the constructor
	    constructor(props) {
	      // call the parent constructor, which is the targeting constructor
	      super(props);
	      // everything here can be regarded as a supplement at the end of the target class constructor
	      if (typeof props.staticContext !== 'undefined' && props.staticContext.ssr === true) {
		this.state = {
		  ...this.state,
		  ...props.staticContext.data,
		  pageAjaxStatus: EAjaxStatus.done
		}
	      }      
	    }
	  } 
	  return Output;
	}
	```
	```
	import { injectSSRState } from '../../decorator';

	// simpliy add one line to handle every thing.
	@injectSSRState
	export default class User extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      ...
	      pageAjaxStatus: EAjaxStatus.notSubmitted
	    }
	  }
	  ...
	}
	```

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
<script src="https://gist.github.com/fa93hws/cbaf849facf9b47f36271d3849308196.js"></script>
5. Render the component with initial state

	The context of the react router is capable to carry any json data to the front end.

	Adding data into it simply do the tricks.

	You can then catch the it via `props.staticContext` in the front end
	
	The constructor of the React component will be something like
	
	<script src="https://gist.github.com/fa93hws/60ef1e6abcc44bd2d1f38d71579a8a15.js"></script>
	
	Don't be panic about adding too many things to the existing code, I will show how to shrink additional code to one line using decorator.

6. Prevent react from rerendering everything

	No, I do not know how to let the React not rerender everything again.

	Instead, by keep the state/props consistent with that provided from the backend, it can be assure that the virtual DOM tree calculated by React must be exactly the same as the one comes from the backend.

	Based on React's algorithm, only virtual but the actual rerendering will be performed.

7. Keep state/props consistent

	Inserting a placeholder script element into the public.html :
	<script src="https://gist.github.com/fa93hws/63e0294256af8cfa17742d26ea9442a3.js"></script>

	During the backend rendering, replace not only the root div with the rendered html string, buto also the placeholder script element with the one contains the real ajax reply in json format. Leave the data to `window` so that all component can access it.

	One example server side rendered script element:
	
	<script src="https://gist.github.com/fa93hws/9b4e7b5d2027e7be7ecd457c2dc61234.js"></script>

	Initialized front end app will catch this data, stop making an Ajax call and use it directly.

8. Let the front end app catch data from the back-end

	Dependency Injection (DI)
	
	
	In a typical react component where Ajax call is needed, the request should be sent during `componentDidMount` or `componentWillMount` and the implementation of the request should be in a separated files. 
	
	<script src="https://gist.github.com/fa93hws/ebbf588d673cf8b1411279b29d693d4d.js"></script>
		
	As a consequence, what we should do is make this api call injected. When there is data comes from the backend, the function will return a promise that mock the usual response from the server.

	<script src="https://gist.github.com/fa93hws/129cf0463aef892c0cee75b4287e057b.js"></script>

	Don't be panic about adding too many things to the existing code, I will show how to shrink additional code to one line using decorator.

9. Minimize the change to the existing code
	
	Decorator is a stage-2 feature from the  [proposal](https://tc39.github.io/proposal-decorators/).
	It can be used to create user defined high order function or high order component.
	The usage of creating the decorators to increase the readability and keep the code DRY will be shown.
	
	<script src="https://gist.github.com/fa93hws/93b605586b0c8eef7b67fc7fe86d3065.js"></script>
	
	`enableSSR` is a function decorator, it will be used to decorate api function.
	After that, code in `api/user.js` becomes
	
	<script src="https://gist.github.com/fa93hws/d6e2f3abedf2d8d922410692d8a26990.js"></script>
	
	By adding `@enableSSR('__ssr_user_page__')` on top of the function will do the magic.
	That could be extremely useful as you only need to add very few lines to the existing codes.
	And the decorator above actually tells reader that this function will be used during server side rendering.
	
	Follow the same logic, we can create another decorator for the class constructor
	
	<script src="https://gist.github.com/fa93hws/990f2b266b550875d347026c4d7ba847.js"></script>

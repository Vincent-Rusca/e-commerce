// Creates component wrapper used to wrap components that use the context data 
// and methods. A higher-order component.
import React from "react";
import Context from "./Context";

const withContext = WrappedComponent => { // takes a component as a parameter
	const WithHOC = props => { // takes the props of the component as a parameter
		return(
			<Context.Consumer>
				{context => <WrappedComponent {...props} context={context} />}
			</Context.Consumer>
		);
	};
	return WithHOC;
};

export default withContext;
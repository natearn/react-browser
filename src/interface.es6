import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import * as Pure from "./components.es6";

// react interface (stateful)
class Browser extends React.Component {
	constructor(props) {
		super(props);
		let modes = [
			{name: "Thumbnail", component: Pure.ThumbnailView},
			{name: "Button", component: Pure.ButtonView},
			{name: "Link", component: Pure.LinkView}
		];
		this.state = {
			modes: modes,
			activeMode: modes[0],
			activeBranch: props.root,
			path: [props.root],
			selectMode: (mode) => this.setState({activeMode: mode}),
			selectBranch: (branch) => this.setState({
				activeBranch: branch,
				path: _.includes(this.state.path,branch) ? this.state.path : this.findPath(branch)
			})
		};
	}

	findPath(branch) { return branch ? _.concat(this.findPath(branch.parent),branch) : []; }

	componentWillReceiveProps(nextProps) {
		// Since both activeBranch and path reference props, they will need to be updated manually here
		let nextPath = _.reduce(
			this.state.path,
			(p,b) => _.includes(_.last(p).children,b) ? _.concat(p,b) : p,
			[nextPath.root]
		);
		let ab = this.state.activeBranch;
		let nextBranch = _.includes(nextPath,ab) ? ab : _.last(nextPath);
		this.setState({path: nextPath, activeBranch: nextBranch});
	}

	render() {
		return <Pure.Browser {...this.state} />;
	}
}

// js-only interface
function runBrowser(node,data) {
	ReactDOM.render(<Browser root={data} />,node);
	return x => ReactDOM.render(<Browser root={x} />,node);
}

export { Browser, runBrowser };

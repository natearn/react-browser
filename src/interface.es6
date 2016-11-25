import React from "react";
import ReactDOM from "react-dom";
import Kefir from "kefir";
import _ from "lodash";
import * as Pure from "./components.es6";

// react interface (stateful)
// NOTE: I just hacked this together from old code, this is NOT the ideal way to do this.
// TODO: properly update state when new props are received
// TODO: properly update the components on updates (it is imparative to preserve interface state as much as possible)
class Browser extends React.Component {
	constructor(props) {
		super(props);
		const modes = [
			{name: "Thumbnail", component: Pure.ThumbnailView},
			{name: "Button", component: Pure.ButtonView},
			{name: "Link", component: Pure.LinkView}
		];
		const modePool = Kefir.pool();
		const selectMode = (mode) => modePool.plug(Kefir.constant(mode));
		const activeMode = modePool.toProperty(() => modes[0]);
		const branchPool = Kefir.pool();
		const selectBranch = (branch) => branchPool.plug(Kefir.constant(branch));
		const activeBranch = branchPool.toProperty(() => props.root);
		const findPath = (branch) => branch ? _.concat(findPath(branch.parent),branch) : [];
		const path = activeBranch.scan((curPath,nextBranch) => (
			_.includes(curPath,nextBranch) ? curPath : findPath(nextBranch)
		),[]);
		const model = Kefir.combine([activeMode, activeBranch, path]);
		this.state = {
			modes: modes,
			selectMode: selectMode,
			selectBranch: selectBranch,
			activeMode: modes[0],
			activeBranch: props.root,
			path: [props.root]
		};
		model.onValue(([m,b,p]) => {
			this.setState({
				activeMode: m,
				activeBranch: b,
				path: p
			});
		});
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

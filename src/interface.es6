import React from "react";
import ReactDOM from "react-dom";
import Kefir from "kefir";
import _ from "lodash";
import * as C from "./components.es6";

// TODO: properly update the components on updates
export default function browser(node,data) {

	const updates = Kefir.pool();
	const tree = updates.toProperty(() => data);
	const modes = [
		{name: "Thumbnail", component: C.ThumbnailView},
		{name: "Button", component: C.ButtonView},
		{name: "Link", component: C.LinkView}
	];
	const modePool = Kefir.pool();
	function selectMode(mode) { modePool.plug(Kefir.constant(mode)); }
	const activeMode = modePool.toProperty(() => modes[0]);
	const branchPool = Kefir.pool();
	function selectBranch(branch) { branchPool.plug(Kefir.constant(branch)); }
	const activeBranch = branchPool.toProperty();
	tree.take(1).onValue(selectBranch);
	const findPath = branch => branch ? _.concat(findPath(branch.parent),branch) : [];
	const path = activeBranch.scan((curPath,nextBranch) => (
		_.includes(curPath,nextBranch) ? curPath : findPath(nextBranch)
	),[]);

	const model = Kefir.combine([activeMode, activeBranch, path]);
	model.onValue(([m,b,p]) => {
		ReactDOM.render(
			<C.Browser
				path={p}
				activeBranch={b}
				selectBranch={selectBranch}
				modes={modes}
				activeMode={m}
				selectMode={selectMode}
			/>,
			node
		);
	});

	return x => updates.plug(Kefir.constant(x));
}

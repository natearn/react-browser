import React from "react";
import ReactDOM from "react-dom";
import Kefir from "kefir";
import _ from "lodash";

function Modes(props) {
	const buttons = props.modes.map((mode) => (
		<li key={mode.name} style={{display: "inline"}}>
		<button
			onClick={() => props.select(mode)}
			style={{borderStyle: props.activeMode == mode ? "inset" : "outset"}}
		>
			{mode.name}
		</button>
		</li>
	));
	return <ul style={{display: "inline", margin: "0", padding: "0"}}>{buttons}</ul>;
}

function Path(props) {
	const buttons = props.path.map((branch) => (
		<li key={branch.name} style={{display: "inline"}}>
		<button
			onClick={() => props.select(branch)}
			style={{borderStyle: props.activeBranch == branch ? "inset" : "outset"}}
		>
			{branch.name}
		</button>
		</li>
	));
	return <ol style={{display: "inline", margin: "0", padding: "0"}}>{buttons}</ol>;
}

function ButtonView(props) {
	const branches = props.branch.children.map((b) =>
		<li key={b.name} style={{display: "inline-block", margin: "0.5em"}}>
			<button onClick={() => props.select(b)}>{b.name}</button>
		</li>
	);
	return <ul style={{margin: "0", padding: "0.5em"}}>{branches}</ul>;
}

function LinkView(props) {
	const branches = props.branch.children.map((b) =>
		<li key={b.name} style={{display: "inline-block", margin: "0.5em"}}>
			<a href="#" onClick={() => props.select(b)}>{b.name}</a>
		</li>
	);
	return <ul style={{margin: "0", padding: "0.5em"}}>{branches}</ul>;
}

function ThumbnailView(props) {
	const branches = props.branch.children.map((b,i) =>
		<li key={b.name} style={{display: "inline-block", margin: "0.5em"}}>
			<img src={b.thumbnail} alt={b.name} onClick={() => props.select(b)} />
		</li>
	);
	return <ul style={{margin: "0", padding: "0.5em"}}>{branches}</ul>;
}

const browserStyles = {
	browser: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "darkgrey",
		height: "100%",
		width: "100%"
	},
	view: {
		display: "flex",
		flexGrow: "1",
		overflowY: "scroll"
	},
	header: {
		display: "flex",
		flexShrink: "0",
		justifyContent: "space-between",
		backgroundColor: "lightgrey",
		padding: "0.25em"
	}
};
function Browser(props) {
	return (
		<div className="browser" style={browserStyles.browser}>
			<div className="header" style={browserStyles.header}>
				<Path path={props.path} activeBranch={props.activeBranch} select={props.selectBranch} />
				<Modes modes={props.modes} activeMode={props.activeMode} select={props.selectMode} />
			</div>
			<div className="view" style={browserStyles.view}>
				{props.activeMode.component({
					branch: props.activeBranch,
					select: props.selectBranch
				})}
			</div>
		</div>
	);
}

// create some data to render
var example = {name: "tree", children: [
	{name: "root", children: [
		{name: "trunk", children: [
				{name: "branch", children: (function f(n) { return _.concat((n > 0 ? f(n-1) : []),{name: "obj"+n, children: []}); })(50)}
			]
		},
		{name: "bark", children: [
			{name: "bugs", children: []}
		]}
	]}
]};
function addParent(tree) {
	tree.children.map(b => b.parent = tree);
	tree.children.map(b => addParent(b));
}
addParent(example);
function addThumb(tree) {
	tree.thumbnail = "http://placekitten.com/g/64/72"
	tree.children.map(b => addThumb(b));
}
addThumb(example);

const modes = [
	{name: "Thumbnail", component: ThumbnailView},
	{name: "Button", component: ButtonView},
	{name: "Link", component: LinkView}
];
const modePool = Kefir.pool();
function selectMode(mode) { modePool.plug(Kefir.constant(mode)); }
const activeMode = modePool.toProperty(() => modes[0]);
const branchPool = Kefir.pool();
function selectBranch(branch) { branchPool.plug(Kefir.constant(branch)); }
const activeBranch = branchPool.toProperty(() => example);

const findPath = branch => branch ? _.concat(findPath(branch.parent),branch) : [];
const path = activeBranch.scan((curPath,nextBranch) => (
	_.includes(curPath,nextBranch) ? curPath : findPath(nextBranch)
),[]);

const model = Kefir.combine([activeMode, activeBranch, path]);
model.onValue(([m,b,p]) => {
	ReactDOM.render(
		<Browser
			path={p}
			activeBranch={b}
			selectBranch={selectBranch}
			modes={modes}
			activeMode={m}
			selectMode={selectMode}
		/>,
		document.getElementById('application')
	);
});
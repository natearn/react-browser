import React from "react";
import ReactDOM from "react-dom";
import Kefir from "kefir";
import _ from "lodash";

function Modes(props) {
	const buttons = props.modes.map((mode) => (
		<li key={mode.name} style={{display: "inline"}}>
		<button
			onClick={() => props.select(mode)}
			style={{borderStyle: props.selectedMode == mode ? "inset" : "outset"}}
		>
			{mode.name}
		</button>
		</li>
	));
	return <ul style={{display: "inline"}}>{buttons}</ul>;
}

function Path(props) {
	const buttons = props.path.map((branch) => (
		<li key={branch.name} style={{display: "inline"}}>
		<button
			onClick={() => props.select(branch)}
			style={{borderStyle: props.selectedBranch == branch ? "inset" : "outset"}}
		>
			{branch.name}
		</button>
		</li>
	));
	return <ol style={{display: "inline"}}>{buttons}</ol>;
}

function ButtonView(props) {
	const branches = props.branch.children.map((b) =>
		<li key={b.name}><button onClick={() => props.select(b)}>{b.name}</button></li>
	);
	return <ul>{branches}</ul>;
}

function LinkView(props) {
	const branches = props.branch.children.map((b) =>
		<li key={b.name}><a href="#" onClick={() => props.select(b)}>{b.name}</a></li>
	);
	return <ul>{branches}</ul>;
}

function ThumbnailView(props) {
	const branches = props.branch.children.map((b,i) =>
		<li key={b.name}><img src={b.thumbnail} alt={b.name} onClick={() => props.select(b)} /></li>
	);
	return <ul>{branches}</ul>;
}

function Browser(props) {
	return (
		<div className="browser">
			<div className="header">
				<Path path={props.path} selectedBranch={props.selectedBranch} select={props.selectBranch} />
				<Modes modes={props.modes} selectedMode={props.selectedMode} select={props.selectMode} />
			</div>
			{props.selectedMode.component({
				branch: props.selectedBranch,
				select: props.selectBranch
			})}
		</div>
	);
}

// create some data to render
const example = {name: "tree", children: [
	{name: "root", children: [
		{name: "trunk", children: [
				{name: "branch", children: [
						{name: "fruit", children: []},
						{name: "flower", children: []},
						{name: "leaf", children: []},
						{name: "stem", children: []}
					]
				}
			]
		},
		{name: "bark", children: [
			{name: "bugs", children: []}
		]}
	]}
]};
const modes = [
	{name: "Thumbnail", component: ThumbnailView},
	{name: "Button", component: ButtonView},
	{name: "Link", component: LinkView}
];
const modePool = Kefir.pool();
function selectMode(mode) { modePool.plug(Kefir.constant(mode)); }
const selectedMode = modePool.toProperty(() => modes[0]);
const branchPool = Kefir.pool();
function selectBranch(branch) { branchPool.plug(Kefir.constant(branch)); }
const selectedBranch = branchPool.toProperty(() => example);
const path = selectedBranch.scan((curPath,nextBranch) => (
	// the shortest prefix of (path + nextBranch) that terminates with nextBranch
	_.concat(_.takeWhile(curPath,branch => branch != nextBranch),nextBranch)
),[]);

const model = Kefir.combine([selectedMode, selectedBranch, path]);
model.onValue(([m,b,p]) => {
	ReactDOM.render(
		<Browser
			path={p}
			selectedBranch={b}
			selectBranch={selectBranch}
			modes={modes}
			selectedMode={m}
			selectMode={selectMode}
		/>,
		document.getElementById('application')
	);
});

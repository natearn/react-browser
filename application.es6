import React from "react";
import ReactDOM from "react-dom";
import Kefir from "kefir";
import _ from "lodash";

function Modes(props) {
	const buttons = props.modes.map((mode) => (
		<button
			onClick={() => props.select(mode)}
			className={props.selectedMode == mode ? "selected" : ""}
			key={mode.name}
		>
			{mode.name}
		</button>));
	return <ul>{buttons}</ul>;
}

function Path(props) {
	const buttons = props.path.map((branch) => (
		<button
			onClick={() => props.select(branch)}
			className={props.selectedBranch == branch ? "selected" : ""}
			key={branch.name}
		>
			{branch.name}
		</button>));
	return <ol>{buttons}</ol>;
}

function ButtonView(props) {
	const branches = props.branch.children.map((b) =>
		<button onClick={() => props.select(b)} key={b.name}>{b.name}</button>
	);
	return <ul>{branches}</ul>;
}

function LinkView(props) {
	const branches = props.branch.children.map((b) =>
		<a href="#" onClick={() => props.select(b)} key={b.name}>{b.name}</a>
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
	// take path branches until nextBranch is encountered, then append nextBranch
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

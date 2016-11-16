import React from "react";
import ReactDOM from "react-dom";
import Kefir from "kefir";

function Modes(props) {
	const buttons = props.modes.map((mode) => (
		<button
			onClick={() => props.select(mode)}
			className={props.selectedMode == mode ? "selected" : ""}
			key={mode.icon}
		>
			{mode.icon}
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

// create some data to render
const modes = [{icon: "A"},{icon: "B"}];
const modePool = Kefir.pool();
function selectMode(mode) { modePool.plug(Kefir.constant(mode)); }
const selectedMode = modePool.toProperty(() => modes[0]);

const tree = {
	name: "root",
	children: [
		{
			name: "trunk",
			children: [
				{
					name: "branch",
					children: [
						{name: "leaf", children: []},
						{name: "stem", children: []}
					]
				}
			]
		},
		{name: "bark", children: []},
	]
};

const branchPool = Kefir.pool();
function selectBranch(branch) { branchPool.plug(Kefir.constant(branch)); }
const selectedBranch = branchPool.toProperty(() => tree);
const path = [tree,
              tree.children[0],
              tree.children[0].children[0],
              tree.children[0].children[0].children[1]
             ];

const model = Kefir.combine([selectedMode, selectedBranch]);
model.onValue(([mode,branch]) => {
	ReactDOM.render(
		<div>
			<Path path={path} selectedBranch={branch} select={selectBranch} />
			<Modes modes={modes} selectedMode={mode} select={selectMode} />
		</div>,
		document.getElementById('application')
	);
});

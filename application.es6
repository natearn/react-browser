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

// create some data to render
const modes = [{icon: "A"},{icon: "B"}];
const modePool = Kefir.pool();
function selectMode(mode) { modePool.plug(Kefir.constant(mode)); }
const selectedMode = modePool.toProperty(() => modes[0]);

selectedMode.onValue((mode => {
	ReactDOM.render(
		<Modes modes={modes} selectedMode={mode} select={selectMode} />,
		document.getElementById('application')
	)
});

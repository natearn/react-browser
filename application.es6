import React from "react";
import ReactDOM from "react-dom";

function Modes(props) {
	const buttons = props.modes.map((mode) => <button>{mode.icon}</button>);
	return <ul>{buttons}</ul>;
}

ReactDOM.render(
  <Hello name="World" />,
  document.getElementById('application')
);

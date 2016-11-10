import React from "react";
import ReactDOM from "react-dom";

function Hello(props) {
    return <div>Hello {props.name}</div>;
}

ReactDOM.render(
  <Hello name="World" />,
  document.getElementById('application')
);

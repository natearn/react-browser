import React from "react";
import ReactDOM from "react-dom";

function Modes(props) {
	const buttons = props.modes.map((mode) => (
		<li key={mode.name} style={{display: "inline"}}>
		<button
			onClick={() => props.select(mode)}
			style={{borderStyle: props.activeMode == mode ? "inset" : "outset"}}
		>
			{mode.icon}
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

export {
	Browser,
	Modes,
	Path,
	ThumbnailView,
	LinkView,
	ButtonView
};

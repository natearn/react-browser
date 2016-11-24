import _ from "lodash";

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

export default example;

import _ from "lodash";
import Kefir from "kefir";
import Chance from "chance";
const random = new Chance();

function genTree(depth,width) {
	return addThumb(
		addParent({
			id:       random.guid(),
			name:     random.name(),
			children: (
				depth > 0 ?
				random.n(() => genTree(depth-1,width),random.natural({min: 1, max: width})) :
				[]
			)
		})
	);
}

function addParent(tree) {
	tree.children.map(b => b.parent = tree);
	tree.children.map(b => addParent(b));
	return tree;
}

function addThumb(tree) {
	tree.thumbnail = "http://placekitten.com/g/64/72"
	tree.children.map(b => addThumb(b));
	return tree;
}

function mutateTree(tree,maxDepth,width) {
	let depth = random.natural({min: 0, max: maxDepth});
	let getBranch = (b,d) => (
		d < 1 || _.isEmpty(b.children) ? b : getBranch(random.pickone(b.children),d-1)
	);
	let branch = getBranch(tree,depth);
	Object.assign(branch,genTree(random.natural({min: 0, max: maxDepth - depth}),width));
	return tree;
}

function sampleStream(depth,width) {
	const triggers = Kefir.repeat(i => Kefir.later(random.natural({min: 100, max: 5000}),true));
	return triggers.scan((t,_) => mutateTree(t,depth,width),genTree(depth,width));
}


export default sampleStream;

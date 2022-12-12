const nodes = [];
const links = [];

NORMAL = 1
PROVIDED = 2
TESTS = 5
BUILD = 9

groups = {
    NORMAL: [],
    PROVIDED: ['boto3', 'botocore'],
    TESTS: ['pytest', 'moto'],
    BUILD: ['setuptools', 'twine', 'wheel']
}

package_to_group = {


    'boto3': PROVIDED,
    'botocore': PROVIDED,

    'wheel': BUILD,

    'pytest': TESTS,
    'moto': TESTS,

    'setuptools': BUILD,
    'twine': BUILD,

}

adj_list = {}

const elem = document.getElementById('graph');

const occurances = {}

// extract nodes and links from the pipdeptree data
data.forEach(d => {
    // add a node for the current package
    occurances[d.package.key] = 0
    nodes.push({
        id: d.package.key,
        label: d.package.key,
        group: package_to_group[d.package.key] != undefined ? package_to_group[d.package.key] : NORMAL

    });
    adj_list[d.package.key] = []
        // add links to the package's dependencies
    d.dependencies.forEach(dep => {
        links.push({
            source: d.package.key,
            target: dep.key
        });
        adj_list[d.package.key].push(dep.key)
        occurances[dep.key] += 1
    });
});


roots = getRoots(nodes, links)

function getRoots(nodeObjects, edges) {

    const notRoots = []
    const nodes = []

    nodeObjects.forEach(n => {
        nodes.push(n.id)
    })

    edges.forEach(e => {

        notRoots.push(e.target)
    })

    return _.difference(nodes, notRoots)

}
groupss = {}


roots.forEach(root => {

    groupss[root] = package_to_group[root] == undefined ? 1 : package_to_group[root]

    tag_packages(root, adj_list[root], groupss[root])
})





function tag_packages(node, neighbors, parent_group) {

    // if (package_to_group[node] == undefined) {
    if (groupss[node] != undefined)
        groupss[node] = Math.min(groupss[node], parent_group)
    else
        groupss[node] = parent_group

    neighbors.forEach(neighbor => {
        tag_packages(neighbor, adj_list[neighbor], parent_group)
    })

}

function tag_nodes() {
    nodes.forEach(node => {

        node['group'] = groupss[node.id]

    })

}
tag_nodes()
console.log(nodes)

console.log(groupss)



miserables = {
    'nodes': nodes,
    'links': links
}
invalidation = new Promise((resolveInner) => {
    setTimeout(resolveInner, 1000);
})

chart = ForceGraph(miserables, {
    nodeId: d => d.id,
    nodeGroup: d => d.group,
    // nodeTitle: d => `${d.id}\n${d.group}`,
    nodeTitle: d => `${d.id}`,
    linkStrokeWidth: l => Math.sqrt(l.value),
    width: 5000,
    height: 2000,
    invalidation // a promise to stop the simulation when the cell is re-run
})
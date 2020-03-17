var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
// Possible color schemes
var colors = [["#78C0E0","#449DD1","#150578","#0E0E52","#3943B7"],["#3C1518","#69140E","#A44200","#D58936","#FFF94F"],["#FFFFFF","#412234","#6D466B","#B49FCC","#EAD7D7"],["#561643","#6C0E23","#C42021","#F3FFB9","#3C1742"],["#FFBC42","#D81159","#8F2D56","#218380","#73D2DE"]];

// Define sliders
var colorSlider = document.getElementById("color-slider");
var numNodesSlider = document.getElementById("num-nodes-slider");
var boundarySlider = document.getElementById("boundary-slider");
var preferenceMaxSlider = document.getElementById("preference-max-slider");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Node object
function Node(x, y, state) {
    this.x = x; // Node location
    this.y = y;
    this.radius = 10; // Node radius
    this.state = state; // Node state
    this.connectedNodes = []; // Nodes connected to this node
    this.borderColor = "white"; // Node border color
    this.fillColor = "white"; // Node fill color

    // Method that draws node
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.borderColor;
        c.stroke();
        c.fillStyle = this.fillColor;
        c.fill();
    }

    // Method that updates node
    this.update = function() {
        this.draw();
    }
}

// Edge object
function Edge(node1, node2, weight) {
    this.node1 = node1; // Node 1
    this.node2 = node2; // Node 2
    this.weight = weight; // Edge weight
    this.color = "white"; // Edge color

    // Method that draws edge
    this.draw = function() {
        c.beginPath();
        c.moveTo(node1.x, node1.y);
        c.lineTo(node2.x, node2.y);
        c.strokeStyle = this.color;
        c.stroke();
    }
}

// Handles slider input
colorSlider.oninput = function() {
    currentColor = this.value;
}

numNodesSlider.oninput = function() {
    numNodes = this.value;
    numNodesSlider.parentElement.children[0].innerHTML = "Number of Nodes: " + numNodes;
}

boundarySlider.oninput = function() {
    nodeBoundary = this.value;
    boundarySlider.parentElement.children[0].innerHTML = "Min Distance Between Nodes: " + nodeBoundary;
}

preferenceMaxSlider.oninput = function() {
    edgePreferenceMax = this.value;
    preferenceMaxSlider.parentElement.children[0].innerHTML = "Max Edge Formation Distance: " + edgePreferenceMax;
}

// Returns distance between two nodes
function distBetweenNodes(node1,node2) {
    return Math.sqrt((node1.x-node2.x)**2+(node1.y-node2.y)**2);
}

// Generates a node recurisvely, meeting spacing requirements
function generateNode() {
    // Generates random position
    var x = Math.random()*(canvas.width-2*borderThickness)+borderThickness;
    var y = Math.random()*(canvas.height-2*borderThickness)+borderThickness;
    // Creates node
    var newNode = new Node(x, y, 0);
    // Checks if node is too close to any existing ones
    for (var i = 0; i < nodes.length; i++) {
        if (Math.abs(newNode.x - nodes[i].x) < nodeBoundary && Math.abs(newNode.y - nodes[i].y) < nodeBoundary) {
            // Repeats function until node found
            newNode = generateNode();
        }
    }
    return newNode;
}

// Tries to generates new edge for a node
function generateEdge(nodeID) {
    // Current node
    var node1ID = nodeID;
    // Nearest neighbor to be chosen
    var randPos = Math.floor(edgePreferenceMax*Math.random())+1;
    // List of distances to other nodes
    var distList = [];

    // Record list of distances to other nodes
    for (var i = 0; i < nodes.length; i++) {
        distList[i] = distBetweenNodes(nodes[node1ID],nodes[i]);
    }

    // Save unsorted list
    let unsortedDistList = distList.slice(0);
    // Sort list in ascending order
    distList.sort(function(a, b){return a - b});
    // Return index of randPos-"th" closest node
    var node2ID = unsortedDistList.indexOf(distList[randPos]);

    // Creates edge to other node
    newEdge = new Edge(nodes[node1ID],nodes[node2ID],1);

    // Doesn't make the edge if it already exists
    var flag = 0;
    for (var i = 0; i < edges.length; i++) {
        if ((newEdge.node1 === edges[i].node1 && newEdge.node2 === edges[i].node2) || (newEdge.node1 === edges[i].node2 && newEdge.node2 === edges[i].node1)) {
            flag = 1;
        }
    }
    if (flag === 1) {
        newEdge = null;
    }

    return newEdge;
}

// Colors triangles in the network by looking for loops 
function color() {
    for (var i = 0; i < nodes.length; i++) {
        var node1 = nodes[i];
        for (var j = 0; j < node1.connectedNodes.length; j++) {
            var node2 = node1.connectedNodes[j];
            for (var k = 0; k < node2.connectedNodes.length; k++) {
                var node3 = node2.connectedNodes[k];
                for (var l = 0; l < node3.connectedNodes.length; l++) {
                    var node4 = node3.connectedNodes[l];
                    if (node4 === node1) {
                    c.beginPath();
                    c.moveTo(node1.x, node1.y);
                    c.lineTo(node2.x, node2.y);
                    c.lineTo(node3.x, node3.y);
                    c.lineTo(node1.x, node1.y);
                    c.fillStyle = colors[currentColor][Math.floor(colors.length*Math.random())];
                    c.fill();
                    }
                }
            }
        }
    }
}

// Resets image
function refresh() {
    // Clears screen
    c.clearRect(0, 0, innerWidth, innerHeight);

    // Resets nodes and edges
    nodes = [];
    edges = [];

    // Generates nodes
    for (var i = 0; i < numNodes; i++) {
        nodes.push(generateNode());
    }

    // Generates edges and updates connectedNodes lists
    for (var i = 0; i < numNodes; i++) {
        for (var j = 0; j < edgePerNodeMax; j++) {
            var newEdge = generateEdge(i);
            if (newEdge !== null) {
                edges.push(newEdge);

                var flag = 0;
                for (var k = 0; k < newEdge.node1.connectedNodes.length; k++) {
                    if (newEdge.node1.connectedNodes[k] === newEdge.node2) {
                        flag = 1;
                    }
                }
                if (flag === 0) {
                    newEdge.node1.connectedNodes.push(newEdge.node2);
                }

                var flag = 0;
                for (var k = 0; k < newEdge.node2.connectedNodes.length; k++) {
                    if (newEdge.node2.connectedNodes[k] === newEdge.node1) {
                        flag = 1;
                    }
                }
                if (flag === 0) {
                    newEdge.node2.connectedNodes.push(newEdge.node1);
                }
            }
        }
    }

    color();
}

var currentColor = 0; // Current color scheme
var numNodes = 100; // Number of nodes
var nodeBoundary = 50; // Radius around node in which others cannot spawn
var edgePreferenceMax = 6; // Max closest neighbor edge can form between
var edgePerNodeMax = 5; // Number of edge generation runs per node (should be <= above number)
var borderThickness = 100; // Min distance from edge of screen to node

var nodes = [];
var edges = [];

refresh();
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var cursor = {
    x: -99,
    y: -99
};

// Define slider
var preferenceMaxSlider = document.getElementById("preference-max-slider");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Node Object
function Node(x, y, state) {
    this.x = x; // Node position
    this.y = y;
    this.ogX = x; // Node original position
    this.ogY = y;
    this.dx = 0; // Node velocity
    this.dy = 0;
    this.radius = 10; // Node radius
    this.state = state; // Node state
    this.tempState = state; // Node temporary state
    this.connectedNodes = []; // List of connected nodes

    // Method that draws the node
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // Change color depending on state
        if (this.state === 0) {
            c.fillStyle = "white";
        }
        else {
            c.fillStyle = "red";
        }
        c.fill();
    }

    // Method that updates node position
    this.updatePos = function() {
        // Move node towards original position if moved
        this.dx = attractFactor*(this.ogX - this.x);
        this.dy = attractFactor*(this.ogY - this.y);
        // Repel node from mouse
        this.dx += repelFactor*((this.x-cursor.x)/(distBetween(this.x, this.y, cursor.x, cursor.y)**2));
        this.dy += repelFactor*((this.y-cursor.y)/(distBetween(this.x, this.y, cursor.x, cursor.y)**2));
        // Update velocities
        this.x += this.dx;
        this.y += this.dy;
    }

    this.updateState = function() {
        // Infect if one neighbor is infected
        if (this.state !== 1) {
            for (var i = 0; i < this.connectedNodes.length; i++) {
                if (this.connectedNodes[i].state === 1) {
                    this.tempState = 1;
                    // Colors all connected edges when infected
                    for (var j = 0; j < this.connectedNodes.length; j++) {
                        for (var k = 0; k < edges.length; k++) {
                            if ((edges[k].node1 === this && edges[k].node2 === this.connectedNodes[j]) || (edges[k].node1 === this.connectedNodes[j] && edges[k].node2 === this)) {
                                edges[k].color = "red";
                            }
                        }
                    }
                    
                }
            }
        }
    }

    // Register tempState to state
    this.register = function() {
        this.state = this.tempState;
    }
}

// Edge Object
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

// Click event
window.addEventListener('mousedown', 
    function(event) {
        iterate();
})

// Records mouse coordinates
window.addEventListener("mousemove",
    function(event){
        cursor.x = event.x;
        cursor.y = event.y;
})

// Handles slider input
preferenceMaxSlider.oninput = function() {
    edgePreferenceMax = this.value;
    edgePerNodeMax = this.value-1;
    preferenceMaxSlider.parentElement.children[0].innerHTML = "Density: " + edgePreferenceMax;
}

// Helper function that returns distance between two points
function distBetween(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

// Helper function that returns distance between two nodes
function distBetweenNodes(node1,node2) {
    return Math.sqrt((node1.x-node2.x)**2+(node1.y-node2.y)**2);
}

// Hepler function that generates a node recursively given boundary
function generateNode() {
    // Generates random coordinates
    var x = Math.random()*(canvas.width-2*borderThickness)+borderThickness;
    var y = Math.random()*(canvas.height-2*borderThickness)+borderThickness;
    // Creates node
    var newNode = new Node(x, y, 0);
    // Repeats this function until a node meeting the boundary limit is found
    for (var i = 0; i < nodes.length; i++) {
        if (Math.abs(newNode.x - nodes[i].x) < nodeBoundary && Math.abs(newNode.y - nodes[i].y) < nodeBoundary) {
            newNode = generateNode();
        }
    }
    // Returns the successfully placed node
    return newNode;
}

// Attempts to generate an edge from a node to a neighbor
function generateEdge(nodeID) {
    var node1ID = nodeID; // Current node
    var randPos = Math.floor(edgePreferenceMax*Math.random())+1; // Random close neighboring node
    var distList = []; // List of distances to other nodes

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

    // Generates the edge
    newEdge = new Edge(nodes[node1ID],nodes[node2ID],1);

    // Checks if the edge already exists
    var flag = 0;
    for (var i = 0; i < edges.length; i++) {
        if ((newEdge.node1 === edges[i].node1 && newEdge.node2 === edges[i].node2) || (newEdge.node1 === edges[i].node2 && newEdge.node2 === edges[i].node1)) {
            flag = 1;
        }
    }
    if (flag === 1) {
        newEdge = null;
    }

    // Returns the new, unique edge
    return newEdge;
}

// Iterates network spread
function iterate() {
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].updateState();
    }
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].register();
    }
    c.clearRect(0, 0, innerWidth, innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].updatePos();
    }

    for (var i = 0; i < edges.length; i++) {
        edges[i].draw();
    }

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].draw();
    }
}

// Initialization loop
function refresh() {
    nodes = [];
    edges = [];

    // Generate nodes
    for (var i = 0; i < numNodes; i++) {
        nodes.push(generateNode());
    }

    // Generate edges and update node connectedNodes lists
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
    
    // Infect a random cell
    randNodeID = Math.floor(Math.random()*nodes.length);
    nodes[randNodeID].state = 1;
    nodes[randNodeID].tempState = 1;
}

var nodeBoundary = 30; // Radius around node in which others cannot spawn
var numNodes = ((canvas.width-100)*(canvas.height-100))/(Math.PI*nodeBoundary**2) - 50; // Number of nodes
var edgePreferenceMax = 6; // Max closest neighbor edge can form between
var edgePerNodeMax = 4; // Number of edge generation runs per node (should be <= above number)
let borderThickness = 100; // Min distance from edge of screen to node

// Scaling factors for node movement
let attractFactor = 0.1; 
let repelFactor = 150;

var nodes = [];
var edges = [];

refresh();

animate();
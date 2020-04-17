let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

let payoffMatrixImg = document.getElementById("payoff-matrix-img");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ALLDSlider = document.getElementById("ALLD-slider");
let ALLCSlider = document.getElementById("ALLC-slider");
let TFTCSlider = document.getElementById("TFTC-slider");
let TFTDSlider = document.getElementById("TFTD-slider");
let WSLSCSlider = document.getElementById("WSLSC-slider");
let WSLSDSlider = document.getElementById("WSLSD-slider");
let TRGCSlider = document.getElementById("TRGC-slider");
let TRGDSlider = document.getElementById("TRGD-slider");
let killSlider = document.getElementById("kill-slider");
let temptationSlider = document.getElementById("temptation-slider");
let rewardSlider = document.getElementById("reward-slider");
let punishmentSlider = document.getElementById("punishment-slider");
let suckerSlider = document.getElementById("sucker-slider");

// Create Object with Draw and Update Functions Here
function Player(type) {
    this.type = type;
    this.score = 0;
    this.scoredState = false;
    this.connectedTo = undefined;
    this.nextPlay = -1; // Player's strategy for upcoming game
    this.lastPlay = -1; // Player's strategy from last game
    this.lastFaced = -1; // Strategy the player last faced
    this.lastScore = undefined;

    this.updateScore = function() {
        if (this.scoredState === true) {
            return;
        }
        let p1 = this;
        let p2 = this.connectedTo;
        if (p1.nextPlay === 1 && p2.nextPlay === 1) {
            p1.score += reward;
            p2.score += reward;
            p1.lastScore = reward;
            p2.lastScore = reward;
        }
        else if (p1.nextPlay === 1 && p2.nextPlay === 2) {
            p1.score += sucker;
            p2.score += temptation;
            p1.lastScore = sucker;
            p2.lastScore = temptation;
        }
        else if (p1.nextPlay === 2 && p2.nextPlay === 1) {
            p1.score += temptation;
            p2.score += sucker;
            p1.lastScore = temptation;
            p2.lastScore = sucker;
        }
        else {
            p1.score += punishment;
            p2.score += punishment;
            p1.lastScore = punishment;
            p2.lastScore = punishment;
        }
        p1.lastFaced = p2.nextPlay;
        p2.lastFaced = p1.nextPlay;
        this.scoredState = true;
        this.connectedTo.scoredState = true;
    }

    this.updateStrategy = function() {
        if (this.type === 1) { // ALLC
            this.nextPlay = 1;
        }
        if (this.type === 2) { // ALLD
            this.nextPlay = 2;
        }
        if (this.type === 3) { // TFTC (Initial Coop)
            if (this.lastFaced === -1) {
                this.nextPlay = 1;
            }
            else {
                this.nextPlay = this.lastFaced;
            }
        }
        if (this.type === 4) { // WSLS (Initial Coop)
            if (this.lastScore === temptation | this.lastScore === reward) {
                this.nextPlay = this.lastPlay;
            }
            else {
                if (this.lastPlay === 1) {
                    this.nextPlay = 2;
                }
                else {
                    this.nextPlay = 1;
                }
            }
        }
        if (this.type === 5) { // WSLS (Initial Defect)
            if (this.lastScore === temptation | this.lastScore === reward) {
                this.nextPlay = this.lastPlay;
            }
            else {
                if (this.lastPlay === 2) {
                    this.nextPlay = 1;
                }
                else {
                    this.nextPlay = 2;
                }
            }
        }
        if (this.type === 6) { // TFTD (Initial Defect)
            if (this.lastFaced === -1) {
                this.nextPlay = 2;
            }
            else {
                this.nextPlay = this.lastFaced;
            }
        }
        if (this.type === 7) { // TRGC (Initial Cooperate)
            if (this.lastFaced === 2 || this.lastPlay === 2) {
                this.nextPlay = 2;
            }
            else {
                this.nextPlay = 1;
            }
        }
        if (this.type === 8) { // TRGD (Initial Defect)
            if (this.lastFaced === 1 || this.lastPlay === 1) {
                this.nextPlay = 1;
            }
            else {
                this.nextPlay = 2;
            }
        }
        this.lastPlay = this.nextPlay;
    }
}

/* window.addEventListener('click', 
    function(event) {
        iterate();
}) */

window.addEventListener('keydown',
    function(event) {
        if (event.keyCode === 32) {
            play();
        }
        else if (event.keyCode === 13) {
            nextGen();
        }
        else if (event.keyCode === 39 | event.keyCode === 73) {
            iterate();
        }
        else if (event.keyCode === 82) {
            reset();
        }
})

ALLCSlider.oninput = function() {
    propALLC = parseInt(this.value);
    ALLCSlider.parentElement.children[2].innerHTML = propALLC;
}
ALLDSlider.oninput = function() {
    propALLD = parseInt(this.value);
    ALLDSlider.parentElement.children[2].innerHTML = propALLD;
}
TFTCSlider.oninput = function() {
    propTFTC = parseInt(this.value);
    TFTCSlider.parentElement.children[2].innerHTML = propTFTC;
}
WSLSCSlider.oninput = function() {
    propWSLSC = parseInt(this.value);
    WSLSCSlider.parentElement.children[2].innerHTML = propWSLSC;
}
WSLSDSlider.oninput = function() {
    propWSLSD = parseInt(this.value);
    WSLSDSlider.parentElement.children[2].innerHTML = propWSLSD;
}
TFTDSlider.oninput = function() {
    propTFTD = parseInt(this.value);
    TFTDSlider.parentElement.children[2].innerHTML = propTFTD;
}
TRGCSlider.oninput = function() {
    propTRGC = parseInt(this.value);
    TRGCSlider.parentElement.children[2].innerHTML = propTRGC;
}
TRGDSlider.oninput = function() {
    propTRGD = parseInt(this.value);
    TRGDSlider.parentElement.children[2].innerHTML = propTRGD;
}

killSlider.oninput = function() {
    killPercent = parseInt(this.value)/100;
    killSlider.parentElement.children[2].innerHTML = Math.round(killPercent*100);
}

temptationSlider.oninput = function() {
    temptation = parseInt(this.value);
    temptationSlider.parentElement.children[2].innerHTML = temptation;
}
rewardSlider.oninput = function() {
    reward = parseInt(this.value);
    rewardSlider.parentElement.children[2].innerHTML = reward;
}
punishmentSlider.oninput = function() {
    punishment = parseInt(this.value);
    punishmentSlider.parentElement.children[2].innerHTML = punishment;
}
suckerSlider.oninput = function() {
    sucker = parseInt(this.value);
    suckerSlider.parentElement.children[2].innerHTML = sucker;
}
 
function generatePlayer(type) {
    var newPlayer = new Player(type);
    return newPlayer;
}

// Draws everything
function drawAll() {
    c.clearRect(0, 0, innerWidth, innerHeight);
    drawGraph();
    drawMatrixImg();
}

// Draws payoff matrix image
function drawMatrixImg() {
    c.drawImage(payoffMatrixImg, graphWindowLeft, spacing, canvas.width/3-spacing, canvas.height*9/24);
}

// Draws graph
function drawGraph() {
    let graphScaleY = (graphWindowTop-graphWindowBottom)/numPlayers;
    let graphScaleX = (graphWindowRight-graphWindowLeft)/(iterations);
    c.strokeStyle = "black";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowTop);
    c.lineTo(graphWindowLeft,graphWindowBottom);
    c.lineTo(graphWindowRight,graphWindowBottom);
    c.stroke();
    if (iterations === 0) {
        return;
    }
    c.strokeStyle = "green";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p1Record[0]);
    for (var i = 1; i < p1Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p1Record[i]);
    }
    c.stroke();
    c.strokeStyle = "red";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p2Record[0]);
    for (var i = 1; i < p2Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p2Record[i]);
    }
    c.stroke();
    c.strokeStyle = "orange";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p3Record[0]);
    for (var i = 1; i < p3Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p3Record[i]);
    }
    c.stroke();
    c.strokeStyle = "blue";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p4Record[0]);
    for (var i = 1; i < p4Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p4Record[i]);
    }
    c.stroke();
    c.strokeStyle = "purple";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p5Record[0]);
    for (var i = 1; i < p5Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p5Record[i]);
    }
    c.stroke();
    c.strokeStyle = "palevioletred";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p6Record[0]);
    for (var i = 1; i < p6Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p6Record[i]);
    }
    c.stroke();
    c.strokeStyle = "turquoise";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p7Record[0]);
    for (var i = 1; i < p7Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p7Record[i]);
    }
    c.stroke();
    c.strokeStyle = "brown";
    c.beginPath();
    c.moveTo(graphWindowLeft,graphWindowBottom+graphScaleY*p8Record[0]);
    for (var i = 1; i < p8Record.length; i++) {
        c.lineTo(graphWindowLeft+graphScaleX*i,graphWindowBottom+graphScaleY*p8Record[i]);
    }
    c.stroke();
}

// Shuffles array
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Resets player internal values
function resetPlayers() {
    for (var i = 0; i < players.length; i++) {
        players[i].score = 0;
        players[i].nextPlay = -1;
        players[i].lastPlay = -1; 
        players[i].lastFaced = -1; 
        players[i].lastScore = undefined;
    }
}   

// Counts players by type, records
function countPlayerTypes() {
    count = new Array(numTypes).fill(0);
    for (var i = 0; i < numPlayers; i++) {
        count[players[i].type-1]++;
    }
    p1Record.push(count[0]);
    p2Record.push(count[1]);
    p3Record.push(count[2]);
    p4Record.push(count[3]);
    p5Record.push(count[4]);
    p6Record.push(count[5]);
    p7Record.push(count[6]);
    p8Record.push(count[7]);
    //console.log("Defectors: "+defectors+" Cooperators: "+cooperators);
}

// Generates connections between players
function connect() {
    for (var i = 0; i < players.length; i++) {
        while (players[i].connectedTo === undefined) {
            var opponent = players[Math.floor(players.length*Math.random())];
            if (opponent.connectedTo === undefined && opponent !== players[i]) {
                players[i].connectedTo = opponent;
                opponent.connectedTo = players[i];
            }
        }
    }
}
 
// Connects players if unconnected and then runs one play of PD
function play() {
    drawAll();
    if (players[0].connectedTo === undefined) {
        connect();
    }
    for (var i = 0; i < players.length; i++) {
        players[i].updateStrategy();
    }
    for (var i = 0; i < players.length; i++) {
        players[i].updateScore();
    }
    for (var i = 0; i < players.length; i++) {
        players[i].scoredState = false;
    }
}

// Logs generation, kills weak, repopulates
function nextGen() {
    for (var i = 0; i < players.length; i++) {
        players[i].connectedTo = undefined;
    }
    iterations++;
    players.sort(compare);
    // Kill
    for (var i = 0; i < killNum; i++) {
        players.shift();
    }
    // Repopulate
    shuffle(players);
    // AS OF NOW RANDOM PLAYERS REPOPULATE FIRST, MAY WANT TO CHANGE TO HIGHEST SCORE FIRST
    while (players.length < numPlayers) {
        for (var j = 0; j < surviveNum; j++) {
            if (players.length < numPlayers) {
                players.push(generatePlayer(players[j].type));
            }
        }
    }
    resetPlayers();
    countPlayerTypes();
    drawAll();
}

// Ensures that players with same scores are sorted randomly before killing
function compare(a,b) {
    let scoreDif = a.score - b.score;
    if (scoreDif !== 0) {
        return scoreDif;
    }
    else {
        return Math.random() - 0.5;
    }
}

// Removes player from player list
function removeObj(obj) {
    var index;
    for (var i = 0; i < players.length; i++) {
        if (players[i] === obj) {
            index = i;
        }
    }
    return players.splice(index,1);
}

function mutate(type) {
    var randID = Math.floor(Math.random()*players.length);
    players[randID].type = type;
    drawAll();
}

// Runs through one generation (consisting of 25 plays)
function iterate() {
    iterating = true;
    for (var i = 0; i < 25; i++) {
        play();
    }
    nextGen();
    iterating = false;
}

function reset() {
    players = [];
    iterations = 0;
    p1Record = [];
    p2Record = [];
    p3Record = [];
    p4Record = [];
    p5Record = [];
    p6Record = [];
    p7Record = [];
    p8Record = [];

    killNum = Math.floor(killPercent*numPlayers);
    surviveNum = numPlayers - killNum;

    var propSum = propALLD+propALLC+propTFTC+propWSLSC+propWSLSD+propTFTD+propTRGC+propTRGD;
    var numALLC = Math.round(propALLC/propSum*numPlayers);
    var numALLD = Math.round(propALLD/propSum*numPlayers);
    var numTFTC = Math.round(propTFTC/propSum*numPlayers);
    var numWSLSC = Math.round(propWSLSC/propSum*numPlayers);
    var numWSLSD = Math.round(propWSLSD/propSum*numPlayers);
    var numTFTD = Math.round(propTFTD/propSum*numPlayers);
    var numTRGC = Math.round(propTRGC/propSum*numPlayers);
    var numTRGD = Math.round(propTRGD/propSum*numPlayers);

    var typeNums = [numALLC,numALLD,numTFTC,numWSLSC,numWSLSD,numTFTD,numTRGC,numTRGD];
    var typesChosen = [];
    for (var i = 0; i < 5; i++) {
        if (typeNums[i] !== 0) {
            typesChosen.push(i+1);
        }
    }
    shuffle(typesChosen);

    for (var i = 0; i < numALLC; i++) {
        players.push(generatePlayer(1));
    }
    for (var i = 0; i < numALLD; i++) {
        players.push(generatePlayer(2));
    }
    for (var i = 0; i < numTFTC; i++) {
        players.push(generatePlayer(3));
    }
    for (var i = 0; i < numWSLSC; i++) {
        players.push(generatePlayer(4));
    }
    for (var i = 0; i < numWSLSD; i++) {
        players.push(generatePlayer(5));
    }
    for (var i = 0; i < numTFTD; i++) {
        players.push(generatePlayer(6));
    }
    for (var i = 0; i < numTRGC; i++) {
        players.push(generatePlayer(7));
    }
    for (var i = 0; i < numTRGD; i++) {
        players.push(generatePlayer(8));
    }

    // Adds extra players if rounding cuts off from reaching numPlayers
    while (players.length < numPlayers) {
        players.push(generatePlayer(typesChosen[0]));
    }

    // Removes any players over total number, randomly
    shuffle(players);
    while (players.length > numPlayers) {
        players.pop();
    }

    countPlayerTypes();
    drawAll();
}

// Spacing Variables
let spacing = canvas.height/12;
let playerWindowDefault = spacing;
let playerWindowRight = 2*canvas.width/2+spacing/2;
let graphWindowLeft = 2*canvas.width/3+spacing/2;
let graphWindowTop = canvas.height/2+spacing/2;
let graphWindowRight = canvas.width-spacing;
let graphWindowBottom = canvas.height-spacing;
let playerBoundary = 20;

// Gamestate Variables
let numPlayers = 1000;
let numTypes = 8;
var killPercent = 0.50; // Between 0 and 1
var killNum = Math.floor(killPercent*numPlayers);
var surviveNum = numPlayers - killNum;

let iterating = false;

// Interactivity Variables
let propALLD = 2;
let propALLC = 2;
let propTFTC = 0;
let propWSLSC = 0;
let propWSLSD = 0;
let propTFTD = 0;
let propTRGC = 0;
let propTRGD = 0;

// Payoff Variables
// T > R > P > S
var temptation = 0;
var reward = -1;
var punishment = -2;
var sucker = -3;

// Initialization variables
var players = [];
var iterations = 0;
var p1Record = [];
var p2Record = [];
var p3Record = [];
var p4Record = [];
var p5Record = [];
var p6Record = [];
var p7Record = [];
var p8Record = [];

reset();

var test_text = "test";

var textFile = null,
makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
};

let download_button = document.getElementById('download-button');
let file_name_input = document.getElementById('file-name-input'); 

download_button.addEventListener('click', function () {
    var link = document.createElement('a');
    link.setAttribute('download', file_name_input.value+'.txt');
    //link.href = makeTextFile('ALLC '+p1Record.toString()+'\nALLD '+p2Record.toString()+'\nTFTC '+p3Record.toString()+'\nTFTD '+p6Record.toString()+'\nWSLSC '+p4Record.toString()+'\nWSLSD '+p5Record.toString()+'\nTRGC '+p7Record.toString()+'\nTRGD '+p8Record.toString());
    link.href = makeTextFile(''+p1Record.toString()+'\n'+p2Record.toString()+'\n'+p3Record.toString()+'\n'+p6Record.toString()+'\n'+p4Record.toString()+'\n'+p5Record.toString()+'\n'+p7Record.toString()+'\n'+p8Record.toString());
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });

    if (file_name_input.value.slice(-2,-1)==="_") {
        let num = parseInt(file_name_input.value.slice(-1))+1
        file_name_input.value = file_name_input.value.slice(0,-1)+num;
    }
}, false);
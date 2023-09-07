const Maze = document.querySelector("#mazeBoard");
const planche = Maze.getContext("2d");
const generateBtn = document.querySelector("#generate")
const largeur = Maze.width;
const hauteur = Maze.height;
const mazeBackground = "black";
const cellLine = "white";
const nb = 10;
const cellSize = hauteur / nb;
let cellZ = new Array(nb).fill(0).map(()=> new Array(nb).fill(0))
let running = false 
const scoreVal = document.querySelector("#scoreValue");
let score = 0
const timerVal = document.querySelector("#timerValue")
let startTime;
generateBtn.addEventListener("click", generateNew)


// Définissez les propriétés de la ligne (couleur, épaisseur, etc.)

class AlgoLab {
    constructor(mazeheight, mazewidth) {
        //this.random = new Random();
        this.mazeWidth = mazewidth;
        this.mazeHeight = mazeheight;
    }
    
    getNeighbour(cell, listMod) {
        let neighbours = [];
        if (cell.column > 0) {
            if (!listMod[cell.row][cell.column - 1].visited) {
                neighbours.push(listMod[cell.row][cell.column - 1]);
                
            }
        }
        if (cell.column < this.mazeWidth - 1) {
            if (!listMod[cell.row][cell.column + 1].visited) {
                neighbours.push(listMod[cell.row][cell.column + 1]);
            }
        }
        if (cell.row > 0) {
            if (!listMod[cell.row - 1][cell.column].visited) {
                neighbours.push(listMod[cell.row - 1][cell.column]);
            }
        }
        if (cell.row < this.mazeHeight - 1) {
            if (!listMod[cell.row + 1][cell.column].visited) {
                neighbours.push(listMod[cell.row + 1][cell.column]);
            }
        }

        if (neighbours.length > 0) {
            const index = Math.floor(Math.random()* neighbours.length)//this.random.nextInt(neighbours.length);
            return neighbours[index];
        }
        return null;
    }

    removeWall(cellCurrent, cellNext) {
        if (cellCurrent.row === cellNext.row + 1 && cellCurrent.column === cellNext.column) {
            cellCurrent.topWall = false;
            cellNext.bottomWall = false;
        }
        if (cellCurrent.row === cellNext.row - 1 && cellCurrent.column === cellNext.column) {
            cellCurrent.bottomWall = false;
            cellNext.topWall = false;
        }
        if (cellCurrent.row === cellNext.row && cellCurrent.column === cellNext.column - 1) {
            cellCurrent.rightWall = false;
            cellNext.leftWall = false;
        }
        if (cellCurrent.row === cellNext.row && cellCurrent.column === cellNext.column + 1) {
            cellCurrent.leftWall = false;
            cellNext.rightWall = false;
        }
    }

    createMaze(startY, startX, cellssss) {
        let stack = [];
        let current;
        let next;
        
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                cellssss[y][x] = new Cell(y, x);
            }
        }

        current = cellssss[startY][startX];
        current.visited = true;

        do {
            next = this.getNeighbour(current, cellssss);
            if (next != null) {
                this.removeWall(current, next);
                stack.push(current);
                current = next;
                current.visited = true;

                
            } else {
                current = stack.pop();
            }
        } while (stack.length > 0);

    }
}

class Labyrinthe extends AlgoLab{
    constructor(mazeHeight, mazeWidth, cells){
        super(mazeHeight, mazeWidth)
        this.listecells = cells;
    }

    generateMaze(starty, startx){
        super.createMaze(starty, startx, this.listecells)
    }

    
}

class Cell{
    topWall = true ;
    bottomWall = true ;
    leftWall = true ;
    rightWall = true ;
    visited = false ;

    constructor(row, column) {
        this.row = row
        this.column = column
    }

    updateWalls(objet){
        this.bottomWall = objet.bottomWall;
        this.topWall = objet.topWall;
        this.rightWall = objet.rightWall;
        this.leftWall = objet.leftWall;
        this.row = objet.row;
        this.column = objet.column;
    }
    
    reset(a,b){
        this.row = a
        this.column = b
    }

}

class Player extends Cell{
    paint = "red"
    constructor(row, column){
        super(row, column)
        
    }

    draw() {
        planche.fillStyle = this.paint;
        planche.fillRect(this.column * cellSize, this.row * cellSize, cellSize, cellSize);
    }

    movePlayer(deltaX, deltaY, cellss){
        if(this.column + deltaX >= 0 && this.column + deltaX < cellss[0].length){
            if(deltaX > 0 && !this.rightWall){
                this.updateWalls(cellss[this.row][this.column + deltaX])
            }
            if( deltaX < 0 && !this.leftWall){
                this.updateWalls(cellss[this.row][this.column + deltaX])
            }
        }

        if ( this.row + deltaY >= 0 && this.row + deltaY < cellss.length){
            if(deltaY > 0 && !this.bottomWall){
                this.updateWalls(cellss[this.row + deltaY][this.column])
            }
            if(deltaY < 0 && !this.topWall){
                this.updateWalls(cellss[this.row + deltaY][this.column] )
            }
        }
        this.draw();
    }
      
}

class Exit extends Cell{
    paint = "green"
    constructor(row, column){
        super(row, column)
    }

    draw(){
        planche.fillStyle = this.paint
        planche.fillRect(this.column *cellSize, this.row*cellSize, cellSize, cellSize)
    }
}
const joueur = new Player(nb-1, Math.floor(Math.random()*10))
const sortie = new Exit(0, Math.floor(Math.random()*10))

main();

function main(){
    //scoreVal.textContent = score;
    initializeMaze();
    drawAll();   
    IDPlayerAndExit();
    startTime = Date.now()
    nextTick();
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            PlayerOnExit();
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000; // Temps écoulé en secondes
            timerVal.textContent = "Temps : " + elapsedTime.toFixed(2) + " s";
            nextTick();
            console.log("hello");
        }, 75);
    }else{
        displayGameOver();
    }
};

function displayGameOver(){
    if(score == 0){
        planche.font = "70px MV Boli";
        planche.fillStyle = "white";
        planche.textAlign = "center";
        planche.fillText("Generate New!", largeur/2, hauteur/2);
    }else{
        planche.font = "70px MV Boli";
        planche.fillStyle = "white";
        planche.textAlign = "center";
        planche.fillText("GAME OVER!", largeur/2, hauteur/2);
        //running = false;
    }
    
};

function drawAll(){
    drawBackground();
    drawMaze();
}

function drawBackground(){
    planche.fillStyle = mazeBackground; 
    planche.fillRect(0,0, largeur, hauteur)
}

function initializeMaze(){
    let qsdf = new Labyrinthe(nb, nb, cellZ)
    qsdf.generateMaze(nb-1, nb-1)
}

function PlayerOnExit(){
    if(joueur.row == sortie.row && joueur.column == sortie.column){
        score +=1;
        //scoreVal.textContent = score;
        running = false
        window.removeEventListener("keydown", direction)
    }
}

function IDPlayerAndExit(){
    joueur.updateWalls(cellZ[joueur.row][joueur.column])
    joueur.draw();
    sortie.draw();
}

function direction(event){
    const keypressed = event.keyCode;
    const LEFT = 81;
    const RIGHT = 68;
    const DOWN = 83;
    const UP = 90;
    drawAll()
    if(running){
        switch (true) {
            case (keypressed == LEFT):
                joueur.movePlayer(-1,0, cellZ)
                break;
            case (keypressed == RIGHT):
                joueur.movePlayer(1,0, cellZ)
                break;
            case (keypressed == UP):
                joueur.movePlayer(0, -1, cellZ)
                break;
            case (keypressed == DOWN):
                joueur.movePlayer(0, 1, cellZ)
                break ;
        }
        sortie.draw()
    }
    console.log(running);
}
    
window.addEventListener("keydown", direction)

function dessinerMaze(x, y){
    if(cellZ[y][x].topWall){
        dessinerLigne(x * cellSize, (x+1)*cellSize, y * cellSize, y*cellSize)
    }
    if(cellZ[y][x].leftWall){
        dessinerLigne(x * cellSize, (x)*cellSize, y * cellSize, (y+1)*cellSize)
    }
    if(cellZ[y][x].bottomWall){
        dessinerLigne(x * cellSize, (x+1)*cellSize, (y+1) * cellSize, (y+1)*cellSize)
    }
    if(cellZ[y][x].rightWall){
        dessinerLigne((x+1) * cellSize, (x+1)*cellSize, y * cellSize, (y+1)*cellSize)
    }
      
}

function drawMaze(){
    for(let y = 0; y< cellZ.length; y++ ){
        for(let x = 0; x < cellZ[0].length; x++){
            dessinerMaze(x, y)
        }
    }
}

function dessinerLigne(xDebut, xFin, yDebut, yFin){
    planche.strokeStyle = cellLine; 
    planche.lineWidth = 3; 

    planche.beginPath();
    planche.moveTo(xDebut, yDebut); 
    planche.lineTo(xFin, yFin); 
    planche.stroke(); 
}

function generateNew(){
    score = 0;
    joueur.reset(nb-1, Math.floor(Math.random()*10))
    sortie.reset(0, Math.floor(Math.random()*10))
    joueur.updateWalls(cellZ[joueur.row][joueur.column]);
    sortie.updateWalls(cellZ[sortie.row][sortie.column]);
    running = true;
    main();
    window.addEventListener("keydown", direction);
};
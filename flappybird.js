let board;
let boardHeight = 640;
let boardWidth = 360;
let context;


let birdHeight = 34;
let birdWidth = 44;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let bird = {
  x : birdX,
  y : birdY,
  width: birdWidth,
  height: birdHeight
}

window.onload = function() {
  board = document.getElementById("board")
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image()
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";


  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0,0, board.width, board.height);

  //bird
  // bird.y += velocityY;  
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0)
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipe    
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 1
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }

  }

  //score
  context.fillStyle = "white";
  context.font="45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 40, 180);
    context.font="45px sans-serif";
  }
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -1  ; //pipe moving speed
let velocityY = 0; //bird jump speed
let gravity = 0.1;

let gameOver = false;
let restartDelay = false;


function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);

  openingSpace = board.height/4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  }

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  }

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "KeyW") {
    if (gameOver && !restartDelay) {
      velocityY = -4;
      restartGame();
    } else {
      velocityY = -4;
    }
    }
  }


function restartGame() {
  if (gameOver) {
    bird.y = birdY;
    pipeArray = []
    score = 0;
    gameOver = false;

    restartDelay = true;
    setTimeout(() => {
      restartDelay = false;
    }, 1000);
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width && 
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

}
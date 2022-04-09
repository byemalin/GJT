var screen = 0;

var speed = 1;
var x;
var y;
var colorPicker;

let shared;

function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "Grid-Click", "main");
  shared = partyLoadShared("globals");
}

function setup() {
  var mainCanvas = createCanvas(800, 800);
  mainCanvas.parent("canvasdiv");
  //Toggle Server Info
  partyToggleInfo(false);
  toggle = document.getElementById('toggle');

  //player 1 score
  shared.score1 = shared.score1 || 0;
  //player 2 score
  shared.score2 = shared.score2 || 0;

  if(partyIsHost()){
    partySetShared(shared,{
        hostStart: false,
        hostRestart: false
    });
  }
}

function draw() {
  background(96, 157, 255);
  // switch(screen){
  //   case 1:
  //     waitForHost();
  //     break;
  //   case 2:
  //     gameOn();
  //     break;
  //   case 3:
  //     gameOver(); 
  //   default:
  //     startScreen();
  //     break;
  // }
  // // Display the contents of the current screen
  if (screen == 0) {
    startScreen();
  } else if (screen == 1) {
    waitForHost();
    // if the screen variable was changed to 2, show the game over screen
  } else if (screen == 2) {
    gameOn();
  }
  else if(screen == 3){
    gameOver();
  }
}

function mousePressed() {
  if (screen == 0) {
    screen = 1;
  }
  else if(screen == 1){
    screen == 2;
  }
  
  else if (screen == 2) {
    if (
      mouseX > x &&
      mouseX < x + 50 &&
      mouseY > y &&
      mouseY < y + 50
    ) {
// the size parameters in this^ if statement may need to change based on the new sprites

      if (colorPicker == 0) {
        // red click = game over
        screen = 3;
      } else {
        //speed is controlled locally
        speed += 0.05;
        console.log(speed);
        if (partyIsHost()) {
          //player 1 adds their score
          shared.score1 += 1;
        } else if (!partyIsHost()) {
          //player 2 adds their score
          shared.score2 += 1;
        }
      }
    }
  } else if (screen == 3) {
    screen = 0;
  }
}

function startScreen() {
  textSize(30);

  fill(255);
  textAlign(CENTER);
  text("GJT Wac-A-Mole",width/2,height/2 + 20);
  text("Click to begin", width/2, height/2 + 60);
  // text("WELCOME SCREEN HERE", width / 2, height / 2);
  // text(
  //   "Feel free to change the scene code method of course!",
  //   width / 2,
  //   height / 2 + 20
  // );
  reset();
}

function waitForHost(){
  textSize(40);
  fill(255);
  if(partyIsHost()){
    text("You are the Host", 250, 250);
    text("Press ENTER to begin", 250, 300);
    text("when everyone is ready", 250, 350);
    //enter
    if(keyCode == 13){
      shared.hostStart = true;
      shared.score1 = 0;
      shared.score2 = 0;
      scene = 2;
    }
  }
  else if(!partyIsHost()){
    text("Waiting for the host", 250, 250);
    if(shared.hostStart == true){
      scene = 2;
    }
  }
}

function gameOn() {
    x = random(0, width);
    y = random(0, height);
  
  //frame rate is based on how many points you have basically, so it gets harder as u progress
  frameRate(speed);
  background(220);

  //keep text black
  fill(0);
  textAlign(LEFT);
  text("Player 1: " + shared.score1, 20, 20);
  text("Player 2: " + shared.score2, width-80, 20);

  //Random colour selector:
    //Would replace this with something for the sprites
  
  colorPicker = floor(random(3));
  //conditional changes the fill based on the colorPicker variable
  if (colorPicker == 0) {
    fill(255, 0, 0);
  } else if (colorPicker == 1) {
    fill(0, 255, 0);
  } else {
    fill(0, 0, 255);
  }
  //shape is drawn
  rect(x, y, 40, 40);

}

function gameOver() {
  background(150);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2);
  text("Player 1: " + shared.score1, width / 2, height / 2 + 20);
  text("Player 2: " + shared.score2, width / 2, height / 2 + 40);
  text("click to play again", width / 2, height / 2 + 60);
}

function reset() {
  speed = 1;
  //host resets scores
  if (partyIsHost()) {
    shared.score1 = 0;
    shared.score2 = 0;
  }
}

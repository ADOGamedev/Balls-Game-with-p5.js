
const MIN_BALL_VEL = -5;
const MAX_BALL_VEL =  5;

const MIN_BALL_SIZE = 10;
const MAX_BALL_SIZE = 49;

const BALL_INITIAL_OFFSET = 40;

const BG_TRANSPARENCY = 50;

const WHITE = 255;
const BLACK = 0;

let balls = [];
let ballCount = 19000;

let projectiles = [];
let projectileCount = 0;

let playerPos;

let playerHealth = 100;
let playerTimeLeft = 30;

class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    let lenght = Math.sqrt(this.x*this.x + this.y*this.y);
    this.x /= lenght;
    this.y /= lenght;
  }

  lenght() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  copy() {
    return new Vector(this.x, this.y);
  }
}

class Ball {
  constructor(posVector, velVector, size, color) {
    this.position = posVector;
    this.velocity = velVector;
    this.size = size;
    this.color = color;
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  addBalls();

  playerPos = new Vector(width / 2, height / 2);

  console.log(balls);
}

function addBalls() {
  for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
    let ballVelocity = new Vector(random(-5, 5), random(-5, 5));

    let newBall = new Ball( new Vector(width / 2, height / 2),
                            ballVelocity.copy(),
                            random(MIN_BALL_SIZE, MAX_BALL_SIZE),
                            randomColor() );
    
    balls[ballIndex] = newBall;
    
    ballVelocity.normalize();
    
    newBall.position.x += ballVelocity.x * BALL_INITIAL_OFFSET;
    newBall.position.y += ballVelocity.y * BALL_INITIAL_OFFSET;
  }
}

function randomColor() {
  return new Color(floor(random(256)), floor(random(256)), floor(random(256)));
} 

function draw() {
  if (gameOver()) {
    displayGameOver();
    displayTexts();
    drawHealthBar();
    return;
  }

  background(BLACK, BG_TRANSPARENCY);

  updateTime();

  updateAndDrawBalls();
  updateAndDrawProjectiles();
  
  drawHealthBar();

  displayTexts();

  drawPlayer();
}

function updateAndDrawBalls() {
  for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
    let ball = balls[ballIndex];

    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    handleBounce(ball);

    noStroke();
    fill(ball.color.r, ball.color.g, ball.color.b);

    ellipse(ball.position.x, ball.position.y, ball.size, ball.size);

    handlePlayerCollision(ballIndex);
  }
}

function updateAndDrawProjectiles() {
  for (let projectileIndex = 0; projectileIndex < projectileCount; projectileIndex++) {
    let projectile = projectiles[projectileIndex];

    projectile.position.x += projectile.velocity.x;
    projectile.position.y += projectile.velocity.y;
    
    noStroke();
    fill(projectile.color.r, projectile.color.g, projectile.color.b);

    ellipse(projectile.position.x, projectile.position.y, projectile.size, projectile.size);

    handleBallCollisions(projectileIndex);
  }
}

function drawHealthBar() {
  fill(BLACK);
  stroke(WHITE);

  rect(10, 10, 300, 30);

  fill(240, 20, 50);
  rect(10, 10, 3 * playerHealth, 30);
}

function drawPlayer() {
  fill(WHITE);
  
  let triangleAngle = -Math.atan2(playerPos.x - mouseX, playerPos.y - mouseY);
  
  translate(playerPos.x, playerPos.y);
  rotate(triangleAngle);
  
  triangle(0, -20, 10, 20, -10, 20);
}

function handleBounce(ball) {
  let bottomPos = height - ball.size / 2;
  let rightPos = width - ball.size / 2;
  let topPos = ball.size / 2;
  let leftPos = ball.size / 2;

  if (ball.position.x < leftPos || ball.position.x > rightPos) {
    ball.position.x -= ball.velocity.x;
    ball.velocity.x *= -1;
  }

  if (ball.position.y < topPos || ball.position.y > bottomPos) {
    ball.position.y -= ball.velocity.y;
    ball.velocity.y *= -1;
  }
}

function handlePlayerCollision(ballIndex) {
  let ball = balls[ballIndex];
  let vector_to_triangle = new Vector(playerPos.x - ball.position.x, playerPos.y - ball.position.y);

  if (vector_to_triangle.lenght() <= ball.size / 2) {
    balls.splice(ballIndex, 1);
    ballCount--;

    playerHealth -= 10;

    if (playerHealth < 0) {
      playerHealth = 0;
    }
  }
}

function handleBallCollisions(projectileIndex) {
  let projectile = projectiles[projectileIndex];

  for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
    let ball = balls[ballIndex];
    let difference_vector = new Vector(projectile.position.x - ball.position.x, projectile.position.y - ball.position.y);

    if (difference_vector.lenght() <= (projectile.size + ball.size) / 2) {
      balls.splice(ballIndex, 1);
      projectiles.splice(projectileIndex, 1);
      ballCount--;
      projectileCount--;

      playerHealth++;
      playerTimeLeft++;

      if (playerHealth > 100) {
        playerHealth = 100;
      }

      break;
    }
  }
}

function updateTime() {
  playerTimeLeft -= deltaTime / 1000;

  if (playerTimeLeft < 0) {
    playerTimeLeft = 0;
  }
}

function displayTexts() {
  noStroke();
  fill(0);
  rect(width / 2 - 125, 0, 260, 50);

  fill(WHITE);
  textSize(24);
  textStyle(ITALIC);

  text(`Balls left: ${ballCount}`, width / 2 - 70, 20);
  text(`Time left: ${Math.ceil(playerTimeLeft)}`, width / 2 - 70, 40);
}

function gameOver() {
  return playerTimeLeft <= 0 || playerHealth <= 0;
}

function displayGameOver() {
  noStroke();
  fill(0);
  rect(width / 2 - 140, height / 2 - 75, 350, 120);

  fill(230, 30, 50);
  textSize(54);
  textStyle(BOLD);

  text("Game Over", width / 2 - 110, height / 2);
}

function mouseClicked() {
  let velocity_vector = new Vector((mouseX - playerPos.x), (mouseY - playerPos.y));
  velocity_vector.normalize();
  velocity_vector.x *= 5;
  velocity_vector.y *= 5;

  projectiles.push( new Ball(new Vector(width / 2, height / 2),
                    velocity_vector,
                    15,
                    new Color(WHITE, WHITE, WHITE)) );
  
  projectileCount++;
}
  


// INSTRUCTIONS

// -- You can figure out your own solutions to all this tasks -- //

// Make random-colored, random-velocity and random-sized balls that bounce all over the screen:

  // Use and array to store all the balls
    // It it recomended to do a class Ball to store the velocity, position, size and color of each ball.
    // Addicionaly you can create a Vector class, it will come handly for storing pairs of values and doing some math with them.
  
  // Then, in each frame, update the position fo each ball adding that ball's velocity.
  // Calculate bounces, detecting if the ball is touching a border and flip its velocity components accordingly.


// Create a triangle in the center of the canvas. Make it rotate following the mouse position.
// References:
  // https://p5js.org/reference/p5/rotate/ //
  // https://p5js.org/reference/p5/mouseX/ //
  // https://p5js.org/reference/p5/mouseY/ //
// Examples: 
  // https://p5js.org/examples/angles-and-motion-aim/ //
  // https://editor.p5js.org/lliu29/sketches/NeGyR6QJ //

// When clicked, launch a ball in the direction your turret is pointing
  // https://p5js.org/reference/p5/mousePressed/ //
  // https://p5js.org/reference/p5/mouseClicked/ //

// If your "projectile" class ball touches a normal ball, make it disappear.
// Classes:
  //https://p5js.org/reference/p5/class/
  
// Example of collision:
  // https://editor.p5js.org/dfeusse/sketches/H1vD7NQjb

// EXTRA CHALLENGES:
  // Add a counter of remaining balls to the screen

  // Add a health bar that decreases if a ball hits the turret. If 0: Game Over.

  // Add a 30-second countdown. If 0: Game Over.
  // Example:
    // https://editor.p5js.org/codingtrain/sketches/ZKSNy0USh
  // The player gains time by destroying certain balls
  // The player gains health by destroying certain balls
  // Instead of disappearing, make it subdivide into smaller balls.
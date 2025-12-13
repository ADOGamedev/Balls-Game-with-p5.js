INSTRUCTIONS

-- You can figure out your own solutions to all this tasks --

Make random-colored, random-velocity and random-sized balls that bounce all over the screen:

  Use and array to store all the balls
    It it recomended to do a class Ball to store the velocity, position, size and color of each ball.
    Addicionaly you can create a Vector class, it will come handy for storing pairs of values and doing some math with them.
  
  Then, in each frame, update the position for each ball adding that ball's velocity.
  Calculate bounces, detecting if the ball is touching a border and fliping its velocity components accordingly.


Create a triangle in the center of the canvas. Make it rotate following the mouse position.
References:
  https://p5js.org/reference/p5/rotate/
  https://p5js.org/reference/p5/mouseX/
  https://p5js.org/reference/p5/mouseY/
Examples: 
  https://p5js.org/examples/angles-and-motion-aim/
  https://editor.p5js.org/lliu29/sketches/NeGyR6QJ

When clicked, launch a ball in the direction your turret is pointing
  https://p5js.org/reference/p5/mousePressed/
  https://p5js.org/reference/p5/mouseClicked/

If your "projectile" class ball touches a normal ball, make both disappear.
Classes:
  //https://p5js.org/reference/p5/class/
  
Example of collision:
  https://editor.p5js.org/dfeusse/sketches/H1vD7NQjb

EXTRA CHALLENGES:
  Add a counter of remaining balls to the screen

  Add a health bar that decreases if a ball hits the turret. If 0: Game Over.

  Add a 30-second countdown. If 0: Game Over.
  Example:
    https://editor.p5js.org/codingtrain/sketches/ZKSNy0USh
  The player gains time by destroying certain balls
  The player gains health by destroying certain balls
  Instead of disappearing, make it subdivide into smaller balls.

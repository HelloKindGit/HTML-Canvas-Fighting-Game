//main canvas
const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 576;

//canvas context
const c = canvas.getContext('2d');
c.fillRect(0, 0, canvas.width, canvas.height);

//ingame gravity
const GRAVITY = 0.7;

//parent sprite class
class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      //passed from arguments
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  //draw sprites and hitbox when attacking
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //hitbox
    if (this.isAttacking) {
      c.fillStyle = 'green';
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  //update function, calls draw method
  update() {
    this.draw();
    //update hitbox positon with sprite positon
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }
  }

  //player attack
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.attacking = false;
    }, 100);
  }
}

//player
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

//enemy
const enemy = new Sprite({
  position: {
    x: 600,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: 50,
    y: 0,
  },
});

//control keys
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

//attack collision detection => return true or false
function collisionDetected({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

//animation of player and enemy
function animate() {
  //making infinite loop for animations
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
  }

  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
  }

  //player to enemy collision
  if (
    collisionDetected({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 10;
    document.querySelector('.enemyHealthBox-foreground').style.width = enemy.health + '%';
  }

  //enemy to player collision
  if (
    collisionDetected({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 10;
    document.querySelector('.playerHealthBox-foreground').style.width = player.health + '%';
  }
}

animate();

//press keys
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    //player keys
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -20;
      break;
    case ' ':
      player.attack();
      break;

    //enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown':
      enemy.attack();
      break;
  }
});

//release keys
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    //player keys
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    //enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});

//main canvas
const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 576;

//canvas context
const c = canvas.getContext('2d');
c.fillRect(0, 0, canvas.width, canvas.height);

//Display after timer runs out
const displayNotification = document.querySelector('.displayNotification');

//ingame gravity
const GRAVITY = 0.7;

//background sprite
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './gameAssets/background.png',
});

//player
const player = new Fighter({
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
const enemy = new Fighter({
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

decreaseTimer();

//animation of player and enemy
function animate() {
  //making infinite loop for animations
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
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

  //end game when health is 0
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
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

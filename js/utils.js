//attack collision detection => return true or false
function collisionDetected({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

//winner determination
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  displayNotification.style.display = 'flex';
  if (player.health === enemy.health) {
    displayNotification.innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    displayNotification.innerHTML = 'Player Won';
  } else if (player.health < enemy.health) {
    displayNotification.innerHTML = 'Enemy Won';
  }
}

//timer
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    document.querySelector('.timer').innerHTML = --timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

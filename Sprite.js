//parent sprite class
class Sprite {
  constructor({ position }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
  }

  //draw sprites
  draw() {}

  //update function
  update() {
    this.draw();
  }
}
//fighter class
class Fighter {
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

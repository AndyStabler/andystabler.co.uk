"use strict";

var Pos = function(x, y) {
  this.x = x;
  this.y = y;
}

// ALIEN
var Alien = function(pos) {
  this.pos = pos;
  this.width = 40;
  this.height = 65;
  this.healthStatus = new HealthStatus();
  this.alive = true;
  this.aliveImg = new Image();
  this.aliveImg.src = "http://media.tumblr.com/tumblr_lo57hxoqXA1qzdea9.png";
  this.deadImg = new Image();
  this.deadImg.src = "http://cf.geekdo-images.com/images/pic2296477_t.png";
  this.movingRight = true;
  this.offsetX = 0;
  this.offsetY = 0;
  this.maxOffset = 100;
  this.xStep = 5;
  this.yStep = 10;
  this.bullets = [];
}

Alien.prototype.draw = function(ctx) {
  if (this.healthStatus.alive) {
    ctx.drawImage(this.aliveImg, this.currentPosition().x, this.currentPosition().y, this.width, this.height);
  } else {
    ctx.drawImage(this.deadImg, this.currentPosition().x, this.currentPosition().y, this.width, this.height);
  }
}

Alien.prototype.step = function() {
  this.movingRight = (this.movingRight && this.offsetX <= this.maxOffset) ||
    (!this.movingRight && this.offsetX <= -this.maxOffset);
  this.offsetX += this.movingRight ? this.xStep : -this.xStep;
  if (this.offsetX >= this.maxOffset || this.offsetX <= -this.maxOffset) {
    this.offsetY += this.yStep;
  }
  for (var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].step();
  }
  if (Math.random() < 0.005)
    this.fire();
}

Alien.prototype.currentPosition = function() {
  return new Pos(this.pos.x + this.offsetX, this.pos.y + this.offsetY);
}

Alien.prototype.inBounds = function(pos, width, height) {
  var currentPosition = this.currentPosition();
  return this.healthStatus.alive && pos.x + width >= currentPosition.x && pos.x <= currentPosition.x + this.width &&
  pos.y <= currentPosition.y + this.height && pos.y + height >= currentPosition.y;
}

Alien.prototype.die = function() {
  this.healthStatus.die();
}

Alien.prototype.fire = function() {
  this.bullets.push(new Bullet(new Pos(this.currentPosition().x + this.width / 2, this.currentPosition().y), true));
}

var HealthStatus = function() {
  this.alive = true;
  this.dying = false;
  this.dead = false;
}

HealthStatus.prototype.die = function() {
  this.alive = false;
  this.dying = true;
  setTimeout(function() {
    this.dying = false; this.dead = true;
  }.bind(this), 1000);
}

// PLAYER
var Player = function(pos) {
  this.pos = pos;
  this.bullets = [];
  this.width = 100;
  this.height = 100;
  this.healthStatus = new HealthStatus();
  this.aliveImg = new Image();
  this.aliveImg.src = "/assets/images/me-illustration-3b460f0d.png";///"assets/img/me-illustration.png";
  this.deadImg = new Image();
  this.deadImg.src = "https://s-media-cache-ak0.pinimg.com/favicons/f4487df4c46951f0cbbd9e6e809f12c2136fbfe11ef03c932d29423a.png";
}

Player.prototype.draw = function(ctx) {
  ctx.drawImage(this.healthStatus.dying || this.healthStatus.dead ? this.deadImg : this.aliveImg, this.pos.x, this.pos.y, this.width, this.height)
}

Player.prototype.cleanupBullets = function() {
  this.bullets = this.bullets.filter(function(bullet) {
    return bullet.pos.y >= 0 && !bullet.dead;
  });
}

Player.prototype.inBounds = function(pos, width, height) {
  return pos.x + width >= this.pos.x && pos.x <= this.pos.x + this.width &&
  pos.y <= this.pos.y + this.height && pos.y + height >= this.pos.y;
}

Player.prototype.die = function() {
  this.healthStatus.die();
}

// BULLET
var Bullet = function(startPos, isEnemy = false) {
  this.pos = startPos;
  this.width = 50;
  this.height = 50;
  this.dead = false;
  this.isEnemy = isEnemy;
  this.enemyImg = new Image();
  this.enemyImg.src = "http://www.pngall.com/wp-content/uploads/2016/03/Cat-PNG-6.png";//"http://www.webweaver.nu/clipart/img/misc/food/desserts/cupcake.png";
  this.friendlyImg = new Image();
  this.friendlyImg.src = "https://d1v8u1ev1s9e4n.cloudfront.net/553f394d067d7b16d314af58";//"http://www.clipartlord.com/wp-content/uploads/2015/11/banana20.png"
}

Bullet.prototype.step = function() {
  this.pos.y -= this.isEnemy ? -this.stepValue() : this.stepValue();
}

Bullet.prototype.stepValue = function() {
  if (this.isEnemy) {
    return 5;
  }
  return 15;
}

Bullet.prototype.draw = function(ctx) {
  ctx.drawImage(this.isEnemy ? this.enemyImg : this.friendlyImg, this.pos.x - this.width / 2, this.pos.y, this.width, this.height);
}

// GAME
var Game = function(canvas) {
  this.canvas = canvas;
  this.canvas.canvas.onmousemove = this.mouseMove.bind(this);
  this.canvas.canvas.onclick = this.fire.bind(this);
  window.addEventListener("keydown", this.keydown.bind(this));
  this.init();
}

Game.prototype.init = function() {
  this.createAliens();
  this.player = new Player(new Pos(this.canvas.width / 2, this.canvas.height - 100));
  this.paused = false;
  this.points = 0;
}

Game.prototype.draw = function() {
  this.canvas.initCanvas();
  for (var i = 0; i < this.aliens.length; i++) {
    this.aliens[i].draw(this.canvas.ctx);
    for (var j = 0; j < this.aliens[i].bullets.length; j++) {
      this.aliens[i].bullets[j].draw(this.canvas.ctx);
    }
  }
  this.player.draw(this.canvas.ctx);
  for (var i = 0; i < this.player.bullets.length; i++) {
    this.player.bullets[i].draw(this.canvas.ctx);
  }
  this.canvas.ctx.font = "20px Arial"
  this.canvas.ctx.fillStyle = "white"
  this.canvas.ctx.fillText("Score: " + this.points, 50, 50)
}

Game.prototype.drawEndScreen = function() {
  this.canvas.ctx.font = "50px Arial";
  this.canvas.ctx.fillStyle = "white";
  this.canvas.ctx.textAlign = "center";
  var message = this.isWon() ? "Congratulations! You won!" : "GAME OVER";
  this.canvas.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
  this.canvas.ctx.fillText("Score: " + this.points, this.canvas.width / 2, this.canvas.height / 4);
  this.canvas.ctx.fillText("Press ENTER to play again", this.canvas.width / 2, this.canvas.height / 2 + this.canvas.height / 4);
}

Game.prototype.createAliens = function() {
  var rows = 3;
  var columns = 5;
  this.aliens = [];
  var xOffset = this.canvas.width / columns;
  var yOffset = this.canvas.height / rows;
  for (var row = 0; row < rows; row++) {
    for (var column = 0; column < columns; column++) {
      this.aliens.push(new Alien(new Pos(column * xOffset + xOffset / 2, row * yOffset / rows)));
    }
  }
}

Game.prototype.mouseMove = function(evt) {
  if (this.paused || this.isOver())
    return;
  this.player.pos = new Pos(evt.offsetX, this.player.pos.y);
  this.draw();
}

Game.prototype.fire = function(evt) {
  if (this.paused || this.isOver())
    return;
  this.player.bullets.push(new Bullet(new Pos(this.player.pos.x + this.player.width / 2, this.player.pos.y)));
}

Game.prototype.step = function() {
  if (this.paused || this.isOver())
    return;
  for (var i = 0; i < this.aliens.length; i++) {
    this.aliens[i].step();
  };
  for (var i = 0; i < this.player.bullets.length; i++) {
    this.player.bullets[i].step();
  }
  this.handleCollisions();
  this.player.cleanupBullets();
  this.cleanupAliens();
  this.draw();
  if (this.isOver())
    this.drawEndScreen();
}

Game.prototype.keydown = function(e) {
  if (this.isOver()) {
    if(e.keyCode == 13)
      this.init();
    return;
  } else if (e.keyCode == 27) {
    this.togglePause(e);
  } else if (e.keyCode == 32) {
    this.fire();
  }
}

Game.prototype.togglePause = function(e) {
  this.paused = !this.paused;
  if (this.paused) {
    this.canvas.ctx.font = "30px Arial";
    this.canvas.ctx.fillStyle = "white";
    this.canvas.ctx.textAlign = "center";
    this.canvas.ctx.fillText("Paused", this.canvas.width / 2, this.canvas.height / 2);
  }
}

Game.prototype.handleCollisions = function() {
  for (var i = 0; i < this.aliens.length; i++) {
    for (var j = 0; j < this.player.bullets.length; j++) {
      if (this.aliens[i].inBounds(this.player.bullets[j].pos, this.player.bullets[j].width, this.player.bullets[j].height)) {
        this.aliens[i].die();
        this.player.bullets[j].dead = true;
        this.points++;
      }
    }
  }
  var alienBullets = this.aliens.map(function(alien) {
    return alien.bullets;
  }).reduce(function(b1, b2) {
    return b1.concat(b2);
  }, []);
  for (var i = 0; i < alienBullets.length; i++) {
    if (this.player.inBounds(alienBullets[i].pos, alienBullets[i].width, alienBullets[i].height)) {
      this.player.die();
    }
  }
}

Game.prototype.cleanupAliens = function() {
  this.aliens = this.aliens.filter(function(alien) {
    return alien.healthStatus.alive || alien.healthStatus.dying;
  });
}

Game.prototype.isWon = function() {
  return this.aliens.every(function(alien) {
    return alien.healthStatus.dying || alien.healthStatus.dead;
  });
}

Game.prototype.isLost = function() {
  return this.aliens.some(function(alien) {
    return alien.currentPosition().y + alien.height >= this.canvas.height;
  }.bind(this)) || this.player.healthStatus.dying || this.player.healthStatus.dead;
}

Game.prototype.isOver = function() {
  return this.isWon() || this.isLost();
}

// GAME CANVAS
var GameCanvas = function(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext("2d");
  this.initCanvas();
  this.canvas.onmousemove = onmousemove;
  this.canvas.onclick = onclick;
}

GameCanvas.prototype.initCanvas = function() {
  this.width = this.canvas.width = window.innerWidth;
  this.height = this.canvas.height = window.innerHeight;
}

GameCanvas.prototype.onmousemove = function(evt) {}
GameCanvas.prototype.onclick = function(evt) {}

var canvas = document.getElementById("game-canvas");
var game = new Game(new GameCanvas(canvas));
var interval = setInterval(game.step.bind(game), 40);

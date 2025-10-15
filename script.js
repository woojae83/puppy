const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const puppyImg = new Image();
puppyImg.src = "images/puppy.png";

const foodImg = new Image();
foodImg.src = "images/food.png";

const cactusImg = new Image();
cactusImg.src = "images/cactus.png";

const camelImg = new Image();
camelImg.src = "images/camel.png";

const backgroundImg = new Image();
backgroundImg.src = "images/desert-bg.png";

const puppy = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  dy: 0,
  gravity: 0.9,
  jumpPower: -8,
};

let foods = [];
let obstacles = [];
let score = 0;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    puppy.dy = puppy.jumpPower;
  }
});

function update() {
  puppy.dy += puppy.gravity;
  puppy.y += puppy.dy;

  if (puppy.y + puppy.height > canvas.height) {
    puppy.y = canvas.height - puppy.height;
    puppy.dy = 0;
  }
  if (puppy.y < 0) puppy.y = 0;

  if (Math.random() < 0.02) {
    foods.push({
      x: canvas.width,
      y: Math.random() * (canvas.height - 100),
      width: 40,
      height: 40,
    });
  }

  if (Math.random() < 0.015) {
    const isCamel = Math.random() > 0.5;
    obstacles.push({
      x: canvas.width,
      y: canvas.height - (isCamel ? 80 : 50),
      width: isCamel ? 70 : 50,
      height: isCamel ? 70 : 60,
      type: isCamel ? "camel" : "cactus",
    });
  }

  foods.forEach((food) => (food.x -= 5));
  obstacles.forEach((ob) => (ob.x -= 6));

  foods = foods.filter((food) => {
    if (collision(puppy, food)) {
      score++;
      document.getElementById("score").innerText = score;
      return false;
    }
    return food.x + food.width > 0;
  });

  for (let ob of obstacles) {
    if (collision(puppy, ob)) {
      alert("게임 오버! 😢 점수: " + score);
      document.location.reload();
      break;
    }
  }

  obstacles = obstacles.filter((ob) => ob.x + ob.width > 0);
}

function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function draw() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(puppyImg, puppy.x, puppy.y, puppy.width, puppy.height);
  foods.forEach((food) => {
    ctx.drawImage(foodImg, food.x, food.y, food.width, food.height);
  });
  obstacles.forEach((ob) => {
    if (ob.type === "camel") {
      ctx.drawImage(camelImg, ob.x, ob.y, ob.width, ob.height);
    } else {
      ctx.drawImage(cactusImg, ob.x, ob.y, ob.width, ob.height);
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

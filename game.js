const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let DPR = Math.min(window.devicePixelRatio || 1, 2);
let W, H;

function resize(){
  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * DPR;
  canvas.height = H * DPR;

  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener("resize", resize);
resize();

let player = {
  x: 200,
  y: 200,
  size: 20,
  speed: 4
};

let bullets = [];
let enemies = [];
let score = 0;

let keys = {};

addEventListener("keydown", e => keys[e.key] = true);
addEventListener("keyup", e => keys[e.key] = false);

addEventListener("click", () => {
  bullets.push({
    x: player.x,
    y: player.y,
    dx: 6,
    dy: 0
  });
});

function spawnEnemy(){
  enemies.push({
    x: Math.random() * W,
    y: Math.random() * H,
    size: 20,
    speed: 1 + Math.random()*1.5
  });
}

setInterval(spawnEnemy, 1500);

function update(){
  if(keys["ArrowUp"]) player.y -= player.speed;
  if(keys["ArrowDown"]) player.y += player.speed;
  if(keys["ArrowLeft"]) player.x -= player.speed;
  if(keys["ArrowRight"]) player.x += player.speed;

  bullets.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;
  });

  enemies.forEach(e => {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.hypot(dx, dy) || 1;
    e.x += dx/dist * e.speed;
    e.y += dy/dist * e.speed;
  });

  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      let d = Math.hypot(b.x - e.x, b.y - e.y);
      if(d < 20){
        enemies.splice(ei,1);
        bullets.splice(bi,1);
        score++;
        document.getElementById("score").textContent = "Puntos: " + score;
      }
    });
  });
}

function draw(){
  ctx.fillStyle = "#0b0f14";
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, 5, 5);
  });

  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
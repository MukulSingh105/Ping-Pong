const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

const ball ={
  x: (canvas.width)/2,
  y: (canvas.height)/2,
  radius : 10,
  velocityX : 5,
  velocityY : 5,
  speed : 7,
  color : "WHITE"
}

const user ={
  x:0,
  y:(canvas.height-100)/2,
  height:100,
  width:10,
  score:0,
  color:"RED"
}

const com ={
  x:canvas.width - 10,
  y:(canvas.height-100)/2,
  height:100,
  width:10,
  score:0,
  color:"RED"
}

function drawrect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawarc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function drawtext(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}



function drawnet(){
  for(let i=0;i<=canvas.width;i+=15){
    drawrect((canvas.width + 4)/2,i,1,10,"WHITE");
  }
}

function resetball(){
  ball.x=canvas.width/2;
  ball.y=canvas.height/2;
  ball.velocityX=-ball.velocityX;
  ball.speed=7;
}

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

function collision(b,p){
    ptop = p.y;
    pbottom = p.y + p.height;
    pleft = p.x;
    pright = p.x + p.width;

    btop = b.y - b.radius;
    bbottom = b.y + b.radius;
    bleft = b.x - b.radius;
    bright = b.x + b.radius;

    return pleft < bright && ptop < bbottom && pright > bleft && pbottom > btop;
}

function render(){

  drawrect(0,0,canvas.width,canvas.height,"BLACK");
  drawtext(user.score,canvas.width/4,canvas.height/5);
  drawtext(com.score,3*canvas.width/4,canvas.height/5);
  drawnet();
  drawrect(user.x, user.y, user.width, user.height, user.color);
  drawrect(com.x, com.y, com.width, com.height, com.color);
  drawarc(ball.x,ball.y,ball.radius,ball.color);

}

function update(){
  if( ball.x - ball.radius < 0 ){
          com.score++;
          resetball();
      }else if( ball.x + ball.radius > canvas.width){
          user.score++;
          resetball();
      }

      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      com.y += ((ball.y - (com.y + com.height/2)))*0.05;

  if((ball.y-ball.radius<=0)||(ball.y+ball.radius>=canvas.height)){
    ball.velocityY=-ball.velocityY;
  }

  let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

  if(collision(ball,player)){

       let collidePoint = (ball.y - (player.y + player.height/2));
       collidePoint = collidePoint / (player.height/2);
       let angleRad = (Math.PI/4) * collidePoint;
       let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;

       ball.velocityX = direction * ball.speed * Math.cos(angleRad);
       ball.velocityY = ball.speed * Math.sin(angleRad);

       ball.speed += 0.1;
     }
}

function game(){
  update();
  render();
}

let fps = 50;
let loop = setInterval(game,1000/fps);

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var jumpSound, deathSound, cpSound;

var score;

var restart, restartImg;
var gameOver, gameOverImg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("som/jump.mp3");
  deathSound = loadSound ("som/die.mp3");
  cpSound = loadSound("som/checkPoint.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  //chao
  ground = createSprite(200,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,height-20,width,10);
  invisibleGround.visible = false;

  console.log(trex.y);

  //trex.debug = true;
  trex.setCollider("circle", 0, 0,30);

  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
   gameOver = createSprite (300, 65);
   gameOver.addImage(gameOverImg);
   gameOver.scale = 1;
   gameOver.visible = false;
   

   restart = createSprite(300, 100);
   restart.addImage(restartImg);
   restart.scale = 0.5;
   restart.visible = false;

  }

function draw() {
  background(180);
  text("Score: "+ score, width-100,50);
 
  

  if(gameState === PLAY){
    //mover o solo
    ground.velocityX = -(4 + 3 * score/100);
    obstaclesGroup.setVelocityXEach(-(4 + 3 * score/100));

    score = score + Math.round(frameRate()/60);

    if(score>0 && score%100 ===0) {
      cpSound.play();
    }
    if (touches.lengh>0) {
      trex.velocityY = -13;
      jumpSound.play();
      touches = [];
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //gere as nuvens
  spawnClouds();
  
  //gere obstáculos no solo
  spawnObstacles();
  
  if (obstaclesGroup.isTouching(trex)){
   gameState =  END;
   deathSound.play();
  }
  }
  else if(gameState === END){
    //parar o solo
    ground.velocityX = 0;
  
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);

  trex.changeAnimation("collided", trex_collided);

 // score =0;

  gameOver.visible = true
  restart.visible = true;

  if(touches.lengh>0){
    reset();
    touches = [];
  }
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-40,10,40);
   obstacle.velocityX = -6;

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = width/3;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = width/3;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}
function reset(){

  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  score = 0;

}
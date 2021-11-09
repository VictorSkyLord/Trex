var somSalto, somCheckPoint, somDaMorte;

var JOGAR = 1;
var ENCERRAR = 0;
var fimDeJogo, reiniciar, imagemReiniciar, imagemFimDeJogo;
var estadoDeJogo = JOGAR;

//variaveis para o trex
var trex, trexCorrendo, trexMorto;
    
//variáveis para o solo    
var chao, imagemdochao, chaoinvisivel;

//variaveis da nuvem
var nuvem, imagemdanuvem;

//pontuação
var pontuacao = 0;

//grupos
var grupoDeObstaculos, grupoDeNuvens;

//pré-carrega as imagens usadas nas animações
function preload() {
  //animação do trex correndo
  trexCorrendo = loadAnimation ("trex1.png", "trex4.png", "trex3.png");
  trexMorto = loadAnimation ("trex_collided.png");
  
  imagemFimDeJogo = loadImage("gameOver.png");
  imagemReiniciar = loadImage("restart.png");
  
  //imagem usada no chão do game
  imagemdochao = loadImage("ground2.png");
  
  //imagem usada nas nuvens
  imagemdanuvem = loadImage("cloud.png.png");
  
  //imagens usadas nos obstáculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  somSalto = loadSound("jump.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  somDaMorte  = loadSound("die.mp3");
  
}


//instancia e configura os objetos sprites
function setup(){
  
  //delimita o tamanho da tela
  createCanvas(600,200);
  
  //objeto sprite trex
  trex = createSprite (50,180,20,50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("morto", trexMorto);
  trex.scale= 0.5;
  trex.x=40;
  //trex.debug=true
  trex.setCollider("circle",0,0,30)
  
  //objeto chão do game
  chao = createSprite(300,180,600,20);
  chao.addImage("chão", imagemdochao);
  chao.x = chao.width/2;
  
  fimDeJogo=createSprite(300,100)
  fimDeJogo.addImage(imagemFimDeJogo)
  fimDeJogo.scale= 0.5;
  
  reiniciar=createSprite(300,140)
  reiniciar.addImage(imagemReiniciar)
  reiniciar.scale= 0.5;
  
  //objeto chão invisivel
  chaoinvisivel = createSprite (300,190,600,7);
  chaoinvisivel.visible = false;
  
  //cria os limites da tela
  edges = createEdgeSprites();
  
  //cria grupos de objetos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  

  
}


function draw(){
 //adiciona o fundo branco na tela 
 background("white");
  
  
  
 //usa o frameRate como metrica para pontuação do jogo
  //usa o metodo Math.round para arrendondar os numeros do frameRate
 text("Pontuação: " + pontuacao, 500,50 );
 
  
  if(estadoDeJogo === JOGAR) {
    
     //faz o solo regredir para dar a ideia de movimento do jogo
     chao.velocityX = -(5+3* pontuacao/100);
    grupoDeObstaculos.setVelocityXEach(-(5 + 3* pontuacao/100));
    grupoDeNuvens.setVelocityXEach(-(5 + 3* pontuacao/100));
    //atualizando a pontuação
    pontuacao = pontuacao + Math.round(frameRate()/60); 
    
    //condição que faz o solo resetar para o posição inicial e sempre esteja na tela, sendo sua posição x a metade do tamanho da imagem usada para o chão  
     if (chao.x <0) {
         chao.x = chao.width/2;
         } 
    
     //condição para o dino poder pular, apenas se apertar o espaço e estiver no chão  
     if(keyDown("space")&& trex.y >=160){
        trex.velocityY = -15;
        somSalto.play();
        } 
  
  if(pontuacao>0 && pontuacao%100 === 0){
      somCheckPoint.play() }
    
  //chama a função para gerar as nuvens do jogo
    gerarNuvens();
  
  //chama a função para gerar os obstáculos
    gerarObstaculos();
    
    if(grupoDeObstaculos.isTouching(trex)){
      estadoDeJogo = ENCERRAR;
      somDaMorte.play(); 
    }
    fimDeJogo.visible = false;
    reiniciar.visible = false;
//---------------------fim IF estadoDeJogo === JOGAR
  } else if(estadoDeJogo === ENCERRAR){
            //parar o solo
           chao.velocityX = 0;
    
      //seta velocidade 0 a cada objeto do grupo
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    
    grupoDeObstaculos.setLifetimeEach(-1)
    grupoDeNuvens.setLifetimeEach(-1)
    
    trex.changeAnimation("morto", trexMorto);
       
  fimDeJogo.visible = true;
  reiniciar.visible = true;
  if (mousePressedOver(reiniciar)){
    restart();
  }
  } 
 //----------------------fim ELSE IF estadoDeJogo === ENCERRAR
  
  

 //adiciona a ideia da gravidade para trazer o dino de volta ao chão
    trex.velocityY = trex.velocityY + 1.5; 

 //faz o trex colidir com o chão invisivel para que mantenha a ideia de que ele está andando NO chão e não VOANDO em cima do chão xD
 trex.collide(chaoinvisivel); 
   
 //chama a função que desenha os sprites na tela 
 drawSprites ();
  
}

//função que gera as nuvens
function gerarNuvens(){
  //se o resto da divisão do frame atual por 60 for igual a 0;       desenha a nuvem na tela
  if(frameCount % 60 === 0) {
    //cria sprite nuvem
    nuvem = createSprite(600,100,40,10);
    //adiciona a imagem carregada no preload
    nuvem.addImage(imagemdanuvem);
    //gera uma posição Y aleatória para a nuvem
    nuvem.y = Math.round(random(20,90));
    //diminui o tamanho da nuvem
    nuvem.scale = 0.2;
    //dá velocidade a nuvem
    nuvem.velocityX = -4;
    
    //atribuir tempo de duração à nuvem
    //600/5=120 , 600 = distancia e 5 velocidade 
    nuvem.lifetime = 120;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adiciona cada nuvem ao grupo 
    grupoDeNuvens.add(nuvem);
  }

}

function gerarObstaculos(){
  if (frameCount % 60 ===0){
    var obstaculo = createSprite(600,165,10,40);
    obstaculo.velocityX=-4;
   
    //switch case vai gerar obstaculos aleatorios 
    //cria uma variavel aleatoria para armazenar um numero aleatorio, e passa essa variável no switch, para entrar no caso aleatorio 
    
    var aleatorio = Math.round(random(1,6));
    switch(aleatorio){
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;  
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;  
              default: break;
    }
    
    //definir tamanho do objeto 
    obstaculo.scale=0.5;
    
    //atribui tempo de duração do obstaculo
    obstaculo.lifetime = 200; 
    
    //adiciona cada obstaculo ao grupo
    grupoDeObstaculos.add(obstaculo);
  }
}
  function restart(){
    estadoDeJogo=JOGAR
    
    fimDeJogo.visible = false;
    reiniciar.visible = false;
    
    grupoDeObstaculos.destroyEach();

    grupoDeNuvens.destroyEach();
    
    pontuacao = 0;

    trex.changeAnimation("correndo", trexCorrendo);
  }

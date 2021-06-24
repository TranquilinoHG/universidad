
var CANVASWH={'X':800,'Y':550};  //tamano del canvas
var game = new Phaser.Game(CANVASWH.X, CANVASWH.Y, Phaser.CANVAS, null, {
	preload: preload, create: create, update: update, render: render 
});

//variables globales
var puntos={'A':0,'B':0};
var balon;
var campo;
var jugadoresA;
var jugadoresB;
var porteriaA;
var porteriaB;
var bordes;
var velocidadMaxima=250;//100 por defecto
 var btPlay;
 var btRei;
 var timeInicial=new Date();
 var startButton;
//funcion donde se precargar los archivos
function preload(){
	game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;	//para que el canvas no escale
	game.scale.pageAlignHorizontally= true;
	game.scale.pageAlignVertically	= true;

	game.load.image('balon',		'img/balon.png');
	game.load.image('jugadorA',		'img/camisaAmarrilla.png',50,50);
	game.load.image('jugadorB',		'img/camisaRosa.png',50,50);
	game.load.image('campo',		'img/campo.png');
	game.load.spritesheet('button', 'img/balon.png', 120, 40);
	game.load.spritesheet('pausar', 'img/pausar.png', 40, 40);
	game.load.spritesheet('reiniciar', 'img/reiniciar.png', 35, 35);


	//game.paused=true;
}
function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);		//Se añade la libreria de las fisicas
	campo = game.add.sprite(0,0,'campo');					//Se añade la imagen  del campo
	game.stage.backgroundColor = '#ffffff';
	//inicializacion del balon
	balon = game.add.sprite(game.world.width*0.5, game.world.height*0.5, 'balon');	//se posiciona la pelota 
	balon.anchor.set(0.5);									//Para ajustar la posicion relativa al centro de la pelota	
	balon.scale.setTo(0.7);									//Para controlar el tamaño de balon, este se escala 0.5 es la mitad del tamaño real			
    game.physics.enable(balon, Phaser.Physics.ARCADE);		//Se añade la fisica a la pelota
	balon.body.setCircle(20);								//Se transforma el sprite a un circulo de 20px de radio
	balon.body.collideWorldBounds = true;					//Para que la pelota pueda colisionar
	balon.body.bounce.set(.5);								//Para que la pelota rebote
	balon.body.velocity.set(parseInt(getRandomInt(-1,2) * 50),getRandomInt(-1,2) *50);					//Se añade la velocidad a la pelota
	//inicializacion de los jugadores A
	initJugadoresA();
	//inicializacion de los jugadores B
	initJugadoresB();
	//inicializacion de los bordes
	initBordes();
	startButton = game.add.button(50,520, 'pausar', startGame, this, 1, 0, 2);
	startButton.anchor.set(0.5);
	startButton2 = game.add.button(100,520, 'reiniciar', reiniciaTodo, this, 1, 0, 2);
	startButton2.anchor.set(0.5);

}
function reiniciaTodo(){
	location.reload();
}
function startGame(){
	console.log(game.paused);
	if(game.paused==true)
		game.paused=false;
	else
		game.paused=true;

	console.log("holapause");
}

function initJugadoresA(){
    jugaInfo = {
        width: 150,
        height: 200,
        count: {
            row: 2,
            col: 2
        },
        offset: {
            top: 130,
            left:180
        },
        padding: 2
    };
	jugadoresA = game.add.group();

	//inicializar al portero
	var jugadorX=40;
	var jugadorY=250;
	newJugador = game.add.sprite(jugadorX, jugadorY, 'jugadorA');
	newJugador.anchor.set(0.5);
	game.physics.enable(newJugador, Phaser.Physics.ARCADE);
    newJugador.scale.setTo(0.2);
	newJugador.body.setCircle(225/2);
	newJugador.body.collideWorldBounds = true;					//para que  pueda colisionar
	newJugador.body.bounce.set(.5);								//para que  rebote
	newJugador.body.velocity.set(parseInt(getRandomInt(-1,2) * 50),getRandomInt(-1,2) *50);

	jugadoresA.add(newJugador);
	//inicializar a los demas jugadores

	for(c=0; c<jugaInfo.count.col; c++) {
		for(r=0; r<jugaInfo.count.row; r++) {
		
			jugadorX = (c*(jugaInfo.width+jugaInfo.padding))+jugaInfo.offset.left;
			jugadorY = (r*(jugaInfo.height+jugaInfo.padding))+jugaInfo.offset.top;
			newJugador = game.add.sprite(jugadorX, jugadorY, 'jugadorA');
			game.physics.enable(newJugador, Phaser.Physics.ARCADE);
			//newBrick.body.immovable = true;
			newJugador.body.collideWorldBounds = true;
			newJugador.body.bounce.set(.5);	
			newJugador.scale.setTo(0.2);
			newJugador.body.setCircle(225/2);
			newJugador.body.velocity.set(parseInt(getRandomInt(-1,2) * 50),getRandomInt(-1,2) *50);

			jugadoresA.add(newJugador);
		}
	}
}
function initJugadoresB(){
	    jugaInfo = {
        width: 150,
        height: 200,
        count: {
            row: 2,
            col: 2
        },
        offset: {
            top: 130,
            left:450
        },
        padding: 2
		};
	jugadoresB = game.add.group();

	//inicializar al portero
	var jugadorX=750;
	var jugadorY=250;
	newJugador = game.add.sprite(jugadorX, jugadorY, 'jugadorB');
	newJugador.anchor.set(0.5);
	game.physics.enable(newJugador, Phaser.Physics.ARCADE);
    newJugador.scale.setTo(0.2);
	newJugador.body.setCircle(225/2);
	newJugador.body.collideWorldBounds = true;					//para que  pueda colisionar
	newJugador.body.bounce.set(.5);								//para que  rebote
	newJugador.body.velocity.set(parseInt(getRandomInt(-1,2) * 50),getRandomInt(-1,2) *50);
	jugadoresB.add(newJugador);
	//inicializar a los demas jugadores

	for(c=0; c<jugaInfo.count.col; c++) {
		for(r=0; r<jugaInfo.count.row; r++) {
		
			jugadorX = (c*(jugaInfo.width+jugaInfo.padding))+jugaInfo.offset.left;
			jugadorY = (r*(jugaInfo.height+jugaInfo.padding))+jugaInfo.offset.top;
			newJugador = game.add.sprite(jugadorX, jugadorY, 'jugadorB');
			game.physics.enable(newJugador, Phaser.Physics.ARCADE,cambiaDeDireccion);
			//newBrick.body.immovable = true;
			newJugador.body.collideWorldBounds = true;
			newJugador.body.bounce.set(1);	
			newJugador.scale.setTo(0.2);
			newJugador.body.setCircle(225/2);
			newJugador.body.velocity.set(parseInt(getRandomInt(-1,2) * 50),getRandomInt(-1,2) *50);
			jugadoresB.add(newJugador);
		}
	}
}
function initBordes(){
	var x_=0;
	var y_=100;
	var newBorde;
	bordes=game.add.group();		
	newBorde=Borde(10,100,145,5);	//borde 0
	bordes.add(newBorde);			
	newBorde=Borde(10,400,145,5);  //borde 1
	bordes.add(newBorde);
	newBorde=Borde(150,100,5,305); //borde 2
	bordes.add(newBorde);
	newBorde=Borde(10,100,5,300);  //borde 3
	bordes.add(newBorde);
	newBorde=Borde(0,180,5,150);  //borde 4 porteria A
	bordes.add(newBorde);
	////////////
	newBorde=Borde(645,100,145,5);	//borde 5
	bordes.add(newBorde);		
	newBorde=Borde(645,400,145,5);  //borde 6
	bordes.add(newBorde);
	newBorde=Borde(645,100,5,305); //borde 7
	bordes.add(newBorde);
	newBorde=Borde(785,100,5,300);  //borde 8
	bordes.add(newBorde);
	newBorde=Borde(795,180,5,150);  //borde 9 porteria B
	bordes.add(newBorde);

	newBorde=Borde(10,0,5,180);  //borde 10
	bordes.add(newBorde);
	newBorde=Borde(785,0,5,180);  //borde 11
	bordes.add(newBorde);
	newBorde=Borde(10,320,5,180);  //borde 12
	bordes.add(newBorde);
	newBorde=Borde(785,320,5,180);  //borde 13
	bordes.add(newBorde);

	newBorde=Borde(15,0,770,5);  //borde 13
	bordes.add(newBorde);
	newBorde=Borde(0,495,800,5);  //borde 13
	bordes.add(newBorde);

	newBorde=Borde(400,0,5,500);  //borde 13
	bordes.add(newBorde);

}
function Borde(x,y,w,h){
	newBorde=game.add.sprite(x,y);
	newBorde.width=w;
	newBorde.height=h;
	game.physics.enable(newBorde, Phaser.Physics.ARCADE);
	newBorde.body.immovable = true;
	return newBorde;
}
function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function balonJugador(jugador){
	jugador.body.velocity.set(parseInt(getRandomInt(-1,2) * getRandomInt(10,velocidadMaxima)),getRandomInt(-1,2) * getRandomInt(10,velocidadMaxima));
	console.log("balonJugador")
}

function reiniciar(x){
	//portero
	jugadoresA.children[0].x=40;
	jugadoresA.children[0].y=250;
	//jugadores
	    jugaInfo = {
        width: 150,
        height: 200,
        count: {
            row: 2,
            col: 2
        },
        offset: {
            top: 130,
            left:180
        },
        padding: 2
    };
	var n=0;
	for(c=0; c<jugaInfo.count.col; c++) 
		for(r=0; r<jugaInfo.count.row; r++) {
			n++;
			jugadoresA.children[n].x = (c*(jugaInfo.width+jugaInfo.padding))+jugaInfo.offset.left;
			jugadoresA.children[n].y = (r*(jugaInfo.height+jugaInfo.padding))+jugaInfo.offset.top;
		}
	//for(i=0;i<5;i++)
		//jugadoresA.children[i].body.velocity.set(0,0);
	//porterob
	jugadoresB.children[0].x=750;
	jugadoresB.children[0].y=250;
	jugaInfo.offset.left=450;
	n=0;
		for(c=0; c<jugaInfo.count.col; c++) 
		for(r=0; r<jugaInfo.count.row; r++) {
			n++;
			jugadoresB.children[n].x = (c*(jugaInfo.width+jugaInfo.padding))+jugaInfo.offset.left;
			jugadoresB.children[n].y = (r*(jugaInfo.height+jugaInfo.padding))+jugaInfo.offset.top;
		}

	//for(i=0;i<5;i++)
		//jugadoresB.children[i].body.velocity.set(0,0);
	
	balon.x=400;
	balon.y=250;
}
function balonPorteria(balon){
	console.log("gooool");
	if(balon.x>400)
		puntos.A++;
	else
		puntos.B++;
	var A= document.getElementById("puntos");
	A.innerHTML=(puntos.A)+':'+(puntos.B);
	console.log(A.innerHTML);
	reiniciar();	//funcion para recolocar todas las piezas
	balon.body.velocity.set.x=balon.body.velocity.x*-1;
	alert('GOOL');
	//location.reload(); //reinicia el juego
}

function cambiaDeDireccion(jugador){
	jugador.body.velocity.set(parseInt(getRandomInt(-1,2) *  getRandomInt(10,velocidadMaxima)),getRandomInt(-1,2) * getRandomInt(10,velocidadMaxima));
	console.log("cambia de direccion");
	
}

function update(){
	game.physics.arcade.collide(jugadoresA, balon,balonJugador);
	game.physics.arcade.collide(jugadoresB, balon,balonJugador);
	game.physics.arcade.collide(jugadoresA.children[0], bordes,cambiaDeDireccion);
	game.physics.arcade.collide(jugadoresA, jugadoresA,cambiaDeDireccion);
	game.physics.arcade.collide(jugadoresB, jugadoresB,cambiaDeDireccion);
	game.physics.arcade.collide(jugadoresA, jugadoresB,cambiaDeDireccion);
	game.physics.arcade.collide(jugadoresB, jugadoresA,cambiaDeDireccion);


	game.physics.arcade.collide(jugadoresB.children[0], bordes,cambiaDeDireccion);
	game.physics.arcade.collide(balon, bordes.children[4],balonPorteria);
	game.physics.arcade.collide(balon, bordes.children[9],balonPorteria);
	for(var i=10;i<14;i++)
		game.physics.arcade.collide(balon, bordes.children[i]);
		
	game.physics.arcade.collide(jugadoresA.children[1], bordes.children[16],cambiaDeDireccion);
	game.physics.arcade.collide(jugadoresA.children[3], bordes.children[16],cambiaDeDireccion);

	game.physics.arcade.collide(jugadoresB.children[2], bordes.children[16],cambiaDeDireccion);
	game.physics.arcade.collide(jugadoresB.children[4], bordes.children[16],cambiaDeDireccion);

	game.physics.arcade.collide(jugadoresA, bordes.children[15]);
	game.physics.arcade.collide(jugadoresB, bordes.children[15]);
	game.physics.arcade.collide(balon, bordes.children[15]);


	 //reloj
	 var A= document.getElementById("hora");
	
	 timeActual = new Date();
     acumularTime = timeActual - timeInicial;
     acumularTime2 = new Date();
     acumularTime2.setTime(acumularTime); 
         ss = acumularTime2.getSeconds();
         mm = acumularTime2.getMinutes();
         hh = acumularTime2.getHours()-18;
      
         if (ss < 10) {ss = "0"+ss;} 
         if (mm < 10) {mm = "0"+mm;}
         if (hh < 10) {hh = "0"+hh;}
         A.innerHTML = hh+" : "+mm+" : "+ss;
	// A.innerHTML=(fechaHora);

}
function render(){
 game.debug.body(balon);
 //for(i=0;i<17;i++)
	 //game.debug.body(bordes.children[i]);
}

var CANVASWH={'X':800,'Y':700};  //tamano del canvas
var game = new Phaser.Game(CANVASWH.X, CANVASWH.Y, Phaser.CANVAS, null, {
	preload: preload, create: create, update: update, render: render 
});

var tamLaberinto={'largo':11,'alto':11};
var copiaTamLaberinto;
var tamCajaLaberinto=600;
var minero;
var agente;
var velocidad=200;
//variables globales
var tablaSprite;
var tabla=[];
var tiempo;
var isMarch = false; 
var acumularTime = 0; 
var recargo=false;
//funcion donde se precargar los archivos
function preload(){
	game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;	//para que el canvas no escale
	game.scale.pageAlignHorizontally= true;
	game.scale.pageAlignVertically	= true;
	game.load.image('paredIMG', 'img/pared.png');
	game.load.image('pasilloOscuroIMG', 'img/pasilloOscuro.png');
	game.load.image('pasilloIluminadoIMG', 'img/pasilloIluminado2.png');
	game.load.image('mineroIMG', 'img/minero2.png');
	game.load.image('mineroIzqIMG', 'img/mineroIzq.png');

	game.load.image('diamanteIMG', 'img/diamante.png');
	game.load.image('letramineroIMG', 'img/letraminero.png');
	game.load.image('cronometroMG', 'img/cronometro.png');
	game.load.image('playMG', 'img/play.png');
	game.load.image('flechaAIMG', 'img/flechaArriba.png');
	game.load.image('flechaAbIMG', 'img/flechaAbajo.png');
	game.load.image('conejoIMG', 'img/conejo.png');
	game.load.image('agrandarIMG', 'img/agrandar.png');
	game.load.image('reloadIMG', 'img/reload.png');
	//game.paused=true;
	
}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);		//Se añade la libreria de las fisicas
	//campo = game.add.sprite(0,50,'ladrillos');			//Se añade la imagen  del campo
	game.stage.backgroundColor = '#00000';

	//rescatar el tamano del laberinto del la cache
	let l=tamLaberinto.largo;	
	if(!(localStorage.getItem('tamLaberinto')==undefined)){//existe el dato en la cache
		l=parseInt(localStorage.getItem('tamLaberinto'));
	}
	////  variable para cambiarle el tamanio solo numeros impares    <---------------
	tamLaberinto={'largo':l,'alto':l};
	copiaTamLaberinto=tamLaberinto.largo;
	
	tablaSprite = game.add.group();  
	
	tabla= contruirLaberintoConPrim(tamLaberinto.largo,tamLaberinto.alto);
	tabla[((tamLaberinto.alto-2)*tamLaberinto.largo)]='I';    /// entrada 
	tabla[(2*tamLaberinto.largo)-1]='I';  /// salida
	let tamCubos= Math.floor(tamCajaLaberinto/tamLaberinto.largo);   //calcula el tamanio en px que tiene que tener los cubos en ralacion con el tamano de la caja y el tam del laberinto

	// construccion del laberinto 
	for(var i= 0, x=0;i<tamLaberinto.alto;i++)
		for(var j=0;j<tamLaberinto.largo;j++){
			if(tabla[x]==1)
				tablaSprite.add(newLadrillo(tamCubos*j,tamCubos*i,tamCubos/50,'paredIMG'));
			else
				if(tabla[x]=='I'){
					tablaSprite.add(newLadrillo(tamCubos*j,tamCubos*i,tamCubos/50,'pasilloOscuroIMG'));
					}
			
			x++;
		}
	

	// letrero de "agente minero"
	game.add.image(10, 600, 'letramineroIMG');
	//cronoemtro img
	crono=game.add.image(650, 20, 'cronometroMG');
	crono.width=100
	crono.height=100
	//boton play
	startButton = game.add.button(650,250, 'playMG', pulsoPlay, this, 2,1,0);
	startButton.scale.setTo(.4);
	//boton reload
	reloadButton = game.add.button(650,300, 'reloadIMG', pulsoReload, this, 2,1,0);
	reloadButton.scale.setTo(.4);
	//boton flecha arriba para  velocidad
	flechaAButton = game.add.button(630,370, 'flechaAIMG', pulsoBA, this, 2,1,0);
	flechaAButton.scale.setTo(.4);
	//boton flecha abajo para velocidad
	flechaAbButton = game.add.button(630,420, 'flechaAbIMG', pulsoBAb, this, 2,1,0);
	flechaAbButton.scale.setTo(.4);
	///tamanio
	//boton flecha arriba para  tamanio
	flechaATamButton = game.add.button(630,480, 'flechaAIMG', pulsoAT, this, 2,1,0);
	flechaATamButton.scale.setTo(.4);
	//boton flecha abajo para tamnio
	flechaAbTamButton = game.add.button(630,530, 'flechaAbIMG', pulsoBT, this, 2,1,0);
	flechaAbTamButton.scale.setTo(.4);
	//letro de la tamnio
	tamLetrero = game.add.text(680, 500, copiaTamLaberinto, { font: '30px Arial' , fill: "#ffffff", align: "center"})
	////
	//letro del cronometro
	tiempoLetrero = game.add.text(665, 130, '00:00', { font: '30px Arial' , fill: "#ffffff", align: "center"})
	//letro de la velocidad
	velocidadLetrero = game.add.text(680, 400, velocidad, { font: '30px Arial' , fill: "#ffffff", align: "center"})
	//conrjo img
	conejo=game.add.image(740, 405, 'conejoIMG');
	conejo.width=30;
	conejo.height=30;
	//agrandar img
	agrandar=game.add.image(740, 500, 'agrandarIMG');
	agrandar.width=30;
	agrandar.height=30;
	
	// Construccion del agente
	minero= new AgenteMinero(dibujarAgente(1,(tamLaberinto.alto-2)*tamCubos,tamCubos/89,'mineroIMG'),0,tamCubos,((tamLaberinto.alto-2)*tamLaberinto.largo));
	//console.log("tamcubos:",tamCubos);
	
	inicioC();
	pulsoPlay();
}
function newLadrillo(X,Y,escalar,img){
	newJugador = game.add.sprite(X, Y,img);
	game.physics.enable(newJugador, Phaser.Physics.ARCADE);
    newJugador.scale.setTo(escalar);
	newJugador.body.immovable = true;
	return newJugador;
}

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}


function update(){
	minero.play();
}
function render(){
}
class AgenteMinero{
	  constructor (s,posS,tam,n) {
		this.spritee=s;
		this.posSiguiX=s.x;	
		this.posSiguiY=s.y;
		this.tam=tam;
		this.sensores=[];
		this.direccion=0;//0 - parado, 1-izquierda,2-derecha,3-arriba,4-abajo
		this.n=n;
	  }
	  // Método
	 play(){
		//console.log("play>direccion:",this.direccion);
		switch(this.direccion){
			case 0:	this.parado();break;
			case 1:	this.avanzaIzquierda();break;
			case 2:	this.avanzaDerecha();break;
			case 3:	this.avanzaArriba();break;
			case 4:this.avanzaAbajo();break;
			default:break;
			}
	 }
	 parado(){
	
		//console.log("parado");
		// calcula en que parte de la tabla estamos 
		let x=(this.spritee.body.x/this.tam);
		let y=(this.spritee.body.y/this.tam);
		let n=this.n;//Math.round(y*tamLaberinto.largo+x);   /// se calcula la posion en la tabla (mapa)
		if(n==(2*tamLaberinto.largo)-1){
			alert("El agente minero encontro la salida");
			this.direccion=5;
			game.paused=true;//para pausa
			stop();
		}
		else{
		this.getSensores(x,y,n);	// se obtiene lo datos de los sensores	
		let sen=this.sensores;
		
		let lsI=[];
		if(sen[0]=='I')//verificar si en la izquierda hay paso
			{lsI.push(1);}
		if(sen[1]=='I')//verificar si en la derecha hay paso y no ha sido recorrido
			{lsI.push(2);}
		if(sen[2]=='I')//verificar si arriba hay paso y no ha sido recorrido
			{lsI.push(3);}
		if(sen[3]=='I')//verificar si abajo hay paso y no ha sido recorrido
			{lsI.push(4);}

		let lsD=[];
		if(sen[0]=='D')//verificar si en la izquierda hay un diamante
			{lsD.push(1);}
		if(sen[1]=='D')//verificar si en la derecha  hay un diamante
			{lsD.push(2);}
		if(sen[2]=='D')//verificar si arriba  hay un diamante
			{lsD.push(3);}
		if(sen[3]=='D')//verificar si abajo  hay un diamante
			{lsD.push(4);}
		//console.log("lsI",lsI);
		//console.log("lsD",lsD);

		//si LsI es mayor que cero significa que aun aun pasillos sin recorrer desde la posicion actual del agente
		if(lsI.length>0){
			switch(tabla[n]){
				case 'I':tabla[n]='D';
						 tablaSprite.children[n].loadTexture("diamanteIMG"); break;
				default:break;
			}
			let decide=parseInt(getRandomInt(0,lsI.length));// escoge aleatoriamente entre las direcciones disponibles para avanzar
			this.direccion=lsI[decide];
			switch(this.direccion){
				case 1:this.spritee.body.velocity.set(-1*velocidad,0);  this.spritee.loadTexture("mineroIzqIMG"); this.posSiguiX-=this.tam; break; 		///izquierda
				case 2:this.spritee.body.velocity.set(velocidad,0);		this.spritee.loadTexture("mineroIMG"); this.posSiguiX+=this.tam;break;		//derecha
				case 3:this.spritee.body.velocity.set(0,-1*velocidad);	this.posSiguiY-=this.tam;break;		//arriba
				default:this.spritee.body.velocity.set(0,velocidad);	this.posSiguiY+=this.tam;break;		//abajo
			}
		}
		else{	//si LsI es 0 significa que no hay mas pasillos por visitar 
			// ahora hay que regresar por todas los diamantes que dejamos 
			//console.log("ya no hay pasillos lsd",lsD[0]);

			tabla[n]='X'; 
			tablaSprite.children[n].loadTexture("pasilloIluminadoIMG");
			this.direccion=lsD[0]
			switch(lsD[0]){
				case 1:this.spritee.body.velocity.set(-1*velocidad,0);   this.spritee.loadTexture("mineroIzqIMG"); this.posSiguiX-=this.tam; break; 		///izquierda
				case 2:this.spritee.body.velocity.set(velocidad,0);	   this.spritee.loadTexture("mineroIMG"); this.posSiguiX+=this.tam;break;		//derecha
				case 3:this.spritee.body.velocity.set(0,-1*velocidad);	this.posSiguiY-=this.tam;break;		//arriba
				default:this.spritee.body.velocity.set(0,velocidad);	this.posSiguiY+=this.tam;break;		//abajo
			}
		}
		}
	 }
	 avanzaDerecha(){
	 // console.log("avanzaDerecha",this.spritee.x,"//",this.posSiguiX);
	   if(this.spritee.x>=this.posSiguiX){
			  //this.spritee.body.velocity.set(200/Math.log(tamLaberinto.largo),0);
			    this.spritee.body.velocity.set(0,0);
				this.direccion=0;
				this.spritee.x=this.posSiguiX;
				this.n+=1;
	   }
	}
	 avanzaIzquierda(){
	  //console.log("avanzaizquierda",this.spritee.x,"//",this.posSiguiX);
	   if(this.spritee.x<=this.posSiguiX){ 
			this.spritee.body.velocity.set(0,0);
			this.spritee.x=this.posSiguiX;
			this.direccion=0;
			this.n-=1;

	   }
	}
	avanzaArriba(){
		//console.log("avanzaArriba",this.spritee.y,"//",this.posSiguiY);
	   if(this.spritee.y<=this.posSiguiY){
			  //this.spritee.body.velocity.set(200/Math.log(tamLaberinto.largo),0);
			    this.spritee.body.velocity.set(0,0);
				this.direccion=0;
				this.spritee.x=this.posSiguiX;
				this.n-=tamLaberinto.largo;
	   }
	}
	avanzaAbajo(){
	   //console.log("avanzaAbjao",this.spritee.y,"//",this.posSiguiY);
	   if(this.spritee.y>=this.posSiguiY){
			  //this.spritee.body.velocity.set(200/Math.log(tamLaberinto.largo),0);
			    this.spritee.body.velocity.set(0,0);
				this.direccion=0;
				this.spritee.y=this.posSiguiY;
				this.n+=tamLaberinto.largo;
	   }
	}
	getSensores(x,y,n){
		let s=[];

		//console.log("getSensores x:",x,"y:",y,"n:",n);
		//izquierda
		if(x>0){				
			s.push(tabla[n-1]);
		}
		else
			s.push(null);
		//derecha
		if(x<tamLaberinto.largo)
			s.push(tabla[n+1]);
		else
			s.push(null)
		//arriba
		if(y>0)					
			s.push(tabla[n-tamLaberinto.largo]);
		else
			s.push(null)
		//abajo
		if(y<tamLaberinto.alto)
			s.push(tabla[n+tamLaberinto.largo]);
		else
			s.push(null);
		this.sensores=s;
	}

}
function dibujarAgente(X,Y,es,img){//Solo para dibujar al agente, tiene que ser llamado solo una vez en la funcion create
	let s= game.add.sprite(X, Y,img);
	game.physics.enable(s, Phaser.Physics.ARCADE);
    s.scale.setTo(es);
	return s;
}
function pulsoBA(){
	velocidad+=10;
	velocidadLetrero.setText(velocidad);
}
function pulsoBAb(){
	velocidad-=10;
	velocidadLetrero.setText(velocidad);
}
function pulsoReload(){
	//localStorage.setItem('tamLaberinto',copiaTamLaberinto)
	localStorage.setItem('tamLaberinto',copiaTamLaberinto);
	location.reload();

}
function pulsoPlay(){
	if(minero.direccion!=5){
	if(game.paused==true){//para play
		resume();
		game.paused=false;
	}
		
	else{
	
		stop();
		game.paused=true;//para pausa

	}
	}
}
function inicioC() {
         if (isMarch == false) { 
            timeInicial = new Date();
            control = setInterval(cronometro,10);
            isMarch = true;
            }
         }
function cronometro () { 
         timeActual = new Date();
         acumularTime = timeActual - timeInicial;
         acumularTime2 = new Date();
         acumularTime2.setTime(acumularTime); 
         cc = Math.round(acumularTime2.getMilliseconds()/10);
         ss = acumularTime2.getSeconds();
         mm = acumularTime2.getMinutes();
         hh = acumularTime2.getHours()-18;
         if (cc < 10) {cc = "0"+cc;}
         if (ss < 10) {ss = "0"+ss;} 
         if (mm < 10) {mm = "0"+mm;}
         if (hh < 10) {hh = "0"+hh;}
        
         tiempoLetrero.setText(mm+":"+ss);
		 }

function stop () { 
         if (isMarch == true) {
            clearInterval(control);
            isMarch = false;
            }     
         }      

function resume () {
         if (isMarch == false) {
            timeActu2 = new Date();
            timeActu2 = timeActu2.getTime();
            acumularResume = timeActu2-acumularTime;
            
            timeInicial.setTime(acumularResume);
            control = setInterval(cronometro,10);
            isMarch = true;
            }     
         }

function reset () {
         if (isMarch == true) {
            clearInterval(control);
            isMarch = false;
            }
         acumularTime = 0;
        tiempoLetrero.setText("00:00")
         }
function pulsoAT(){//se pulso la flecha de arriba para el tamanio
	if(copiaTamLaberinto<200)
		copiaTamLaberinto+=2;
	tamLetrero.setText(copiaTamLaberinto);

}
function pulsoBT(){//se pulso la flecha de abajo  para el tamanio
	if(copiaTamLaberinto>=7)
		copiaTamLaberinto-=2;
	tamLetrero.setText(copiaTamLaberinto);

}
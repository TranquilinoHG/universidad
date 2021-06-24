//	
// objetivo 
// Realizar el agoritmo de contruccion de laberintos de conexion simple
// input tamano del laberinto
// output una cadena que representaria al laberinto 

// 02/06/21

var tamano;
var matriz;
var recorrido=[];
//var inicio=136;
function contruirLaberintoConPrim(largo,alto){
	tamano={'largo':largo,'alto':alto};
	///se crea la matriz con los cuartos  y el borde lleno de 1's
	matriz = Array(tamano.largo).fill(1);
	historialRC=[];
	for(y=0;y<tamano.alto-1;y++)
		for(x=0;x<tamano.largo;x++){
			if((x%2!=0 ) && (y%2==0))
				matriz.push('U');
			else 
				matriz.push(1);
		}

	let inicio=((alto-2)*largo)+1;				// posicion de inicio del algoritmo prim
	matriz[inicio]='I';


	recorrido=getVecinos(inicio);
	while(recorrido.length!=0){
		temp=Math.floor(getRandomInt(0,recorrido.length));
		temp2=recorrido[temp];
		recorrido.splice(temp, 1);
		matriz[temp2[0]]='I';
		matriz[temp2[1]]='I';
		historialRC.push(temp2);
		newVecinos=getVecinos(temp2[1]);
		for(n in newVecinos){
			if(newVecinos[n].length!=0) 
				recorrido.push(newVecinos[n]);
		}

			
	}
	return matriz;
}
function getVecinos(pos){ /// Devuelve los veninos que tiene pos solo si no hay sido detectados anteriormente o no hay sido recorridos
	let numVecinos=0;
	let vecinos=[];
	var posX= pos%tamano.largo;
	var posY= Math.floor(pos / tamano.largo);
	if(posX>2){//izquierda
		temp1=matriz[pos-2];
		if(temp1=='U'){
			numVecinos++;
			vecinos.push([pos-1,pos-2]);
			matriz[pos-2]='F';
			}
	}
	if(posX<(tamano.largo-2)){//derecha
		temp1=matriz[pos+2];
		if(temp1=='U')
			{
			numVecinos++;
			vecinos.push([pos+1,pos+2]);
			matriz[pos+2]='F';
			}
	}
	if(posY>2){//arriba
		temp1=matriz[pos-2*tamano.largo];

		if(temp1=='U')
			{
			numVecinos++;
			vecinos.push([pos-tamano.largo,pos-2*tamano.largo]);
			matriz[pos-2*tamano.largo]='F';
			}
	}
	if(posY<(tamano.alto-2)){//abajo
		temp1=matriz[pos+2*tamano.largo];
		if(temp1=='U'){
			numVecinos++;
			vecinos.push([pos+tamano.largo,pos+2*tamano.largo]);
			matriz[pos+2*tamano.largo]='F';
			}
	}
	if(numVecinos==0)
		vecinos=null;
	return vecinos;
}
 
var imagen1 = document.getElementById('imagen1');
    imagen1.addEventListener('change', updateImage1);
var colBarra = document.getElementById('coloresBarra')
    colBarra.addEventListener('change',updateColor)
var boxColor = document.getElementById("boxColor")
var Rs= document.getElementById("rangeR")
var Gs= document.getElementById("rangeG")
var Bs= document.getElementById("rangeB")
var imagenOriginal=document.getElementById("imagenO")
var imagenMoficado=document.getElementById("imagenM")
var rangeMargen=document.getElementById("rangeMargen")
var modal=document.getElementById("modal1")
//los algoritmo
var tipoMatriz=document.getElementById("tipoMatriz")
var tamEntrada= document.getElementById("tamMatriz")
var numAlgoritmo =document.getElementById("numAlgoritmo")
//var nuev=new Image(200,200)
//oCtx = oCanvas.getContext('2d');
//oImgData = oCtx.getImageData(0, 0, 200, 200);
//aPix = oImgData.data;
//imagenOriginal.src=oCanvas.toDataURL();
//console.log(nuev)
var R1=128,G1=128,B1=128
var posX=0,posY=0
var pulso=0
var tipoSegmentacion=document.getElementById("tipoSegmentacion")
var canvasOriginal = document.getElementById("canvasImagen1")

var ctx1= canvasOriginal.getContext('2d');

var canvasModificado = document.getElementById('canvasModificado') 
var divCanvasModificado = document.getElementById('divCanvasModificado') 

var ctx2= canvasModificado.getContext('2d');

function aplicarAlgoritmo(){
  if(parseInt(tamEntrada.value)%2!=0 || numAlgoritmo.value=='7')
    switch(numAlgoritmo.value){
        case '':   M.toast({html: 'Escoje un algoritmo!'}); break
        case '1':Dilatacion(); break
        case '2':Erosion();break
        case '3':Perimetro();break
        case '4':Relleno();break
        case '5':Limpieza();break
        case '6':Union();break
        default: 
          Esqueletizacion();
          break
    }
  else
    M.toast({html: 'El tamaño tiene que ser impar', classes: 'rounded  red accent-4'})  
}
function updateColor(){
    //console.log("funcionoColor")
    R1=parseInt(Rs.value)
    G1=parseInt(Gs.value)
    B1=parseInt(Bs.value)
    if((R1+G1+B1)/3<100)
        boxColor.style.color="white"
    else
        boxColor.style.color="black"

    boxColor.innerHTML=R1+", "+G1+", "+B1
    boxColor.style.backgroundColor=rgbToHex(R1,G1,B1)
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function updateImage1()
{
    var image1 = new Image();
    //console.log("entro a la funcion para actualizar a image1")
    var curFile = imagen1.files;
    source = curFile[0].name;
    if(validFileType(curFile[0]))
    {
        //console.log("la imagen es valida")
        source = curFile[0].name;
        image1.src = window.URL.createObjectURL(curFile[0]);
        image1.onload = function()
        {
            imagenOriginal.src=image1.src
            canvasOriginal.width =  image1.width;
            canvasOriginal.height = image1.height;
            ctx1.drawImage(image1, 0, 0);
            //console.log("termino de pintar la imagen")
        }
    }
    //letra1.innerHTML = "IMAGEN ORIGINAL 1";
}
function validFileType(file)
{
    for(var i = 0; i < fileTypes.length; i++)
    {
        if(file.type === fileTypes[i])
            return true;
    }
}
var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]
function aplicarSegmentacion(){
    
    if(tipoSegmentacion.checked==false)
        segmentacionEsferico()
    else
        segmentacionCuadratico()
}
function segmentacionEsferico(){
    //console.log("Funcion aplicar segementacion esferico")
    var imageO = ctx1.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var image1 = ctx1.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var datO=imageO.data;
    var dat1=image1.data;
    //tenemos que tener el valor de un color 
    var nR,nG,nB,d
    //console.log("R",R1/2,"G",G1/2,"b",B1/2)
    for(var x=0;x<image1.width*image1.height;x++){
        nR=Math.abs(datO[x*4+0]-parseInt(R1))
        nG=Math.abs(datO[x*4+1]-parseInt(G1))
        nB=Math.abs(datO[x*4+2]-parseInt(B1))
        d=nR+nG+nB
        d=(d<parseInt(rangeMargen.value))?0:d
        d=(d>255)?255:d
        dat1[x*4+0]=d
        dat1[x*4+1]=d
        dat1[x*4+2]=d 
    }
    canvasModificado.width=image1.width;
    canvasModificado.height=image1.height;
    ctx2.putImageData(image1,0,0);
    imagenMoficado.src=canvasModificado.toDataURL();

}
function segmentacionCuadratico(){
   // console.log("Funcion aplicar segementacion cuadratico")

    //si band 0 la area selecciona lo deja en color todo lo demas lo deja en gris
    //si band 1 la area seleccionada lo deja en negro todo lo demas en blanco
    var imageO = ctx1.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var image1 = ctx1.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var datO=imageO.data;
    var dat1=image1.data;
    var nR,nG,nB,d

    for (var x=0;x<image1.width*image1.height;x++){
        nR=Math.pow(datO[x*4+0]-R1,2)
        nG=Math.pow(datO[x*4+1]-G1,2)
        nB=Math.pow(datO[x*4+2]-B1,2)
        d=nR+nG+nB
        d=parseInt(Math.sqrt(d))
        d=(d<parseInt(rangeMargen.value))?0:d
        d=(d>255)?255:d
        dat1[x*4+0]=d
        dat1[x*4+1]=d
        dat1[x*4+2]=d 
    }
    canvasModificado.width=image1.width;
    canvasModificado.height=image1.height;
    ctx2.putImageData(image1,0,0);
    imagenMoficado.src=canvasModificado.toDataURL();

    //letra3.innerHTML = "segmentacion esferica, tiempo "+time1+"ms"
    //letra4.innerHTML = "segmentacion  cuadratica. tiempo"+time2+"ms"
}
function Dilatacion(){
    var tam= parseInt(tamEntrada.value)
    var tipo= tipoMatriz.checked
    dilatacion(tam,tipo)
    M.toast({html: 'Se aplico dilatacion!'});
  }
  function Erosion(){
    var tam=parseInt(tamEntrada.value)
    var tipo= tipoMatriz.checked
    erosion(tam,tipo)
    M.toast({html: 'Se aplico Erosion!'});
  }
  function Perimetro(){
    var tam=parseInt(tamEntrada.value)
    var tipo= tipoMatriz.checked
    perimetro(tam,tipo)
    M.toast({html: 'Se aplico perimetro!'});
  }
  function Relleno(){
    var tam = parseInt(tamEntrada.value)
    var tipo= tipoMatriz.checked
    relleno(tam,tipo)
    M.toast({html: 'Se aplico Relleno!'});
  } 
  function Limpieza(){
    var tam= parseInt(tamEntrada.value)
    var tipo= tipoMatriz.checked
    ///limpieza()
    erosion(tam,tipo)
    dilatacion(tam,tipo)
    M.toast({html: 'Se aplico Limpieza!'});
  }
function Union(){
  var tam= parseInt(tamEntrada.value)
  var tipo= tipoMatriz.checked
  dilatacion(tam,tipo)
  erosion(tam,tipo)
  M.toast({html: 'Se aplico Union!'});
}
  function Esqueletizacion(){
    // repetir varias veces la funcion de erosion con  tamaño de matriz
    for(let temp=parseInt(tamEntrada.value);temp>0;temp--){
      erosion(3,tipoMatriz.checked)
    }
    M.toast({html: 'Se aplico Esqueletizacion !'});
  }
  function relleno(tamM,tipo){
    var imageO = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var imageR = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var datO=imageO.data;
    var datR=imageR.data;
    var tamMatriz=tamM
    divCanvasModificado.style.display=""//hacer visible el canva y el mensaje de elegir un pixel
    canvasModificado.addEventListener("mousedown", evento => {
      x = (evento.clientX- canvasModificado.getBoundingClientRect().x);
      y = (evento.clientY- canvasModificado.getBoundingClientRect().y);
      x=Math.floor(x)
      y=Math.floor(y)
      console.log("x",x)
      console.log("y",y)
      posX=x
      posY=y 
      vecinos=new Array()     
      vecinos=vecinosNoNegros(posX,posY,datR)
      var x=1
      while(vecinos.length!=0&&x<100000){
        //console.log(vecinos+"vecinos")
        let checa=vecinos.shift()
        //console.log("x"+checa[0])
        //console.log("y"+checa[1])
        datR[checa[1]*imageO.width*4+checa[0]*4+0]=255
        datR[checa[1]*imageO.width*4+checa[0]*4+1]=0
        datR[checa[1]*imageO.width*4+checa[0]*4+2]=0
        let vecs=vecinosNoNegros(checa[0],checa[1],datR)
        
        for(let temp=0;temp<vecs.length;temp++){
          datR[vecs[temp][1]*imageO.width*4+vecs[temp][0]*4+0]=255
          datR[vecs[temp][1]*imageO.width*4+vecs[temp][0]*4+1]=0
          datR[vecs[temp][1]*imageO.width*4+vecs[temp][0]*4+2]=0
          vecinos.push(vecs[temp])
        }
      
        x++
      }
      ctx2.putImageData(imageR,0,0);
      imagenMoficado.src=canvasModificado.toDataURL();
      divCanvasModificado.style.display="none"
    });
    //var vecinos=vecinosNoNegros(x,y)// 2 funcion que devuelve las cordenadas los pixeles vecinos de XY que sean diferentes de negro
    // 3 guardarlo en un arreglo
    // ciclo que se termina hasta que no aya elementos en el arreglo
      //sacar un elemnto del arreglo
      //pintarlo de negro
      // repetir 2
      // repertir 3
      

  }

  function dilatacion(tamM,tipo){
    //recibe como parametros el tamaño de la matriz tamM y q
    //el tipo, 0 representa a la matriz normal el 1 representa a la tipo cuatro vecinos
    var imageO = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var imageR = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height);
    var datO=imageO.data;
    var datR=imageR.data;
    var tamMatriz=tamM
    var posPixelX,posPixelY,posPixel=0
    var valorPixel,pixelCentalY,pixelCentralX,pixelCentral=0
    for(var j=0;j<(imageO.height% tamMatriz==0?imageO.height-tamMatriz:imageO.height-tamMatriz-(imageO.height%tamMatriz));j++){
      for(var i=0;i<(imageO.width%tamMatriz==0?imageO.width-tamMatriz:imageO.width-tamMatriz-(imageO.width%tamMatriz));i++){  
        valorPixel=255
        pixelCentralX=(i+parseInt(tamMatriz/2))*4+0
        pixelCentalY=(j+parseInt(tamMatriz/2))*imageO.width*4
        pixelCentral=pixelCentalY+pixelCentralX
        if(datO[pixelCentral]!=0){ //ya no entramos si el pixel a pintar ya es negro 
          //recorremos la matriz de tamaño tamMatriz
          for(var y = 0; y < tamMatriz; y++) {
            for (var x = 0; x < tamMatriz; x++) {
              posPixelY=(j+y)*imageO.width*4
              posPixelX=(i+x)*4
              posPixel=posPixelY+posPixelX
              if(tipo==false || pixelCentralX==posPixelX || pixelCentalY==posPixelY){ 
                let pixel=datO[posPixel]
                if(pixel==0){// si encontramos al menos un pixel negro nos salimos 
                  valorPixel=0;
                  y=tamMatriz
                  x=tamMatriz
                }
              }
            }
          }
          if(valorPixel==0 && datO[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+0]!=0){
            datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+0]=0;
            datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+1]=0;
            datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+2]=0;
          }
        }
      }
    }
    canvasModificado.width=imageO.width
    canvasModificado.height=imageO.height
    ctx2.putImageData(imageR,0,0)
    imagenMoficado.src=canvasModificado.toDataURL();
    
    //letra2.innerHTML = "Dilatacion. Tamaño de la matriz: " + tamMatriz
  }

  function erosion(tamM,tipo){

    var imageO = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height)
    var imageR = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height)

    var datO=imageO.data
    var datR=imageR.data
    var tamMatriz=tamM
    //var matriz=new Array(tamMatriz*tamMatriz-1).fill(0)
   
    var posPixelX,posPixelY,posPixel=0
    var valorPixel,pixelCentalY,pixelCentralX,pixelCentral=0

    for(var j=0;j<(imageO.height% tamMatriz==0?imageO.height-tamMatriz:imageO.height-tamMatriz-(imageO.height%tamMatriz));j++){
      for(var i=0;i<(imageO.width%tamMatriz==0?imageO.width-tamMatriz:imageO.width-tamMatriz-(imageO.width%tamMatriz));i++){  
        valorPixel=255
        pixelCentralX=(i+parseInt(tamMatriz/2))*4+0
        pixelCentalY=(j+parseInt(tamMatriz/2))*imageO.width*4
        pixelCentral=pixelCentalY+pixelCentralX
        if(datO[((j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+0)]==0){
          for(var y = 0; y < tamMatriz; y++){
            for (var x = 0; x < tamMatriz; x++){
              
              //matriz[y*tamMatriz+x]=datO[j*imageO.width+i*4+0-]
              posPixelY=(j+y)*imageO.width*4
              posPixelX=(i+x)*4
              posPixel=posPixelY+posPixelX
              if(tipo==false || pixelCentralX==posPixelX || pixelCentalY==posPixelY){ 
                let pixel=datO[(j+y)*imageO.width*4+(i+x)*4]
                
                if(pixel!=0){
                    valorPixel=0;
                    y=tamMatriz
                    x=tamMatriz
                    //console.log("entro")
                }
              }  
            }
          }
          if(valorPixel!=255){
              datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+0]=255;
              datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+1]=255;
              datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+2]=255;
          }
          valorPixel=255
        }
      }
    }
    canvasModificado.width=imageO.width;
    canvasModificado.height=imageO.height;
    ctx2.putImageData(imageR,0,0);
    imagenMoficado.src=canvasModificado.toDataURL();
    //letra2.innerHTML = "Dilatacion. Tamaño de la matriz: " + tamMatriz
  }
  function perimetro(tamM,tipo){
      
    var imageO = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height)
    var imageR = ctx2.getImageData(0,0,canvasOriginal.width,canvasOriginal.height)

    var datO=imageO.data
    var datR=imageR.data
    var tamMatriz=tamM
    //var matriz=new Array(tamMatriz*tamMatriz-1).fill(0)
 
    var posPixelX,posPixelY,posPixel=0
    var valorPixel,pixelCentalY,pixelCentralX,pixelCentral=0

    for(var j=0;j<(imageO.height% tamMatriz==0?imageO.height-tamMatriz:imageO.height-tamMatriz-(imageO.height%tamMatriz));j++){
      for(var i=0;i<(imageO.width%tamMatriz==0?imageO.width-tamMatriz:imageO.width-tamMatriz-(imageO.width%tamMatriz));i++){ 
        valorPixel=255 
        pixelCentralX=(i+parseInt(tamMatriz/2))*4+0
        pixelCentalY=(j+parseInt(tamMatriz/2))*imageO.width*4
        pixelCentral=pixelCentalY+pixelCentralX
        if(datO[((j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+0)]==0){
          for(var y = 0; y < tamMatriz; y++){
            for (var x = 0; x < tamMatriz; x++){
              //matriz[y*tamMatriz+x]=datO[j*imageO.width+i*4+0-]
              posPixelY=(j+y)*imageO.width*4
              posPixelX=(i+x)*4
              posPixel=posPixelY+posPixelX
              if(tipo==false || pixelCentralX==posPixelX || pixelCentalY==posPixelY){ 
                let pixel=datO[(j+y)*imageO.width*4+(i+x)*4]
                if(pixel!=0){
                    valorPixel=0;
                    y=tamMatriz
                    x=tamMatriz
                }
              }  
            }
          }
          if(valorPixel==255){
              datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+0]=255;
              datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+1]=255;
              datR[(j+parseInt(tamMatriz/2))*imageO.width*4+(i+parseInt(tamMatriz/2))*4+2]=255;
          }
          valorPixel=255
        }
      }
    }
    canvasModificado.width=imageO.width;
    canvasModificado.height=imageO.height;
    ctx2.putImageData(imageR,0,0);
    imagenMoficado.src=canvasModificado.toDataURL();
  }
  function selectFuncion(){
    var x=0
    var y=0
    bandera=0
          canvasModificado.addEventListener("mousedown", evento => {
                  x = (evento.clientX- canvasModificado.getBoundingClientRect().x);
                  y = (evento.clientY- canvasModificado.getBoundingClientRect().y);
                  x=Math.floor(x)
                  y=Math.floor(y)
                  console.log("x",x)
                  console.log("y",y)
                  return
          });
        
         posX=y;
         posY=x;
         pulso=1;
  }
function vecinosNoNegros(posX,posY,data){
  //console.log("posx"+posX)
  //console.log("posY"+posY)
  let vecinos=new Array()
  if(posX>1 && data[posY*imagenOriginal.width+posX*4]==data[posY*imagenOriginal.width+(posX-1)*4]){
    let v=new Array(posX-1,posY)
    vecinos.push(v)
  }
  if(posX<imagenOriginal.width*4 && data[posY*imagenOriginal.width+posX*4]==data[posY*imagenOriginal.width+(posX+1)*4]){
    let v=new Array(posX+1,posY)
    vecinos.push(v)
  }
  if(posY>1 && data[posY*imagenOriginal.width+posX*4]==data[(posY-1)*imagenOriginal.width+(posX)*4]){
    let v=new Array(posX,posY-1)
    vecinos.push(v)
  }
  if(posX<imagenOriginal.height && data[posY*imagenOriginal.width+posX*4]==data[(posY+1)*imagenOriginal.width+(posX)*4]){
    let v=new Array(posX,posY+1)
    vecinos.push(v)
  } 
  return vecinos
}
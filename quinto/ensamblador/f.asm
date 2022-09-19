include duck.txt
;IMPRIME UN STRING EN LA POSICION Y COLOR INGRESADOS

muestra macro nomb,n1
	;debe de ingresar las balas, si se incrementa o dec
	mov al,bls
	or al,30h
	mov b[0],al
	display_string nomb,23,3,n1,52
	display_string balas,23,55,6,55
	display_string b,23,63,1,55
	call score1
	ret
endm

NICKY macro arr,a	;CREA EL ARCHIVO Y PIDE DATOS
	LOCAL PEDIRB,PEDIRAB,F1B
	copia game_score,suma1
	;el nombre completo se ingresa al archivo
	display_string nom,7,10,16,40
	mov x2,12	;columnas
	mov y2,10	;filas
	call posXY
pedirB:
	mov ah,01h
	int 21h
	mov vec[si],al
	inc si
	cmp al,0dh	;enter
	mov nvec,si
	ja pedirB
	jb pedirB
	CALL LIMPIA
	;el nick name es usado en el juego
	display_string nom1,7,10,18,40
	mov x2,12	;columnas
	mov y2,10	;filas
	call posXY
	MOV BX,0
pediraB:
	mov ah,01h
	int 21h
	mov arr[BX],al
	inc BX
	cmp al,0dh	;enter
	ja pediraB
	jb pediraB
	mov a,bx
	copianom nomb,arr
	mov n1,bx
	inc ves
F1B:	RET
endm

copianom macro nomb,nomb1	;copia vec2 en vec1
	cld
	mov cx,10
	lea di,nomb	 ;receptora
	lea si,nomb1 ;emisora
	rep movsb
endm
	
copia macro may,inte	;copia vec2 en vec1
	cld
	mov cx,04
	lea di,may	;receptora
	lea si,inte	;emisora
	rep movsb
endm

.model small
.stack 1024h
.data
Modog  	DB "DUCK HUNT",13,10,'$'	
MEN DB  "F1.- 	JUGAR",13,10,'$'
MEN2 DB "F2.- 	SCORE",13,10,'$'
men3 db "F3.- 	CREDITOS",13,10,'$'
MEN1 DB "ESC.- 	SALIR",13,10,'$'
menover db "G A M E    O V E R$"
salta db 13,10,"$"
MENS DB "[1].- MENU",13,10,'$'
menContinua DB "Enter para continuar$"
y2 db 0
x2 db 0
;---------ARCHIVO
nom db 'Nombre completo:$'	;tam=16
nom1 db 'Nick name(MAX<10):$'		;tam=18
nombre db 'patoo.txt',0 ;nombre archivo y debe terminar en 0
vec db 70 dup('$')	;vector a escribir en el archivo
handle dw 0	
linea db 10,13,'$'
TAMC DW ?
PL1 DB 10 DUP('$')	;nombre primer lugar
PL2 DB 10 DUP('$')	;nombre segundo lugar
PL3 DB 10 DUP('$')	;nombre tercer lugar
PL4 DB 10 DUP('$') ;por si hay un jugador que no queda en los 3 primeros lugares 
aux db 10 dup('$')
aux1 db 10 dup('$')
nomb db 10 dup('$')
n1 dw 0
px1 dw 0
px dw 0	;numero de jugador, al ingresar
P1 DW 0	;NUMERO DE CARACTERES DE LOS JUGADORES (nickname)
P2 Dw 0
P3 Dw 0
P4 DW 0
nvec dw 0	;tamaño del nombre del jugador
ves db 0
;-------------------JUGAR
LUGAR DB 0	;en que lugar quedan
nivel dw 65000
;-------------------score
SCO DB "0000$"	;score de 4 lugar
SCO1 DB "0000$"	
SUMA1 DB "0000$"	;SCORE JUGADOR 1
SUMA2 DB "0000$"	;SCORE JUGADOR 2
SUMA3 DB "0000$"	;SCORE JUGADOR 3
MAY DB "0000$" 	;SCORE MAS ALTO
INTE DB "0000$"	;SCORE SEGUNDO LUGAR
MIN DB "0000$"	;SCORE TERCER LUGAR
VECAUX DB "0000$"
VEC2 DB "0000$"
SUMAUX DB "0000$"
game_score  db "0000$"
scort dw ?
s1 db "Nickname"
s2 db "Score:"
balas db "Balas:"
bls db 4 ;numero de balas
b db "0$"	;numero de balas en pantalla
num db "1.-",'$'
num1 db "2.-",'$'
num2 db "3.-",'$'
num3 db "4.-",'$'
posit db 0	; posit=0 menor, posit=1 iguales, posit=2 mayor
;---------------CREDITOS
M DB "CREADO POR:",13,10,'$'
M1 DB "BEDOLLA MARTINEZ BEATRIZ",13,10,'$'
M2 DB "TRANQUILINO HERNANDEZ GARCIA",13,10,'$'
;------------------------------------------------------------------------------
;-----------------------------TRANQUILINO-------------------------------------
;------------------------------------------------------------------------------
;_______________datos para el delay
ti_min db 0
ti_seg db 0
pausa  dw 0
tiempo dw 60
;____________
num_aleatorio dw 0
COLOR    DB 3
mouseMen db "mouse no diponible$"
;-------------------------

;__datos_para_el_pato_1________________
pato1X DW -30  ; MINIMU 0, MAXIMO 320
pato1Y Db 100  ; MINIMO 0, MAXIMO 200
pato1Vida db 1
pato1FPS  db 1
pato1Dir  db 0
pato1DistanciaCentro1 dw 0
pato1DistanciaCentro2 dw 0
;__datos_para_el_pato_2________________
pato2X DW -150  ; MINIMU 0, MAXIMO 320
pato2Y Db 50  ; MINIMO 0, MAXIMO 200
pato2Vida db 1
pato2FPS  db 1
pato2Dir  db 0
pato2DistanciaCentro1 dw 0
pato2DistanciaCentro2 dw 0
;__datos_para_el_pato_3________________
pato3X DW -60  ; MINIMU 0, MAXIMO 320
pato3Y Db 50  ; MINIMO 0, MAXIMO 200
pato3Vida db 1
pato3FPS  db 1
pato3Dir  db 0
;_____________________________________
patoVida DB 1
FPS DB 1
DIR DB 0
patoDir  DB 1

;__datos_mira__________________________
miraX dw 50
miraY dw 50
click dw 0
;__matriz_del_pato_alas_abiertas_______

Mpato1_1 db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,00,00,00,00,00,00,00,00, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7,00,00,15,15,15,15,15,15,15,40,00,00,  7, 7, 7, 7,02,02,02,02,02, 7, 7, 7, 7, 7, 7
	   db  7,00,00,15,15,15,15,15,15,15,15,15,40,40,40, 00, 7, 7,02,02,02,02,02,02,02, 7, 7, 7, 7, 7
	   db  7,00,15,15,15,15,15,15,15,15,15,15,40,40,40, 40,42,02,02,02,02,00,00,02,02,42, 7, 7, 7, 7
	   db 00,00,15,15,15,15,15,15,15,15,15,15,40,40,40, 40,42,02,02,02,02,00,00,02,02,00,42, 7, 7, 7
	   db 00,15,15,15,15,15,15,15,15,15,15,15,40,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42, 7, 7
	   db 00,15,15,15,15,15,15,15,15,15,00,00,40,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42,42, 7
	   db 00,00,15,15,15,15,15,15,00,00,15,15,00,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42,42,42

	   db  7,00,00,15,15,15,15,00,15,15,15,15,00,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42, 7, 7
	   db  7, 7,00,00,15,15,15,00,15,15,15,15,00,00,40, 40,00, 7,02,02,02,02,02,02, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7,00,00,15,15,00,15,15,15,15,15,00,40, 00,00, 7, 7,02,02,02,02, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,00,00,15,15,15,15,15,00,00, 00, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7,00,00,15,15,15,15,00, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,00,15,15,15,00,00, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,00,15,15,00,00, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,00,15,00,00, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,00,00,00, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,00,00, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7

;__matriz_del_pato_alas_cerradas_______
Mpato1_2 db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,00,00,00,00,00,00,00,00, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7,00,00,15,15,15,15,15,15,15,40,00,00,  7, 7, 7, 7,02,02,02,02,02, 7, 7, 7, 7, 7, 7
	   db  7,00,00,00,00,00,00,00,00,15,15,15,40,40,40, 00, 7, 7,02,02,02,02,02,02,02, 7, 7, 7, 7, 7
	   db  7,00,15,15,15,15,15,15,00,00,15,15,40,40,40, 40,42,02,02,02,02,00,00,02,02,42, 7, 7, 7, 7
	   db 00,00,15,15,15,15,15,15,15,00,00,00,40,40,40, 40,42,02,02,02,02,00,00,02,02,00,42, 7, 7, 7
	   db 00,15,15,15,15,15,15,15,15,15,15,00,40,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42, 7, 7
	   db 00,15,15,15,15,15,15,15,15,15,00,00,40,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42,42, 7
	   db 00,00,00,00,00,15,15,15,00,00,15,15,40,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42,42,42

	   db  7,00,15,15,00,00,00,00,15,15,15,15,40,40,40, 40,42,02,02,02,02,02,02,02,02,02,42,42, 7, 7
	   db  7, 7,00,00,15,15,15,15,15,15,15,15,40,40,40, 40,00, 7,02,02,02,02,02,02, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7,00,00,15,15,15,15,15,15,15,15,40,40, 00,00, 7, 7,02,02,02,02, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,00,15,15,15,15,15,00,00,00, 00, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7,00,00,00,00,00,00, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,07,07,07, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7,07,07,07, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7
;____________________________ para el pato diagonal
DpatoDia db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7,02,02,02,42,42,42,42,42,42, 7, 7, 7, 7
		 db  7, 7, 7, 7, 7, 7, 7, 7, 7,00,00,00,00, 7, 7,  7,02,02,00,02,02,02,00,42,42,42, 7, 7, 7, 7
		 db  7, 7, 7, 7, 7, 7,00,00,00,00,15,15,00,00, 7, 02,02,02,02,02,02,02,02,42,42,42, 7, 7, 7, 7
		 db  7, 7, 7, 7, 7,00,00,15,15,15,15,15,00,40, 7, 02,02,02,02,02,02,02,02,02,00,42, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,15,15,15,15,15,15,15,40,40,42, 42,02,02,02,02,02,02,02,02,02,42, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,00,00,15,15,00,15,40,40,40, 42,42,02,02,02,02,02,02,02,02,02, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7,00,00,00,15,15,40,40,40, 40,42,42,02,02,02,02,02,00,02, 7, 7, 7, 7, 7
		 db  7, 7, 7, 7, 7, 7, 7, 7,00,15,15,15,15,40,40, 40,40,42,42,02,02,02,02,02,02, 7, 7, 7, 7, 7
		 db  7, 7, 7, 7, 7, 7, 7,00,00,15,15,15,15,40,40, 40,40,40,42,42,02,02,02,02, 7, 7, 7, 7, 7, 7
		 db  7, 7, 7, 7, 7, 7,00,00,15,15,15,15,15,15,40, 40,40,40,40,42,42,02, 7, 7, 7, 7, 7, 7, 7, 7

	   db  7, 7, 7, 7, 7,00,00,15,15,15,15,15,15,15,15, 15,40,40,40,40,42,00,00,00, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7,00,15,15,15,15,15,15,15,15,15, 15,40,40,40,40,00,15,15,00,00, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,15,15,15,15,15,15,15,15,15, 15,15,15,00,15,15,15,15,15,00, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,15,15,15,15,15,15,15,15,15,15, 15,15,15,00,00,15,15,15,15,00, 7, 7, 7, 7, 7
	   db  7, 7, 7,00,00,15,15,15,15,15,15,15,15,15,15, 15,00,00,00,00,15,15,15,15,00, 7, 7, 7, 7, 7
	   db  7, 7, 7,00,00,15,15,15,15,15,15,15,15,15,00, 00,00, 7, 7, 7,00,15,15,15,00, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7,00,00,15,15,15,15,15,00,00,00,00,  7, 7, 7, 7, 7,00,15,15,00,00, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7,00,15,15,15,00,00,00,00, 7, 7,  7, 7, 7, 7, 7,00,15,15,00, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7,00,00,00,00,00, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7,00,15,00, 7, 7, 7, 7, 7, 7, 7
	   db  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,  7, 7, 7, 7, 7, 7,00, 7, 7, 7, 7, 7, 7, 7, 7

MtrxMira DB  7, 7, 7, 7, 7, 7,00, 7, 7, 7, 7, 7, 7
		 DB  7, 7, 7, 7,00,00,00,00,00, 7, 7, 7, 7
		 DB  7, 7, 7,00, 7, 7, 7, 7, 7,00, 7, 7, 7
		 DB  7, 7,00, 7, 7, 7, 7, 7, 7, 7,00, 7, 7
		 DB  7,00, 7, 7, 7, 7,00, 7, 7, 7, 7,00, 7
		 DB  7,00, 7, 7, 7, 7,00, 7, 7, 7, 7,00, 7
		 DB 00,00, 7, 7,00,00, 7,00,00, 7, 7,00,00
		 DB  7,00, 7, 7, 7, 7,00, 7, 7, 7, 7,00, 7
		 DB  7,00, 7, 7, 7, 7,00, 7, 7, 7, 7,00, 7
		 DB  7, 7,00, 7, 7, 7, 7, 7, 7, 7,00, 7, 7
		 DB  7, 7, 7,00, 7, 7, 7, 7, 7,00, 7, 7, 7
		 DB  7, 7, 7, 7,00,00,00,00,00, 7, 7, 7, 7
		 DB  7, 7, 7, 7, 7, 7,00, 7, 7, 7, 7, 7, 7
;mjuego
variable_j db 0
.code
inicio proc far
;PROTOCOLO
PUSH DS
SUB  AX,AX
PUSH AX
MOV  AX,@data
MOV  DS,AX ; DS=ESpunto
MOV ES,AX

;Inicia programa
	CALL GRAPH  ;Iniciamos modo grAfico
CICL:
	CALL MENU   
	JMP CICL
	ret
inicio endp

;--------------------------PRODEDIMIENTOS------------------------------------
;----------------------------------------------------------------------------
;----------------------------INICIA------------------------------------------
lees proc
	mov ah,08
	int 21h
	ret
lees endp

leer PROC
	MOV  AH,00H   
	INT  16H		
	CALL LIMPIA
	CALL JUGAR
    CALL PUNTAJE
	;CALL CREDITOS
	CALL FIN	
	RET
leer ENDP

menu proc
	mov cx,0
	mov dx,0
	CALL LIMPIA
	display_string modog,6,17,9,55
	display_string men,10,13,12,54 
	display_string men2,12,13,12,53 
	display_string men3,14,13,14,52 
	display_string men1,16,13,12,51 
	call leer
	ret
menu endp

SALTE PROC
	LEA DX,SALTA
	CALL CADENA
	RET
SALTE ENDP

GRAPH PROC           ;Inicia modo grAfico
    MOV AH, 00H      ;Set video mode (Func 00/int 10h)
    MOV AL, 13H      ;12h = 80x30 8x16 640x480 16/256k A000 VGA, ATI, VIP
    INT 10H          ;Interrupt 10h Video functions
	RET
GRAPH   ENDP

modo_normal PROC     ;proc restaura a su forma normal
	CALL LIMPIA
	MOV AL, 03H
	MOV AH, 00
	INT 10H
	ret
modo_normal ENDP

limpia PROC
	PUSH AX
	PUSH DX
	MOV  AX,0600h
	MOV  BH,00h
	MOV  CX,0000h
	MOV  DX,184Fh
	INT  10h
	POP  DX
	POP  AX
	ret
limpia ENDP

FIN PROC
	CMP AH,01H	;ESC
	JNE FIN3
	call modo_normal  	 ;restaura la pantalla a su forma normal
	mov  ah,4ch
	int  21h
FIN3:
	RET
FIN ENDP

;-----------------------------------JUGAR++++++++++++++++++++++++++++++++<3
;-------------------------------------------------------------------------
nickys proc
	cmp ves,0
	je qqq
	cmp ves,1
	je qq
	cmp ves,2
	je rtt
	cmp ves,3
	jge tt4
rtt: JMP RTT1
TT4: JMP TT40
qqq: call nick
	jmp y5
qq: NICKY PL2,P2
	jmp y5
rtt1: NICKY PL3,P3
	jmp y5
tt40: NICKY PL4,P4
y5: ret
nickys endp

NICK PROC	;CREA EL ARCHIVO Y PIDE DATOS
	;el nombre completo se ingresa al archivo
	display_string nom,7,10,16,40
	mov x2,12	;columnas
	mov y2,10	;filas
	call posXY
pedir:
	mov ah,01h
	int 21h
	mov vec[si],al
	inc si
	cmp al,0dh	;enter
	mov nvec,si
	ja pedir
	jb pedir
	CALL LIMPIA
	;el nick name es usado en el juego
	display_string nom1,7,10,18,40
	mov x2,12	;columnas
	mov y2,10	;filas
	call posXY
	MOV BX,0
pedira:
	mov ah,01h
	int 21h
	mov PL1[BX],al
	inc BX
	cmp al,0dh	;enter
	ja pedira
	jb pedira
	mov p1,bx
	copianom nomb,pl1
	mov n1,bx
	MOV VES,1
F1:	RET
NICK ENDP

NICK1 PROC
	;crear
	mov ah,3ch
	mov cx,0
	mov dx,offset nombre
	int 21h
	jc F1 	;si no se pudo crear
	
	;Escritura de archivo
	mov bx,ax ; mover hadfile
	mov cx,nvec ;num de caracteres a grabar
	mov dx,offset VEC
	mov ah,40h
	int 21h
	mov handle,ax
	JC F1

	;ubicacion del apuntador
	mov bx,ax
	mov cx,si
	mov dx,ax
	mov ah,42h
	mov al,01h	;00h pincipio, 01h posicion actual y o2h posicion final
	int 21h
	mov handle,ax
	;Escritura de archivo
	mov bx,ax ; mover hadfile
	mov cx,4 ;num de caracteres a grabar
	mov dx,offset game_score
	mov ah,40h
	int 21h
	mov handle,ax
	JC F1
	;Cerrar archivo
	mov ah,3Eh
	mov bx,ax
	int 21h
	RET
NICK1 ENDP

JUGAR PROC	;INICIA EL JUEGO
	CMP AH,3BH	;f1
	JNE FELIZ
	call limpia
	CALL NICKys
	call limpia
	call juego
	call puntaje1
	call limpia
	call menu
FELIZ:	RET
JUGAR ENDP 

muestra1 proc
	;debe de ingresar las balas, si se incrementa o dec
	mov al,bls
	or al,30h
	mov b[0],al
	display_string pl1,23,3,p1,52
	display_string balas,23,55,6,55
	display_string b,23,63,1,55
	call score1
	ret
muestra1 endp
;-----------------------------------SCORE**************************************
;------------------------------------------------------------------------
muestras proc
	display_string pl1,23,3,p1,52
	ret
muestras endp

nombres1 proc	;no existe ningun jugador
	copia may,game_score
	display_string num,10,5,3,38
	display_string PL1,10,9,p1,38
	display_string may,10,24,4,38
	call lees
	ret
nombres1 endp

nombre2 proc	;existen 1 jugador e ingresa otro
	MAYORG1 game_score
	display_string num,10,5,3,38
	display_string PL1,10,9,p1,38
	display_string MAY,10,24,4,38
	display_string num1,14,5,3,39
	display_string PL2,14,9,p2,39
	display_string INTE,14,24,4,39
	call lees
	ret
nombre2 endp

nombre3 proc	;existen 2 jugadores e ingresa otro
	MAYORG2 game_score
	display_string num,10,5,3,38
	display_string PL1,10,9,p1,38
	display_string MAY,10,24,4,38
	display_string num1,14,5,3,39
	display_string PL2,14,9,p2,39
	display_string INTE,14,24,4,39
	display_string num2,18,5,3,40
	display_string PL3,18,9,p3,40
	display_string MIN,18,24,4,40
	ret
nombre3 endp

NOMBRES PROC
	MAYORG game_score	;existen 3 jugadores e ingresa otro
	call nombre3
	cmp lugar,4
	jne you
	display_string num3,18,5,3,40
	display_string PL4,18,9,p4,40
	display_string sco,18,24,4,40
you:	call lees
	RET
NOMBRES ENDP

score1 proc
        push ax
        push bx
        push cx
        push dx
        mov cx,10d
        xor bx,bx
        mov bx,3
        mov ax,scort
tori:
        xor dx,dx
        div cx
        or dl,30h
        mov game_score[bx],dl
        dec bx
        or ax,ax
        jne tori
		display_string s2,22,148,6,52
        display_string game_score,22,155,4,52
        pop dx
        pop cx
        pop bx
        pop ax
        ret
score1 Endp

PUNTAJE1 PROC 
	call limpia
	display_string s1,4,9,8,37
	display_string s2,4,24,5,37
	cmp ves,1
	je nnn
	cmp ves,2
	je nn
	cmp ves,3
	je nnnn
	CALL NOMBRES
	JMP MM
nnn: call nombres1
	 JMP MM
nn:call nombre2
	JMP MM
nnnn: call nombre3
	;call lees
MM:	ret
PUNTAJE1 ENDP

PUNTAJE PROC 
	push ax
	CMP AH,3CH	;F2
	JNE rro
	call limpia
	display_string s1,4,9,8,37
	display_string s2,4,24,5,37
	cmp ves,1
	je nnn1
	cmp ves,2
	je nn1
	cmp ves,3
	je nnnn1
	CALL NOMBRES
nnn1: call nombres1
		jmp rro
nn1:call nombre2
	jmp rro
nnnn1: call nombre3
		call lees 
		call menu
rro:	ret
PUNTAJE ENDP
;-----------------------------------CREDITOS||||||||||||||||||||||||||||||
;-------------------------------------------------------------------------
POSXY proc
    PUSH AX
    PUSH BX
    PUSH DX
    MOV AH, 02h
    MOV BH, 0
    MOV DH, y2
    MOV DL, x2
    INT 10H
    POP DX
    POP BX
    POP AX
    ret
POSXY endp

CREDITOS PROC
	CMP AH,3DH	;F3
	JNE cred
	call limpia
	display_string m ,10,15,11,40 
	display_string m1,12,10,24,41 
	display_string m2,14,08,28,42
	call lees 
	call menu
CRED: RET
CREDITOS ENDP
;---------------------------EXTRAS----------------------------

ESCRIBE PROC
	MOV AH,02
	INT 21H
	RET
ESCRIBE ENDP

cadena proc
	push ax
	mov ah,09
	int 21h
	pop ax
	ret
cadena endp

crear proc
	;crear
	mov ah,3ch
	mov cx,0
	mov dx,offset nombre
	int 21h
	jc f9
	jmp y6y
f9:	call fin
y6y: ret
crear endp

archivos proc
	;crear
	mov ah,3ch
	mov cx,0
	mov dx,offset nombre
	int 21h
	jc Fg 	;si no se pudo crear
	
 ;Escritura de archivo
	mov bx,ax ; mover hadfile
	mov cx,si ;num de caracteres a grabar
	mov dx,offset vec
	mov ah,40h
	int 21h
	JC Fg
	mov handle,ax
 ;ubicacion del apuntadorl
	mov bx,handle
	mov cx,0
	mov dx,70h
	mov ah,42h
	mov al,01h	;00h pincipio, 01h posicion actual y o2h posicion final
	int 21h
 ;Escritura de archivo
	mov bx,ax ; mover hadfile
	mov cx,4 ;num de caracteres a grabar
	mov dx,offset game_score
	mov ah,40h
	int 21h
	JC Fg
	mov handle,ax
;Cierre de archivo
	mov ah,3eh
	int 21h
fg:	ret
archivos endp
;------------------------------------------------------------------------------
;-----------------------------TRANQUILINO-------------------------------------
;------------------------------------------------------------------------------
Pintamira proc
	push ax
	push bx
	mov ax, miraX
	mov bx, miraY
	lea si, MtrxMira
	pinta_mira ax, bx
	pop bx
	pop ax
	ret
Pintamira endp

Pintapato proc
	cmp patoVida, 1
	; Dx <= patoX
	; Bx <= patoY
	; FPS <= patoFPS
	; Dir <= patodir
	je vi1
	jmp fpp
	vi1:
		cmp patoVida, 0
		jne ddd
			lea si, DpatoDia
			jmp d1
		ddd:
		cmp FPS,50
		jne fp2
			lea si, Mpato1_1
			mov  FPS, 1
			jmp pi
		fp2:
		cmp FPS, 25
		jg fp3
			lea si, Mpato1_2
			jmp pi
		fp3:
			lea si, Mpato1_1
			jmp pi
		pi:
		add FPS, 1
		cmp DIR, 0
		jne d1
			pinta30_20 dx, bx
			jmp d
		d1:
		cmp DIR, 1
		JNE D2
			pinta30_20_inverso dx, bx
			jmp d
		D2:
		cmp DIR, 2
		jne d3
			lea si, DpatoDia
			pinta30_20 dx, bx
			jmp d
		d3:
		cmp DIR, 3
		JNE d
			lea si, DpatoDia
			pinta30_20_inverso dx, bx
		d:
	fpp:
	ret
Pintapato endp


juego proc
	mov bls, 4
	mov click, 0
	mov nivel, 65000
	mov scort, 0
	mov game_score[0], '0'
	mov game_score[1], '0'
	mov game_score[2], '0'
	mov game_score[3], '0'
	CALL ini_mouse
	 cmp ax, 0000
 	 jne noerr
 			lea dx, mouseMen
 			call cadena
			jmp fin_juego
 	noerr:
	mov ax, 04
	mov cx, 100
	mov dx, 100
	int 33h
	;___________________
call TIERRA				;listo

	cicloP:
	cmp click, 2
	je pause
	cmp bls, 0
	je fin_juego
			call paisaje			; listo
			call limita_mouse
			call pintamira		;listo
			call ejes_raton		;listo
			;verificar si uno de los patos a sido disparado
			;call virifica_vida_patos
			
			call verifica_vida_patos
			call juega_pato1
			call juega_pato2
			call juega_pato3
			call muestreJuego
			
			push cx
				mov cx, 65000
				rdd:
			loop rdd
			pop cx
			
	jmp cicloP
pause:
	call pause1
	jmp cicloP

	fin_juego:
	
	call gameover
	ret
juego endp

muestreJuego proc
	muestra nomb,n1
	ret
muestreJuego endp

pause1 proc
	MOV  AX,0600h
	MOV  BH, 02
	MOV  CX,0800h
	MOV  DX,107Fh
	INT  10h
	mov x2,12	;columnas
	mov y2,10	;filas
	call posXY
	lea dx, menContinua
	call cadena
	call lees	
	call ejes_raton
	ret
pause1 endp

gameover proc
	;limpia pantalla
	call limpia
	;escribe mensaje game over	
	mov x2,12	;columnas
	mov y2,10	;filas
	call posXY
	lea dx, menover
	call cadena
	mov x2,12	;columnas
	mov y2,15	;filas
	call posXY
	lea dx, menContinua
	call cadena
ffg:	call lees
	cmp al,0dh
	jne ffg
	ret
gameover endp

verifica_vida_patos proc
		push cx
		push dx
		cmp click, 1
		jne no_disparo
			;pato1
				mov cx, pato1X
				mov dx, 0
				mov dl, pato1Y
				call patovivo?
				mov pato1Vida, bh
			;pato2
				mov cx, pato2X
				mov dx, 0
				mov dl, pato2Y
				call patovivo?
				mov pato2Vida, bh
			;pato3
				mov cx, pato3X
				mov dx, 0
				mov dl, pato3Y
				call patovivo?
				mov pato3Vida, bh	
			
			cmp pato1vida, 1
			jne si_disparo
			cmp pato2Vida, 1
			jne si_disparo
			cmp pato3Vida, 1
			jne si_disparo
				sub bls, 1
				;___________________
				call sonido_fallo
				;_________________
				jmp no_disparo
		si_disparo:
				;___________________
				call sonido_acerto
				;_________________
				sub nivel, 1
				cmp nivel, 10
				jg no_disparo
					mov nivel, 20
		no_disparo:
		pop dx
		pop cx
		ret
verifica_vida_patos endp
sonido_fallo proc
		mov cx, 2637
		call frecuencia
		call inicializa
		call cargar
		call sonido
		push cx
			mov cx,60000
			rddd:
			loop rddd
		pop cx
					
		call desactivar
		ret
sonido_fallo endp		
sonido_acerto proc
		mov cx, 2093
		call frecuencia
		call inicializa
		call cargar
		call sonido
		push cx
			mov cx,60000
			rdddd:
			loop rdddd
		pop cx
					
		call desactivar
		ret
sonido_acerto endp		
patovivo? proc
		; cx <= X
		; dx <= Y
		;add cx,
		;cmp cx, miraX
		
		sub cx, 15
		sub dx, 8		
		
		cmp cx, miraX
		jg fuera
		
		add cx, 27
		cmp cx, miraX
		jl fuera
		
		cmp dx, miraY
		jg fuera
		add dx, 12
		cmp dx, miray
		jl fuera
		
			;add sc
			mov bh, 0   ;retornamos en dh 0
			jmp s
			
		fuera:
			mov bh, 1
		s:
		ret
patovivo? endp
limita_mouse proc
		push ax
		push cx
		push dx

		mov ax, 07
		mov cx, 0000
		mov dx, 320
		int 33h

		mov ax, 08
		mov cx, 0000
		mov dx, 150
		int 33h

		pop dx
		pop cx
		pop ax
		ret
limita_mouse endp
juega_pato1  proc
		PUSH DX
		PUSH BX
		PUSH AX
		cmp pato1Vida, 0
		je muerto
		cmp pato1X, 350
		je vivio
					;cmp pato1FPS, 60
					;jne fd
					;mov  pato1FPS, 1
					;fd:
			MOV DX,  pato1X
			MOV BX, 0
			MOV BL,  pato1Y
			mov al, pato1FPS
			MOV FPS, al
			mov ah, pato1Dir
			MOV DIR, ah
			mov ah, pato1Vida
			MOV patoVida, ah
			call Pintapato
			mov al, FPS
			MOV pato1FPS, al
			MOV AL, DIR
			mueve_pato AL
			mov pato1X, dx
			mov pato1Y, bl
		
			jmp nopit2
		muerto:
			add scort, 10
			mov pato1Vida, 1
			jmp nopit
		vivio:
			sub scort, 1
			cmp scort, -1
			jg sssc
				mov scort, 0
			sssc:	
			cmp scort, 10
			jg sscr
				mov game_score[2],"0"
			sscr:
			cmp scort, 100
			jg	sscr2
				mov game_score[1], "0"
			cmp scort, 1000
			sscr2:
			jg	sscr31
				mov game_score[1], "0"	
			sscr31:	
		nopit:
			;selecciona nuevo inicio x,y con aleatorio
			mov num_aleatorio, 130
			call crea_aleatorio
			add num_aleatorio, 10
			mov bx, num_aleatorio
			mov pato1Y, bl
			mov pato1X, -30

		nopit2:
		POP AX
		POP BX
		POP DX
		ret
juega_pato1 endp
juega_pato2  proc
		PUSH DX
		PUSH BX
		PUSH AX
		cmp pato2Vida, 0
		je muerto2
		cmp pato2X, 350
		je vivio2
			MOV DX,  pato2X
			MOV BX, 0
			MOV BL,  pato2Y
			mov al, pato2FPS
			MOV FPS, al
			mov ah, pato2Dir
			MOV DIR, ah
			mov ah, pato2Vida
			MOV patoVida, ah
			call Pintapato
			mov al, FPS
			MOV pato2FPS, al
			MOV AL, DIR
			mueve_pato AL
			mov pato2X, dx
			mov pato2Y, bl

			jmp pit2
		muerto2: 
			add scort, 10
			mov pato2Vida, 1
			jmp nopitp2
		vivio2:
			sub scort, 1
			cmp scort, -1
			jg sssc2
				mov scort, 0
			sssc2:	
			cmp scort, 10
			jg sscrr2
				mov game_score[2],"0"
			sscrr2:
			cmp scort, 100
			jg	sscr22
				mov game_score[1], "0"
			cmp scort, 1000
			sscr22:
			jg	sscr32
				mov game_score[1], "0"	
			sscr32:	
		nopitp2:
			call reini_1

		pit2:
		POP AX
		POP BX
		POP DX
		ret
juega_pato2 endp
reini_1 proc
		;selecciona nuevo inicio x,y con aleatorio
		mov num_aleatorio, 110
		call crea_aleatorio
		add num_aleatorio, 30
		mov bx, num_aleatorio
		mov pato2Y, bl
		mov pato2X, -200
		ret
reini_1 endp		
juega_pato3 proc
		PUSH DX
		PUSH BX
		PUSH AX
		cmp pato3Vida, 0
		je muerto3
		cmp pato3X, 350
		je vivio3
			MOV DX,  pato3X
			MOV BX, 0
			MOV BL,  pato3Y
			mov al, pato3FPS
			MOV FPS, al
			mov ah, pato3Dir
			MOV DIR, ah
			mov ah, pato3Vida
			MOV patoVida, ah
			call Pintapato
			mov al, FPS
			MOV pato3FPS, al
			MOV AL, DIR
			mueve_pato AL
			mov pato3X, dx
			mov pato3Y, bl

			jmp pit3
		muerto3: 
			add scort, 10
			mov pato3Vida, 1
			jmp nopitp3
		vivio3:
			
			sub scort, 1
			cmp scort, -1
			jg sssc3
				mov scort, 0
			sssc3:	
			cmp scort, 10
			jg sscr322
				mov game_score[2],"0"
			sscr322:
			cmp scort, 100
			jg	sscr23
				mov game_score[1], "0"
			cmp scort, 1000
			sscr23:
			jg	sscr33
				mov game_score[1], "0"	
			sscr33:	
		nopitp3:
			;selecciona nuevo inicio x,y con aleatorio
			mov num_aleatorio, 110
			call crea_aleatorio
			add num_aleatorio, 30
			mov bx, num_aleatorio
			mov pato3Y, bl
			mov pato3X, -100

		pit3:
		POP AX
		POP BX
		POP DX
		ret
juega_pato3 endp
paisaje proc
	PUSH AX
	PUSH DX
	MOV  AX,0600h
	MOV  BH, 11
	MOV  CX,0000h
	MOV  DX,134Fh
	INT  10h
	POP  DX
	POP  AX
	ret
paisaje endp
TIERRA PROC
	PUSH AX
	PUSH DX

	MOV  AX,0600h
	MOV  BH, 02
	MOV  CX,1400h
	MOV  DX,157Fh
	INT  10h

	MOV  AX,0600h
	MOV  BH, 06
	MOV  CX,1600h
	MOV  DX,187Fh
	INT  10h
	POP  DX
	POP  AX
RET
TIERRA ENDP
m_mouse proc
	push ax
	mov ah, 01h
	int 33h
	pop ax
	ret
m_mouse endp
F_mouse proc
	push ax
	mov ax, 02
	int 33h
	pop ax
	ret
F_mouse endp
ejes_raton proc
	push ax
	push cx
	push dx
		mov ax, 03
		int 33h
		mov miraX, cx	; en cx <= cord x
		mov miraY, dx	; em dx <= cordenadas y
	cmp click, 1
	je dis
		cmp click, 3
		je dis
		mov click, bx ; donde bx = 1 o 0 en boton izquierdo
		jmp dp
		
	dis:
		cmp bx, 0
		jne doss
			mov click, 0
			jmp dp
		doss:	
		mov click, 3
	
	dp:
	
	pop dx
	pop cx
	pop ax
	ret
ejes_raton endp
ini_mouse proc
	push cx
	push dx
	mov ax, 00
	int 33h
	pop dx
	pop cx
	ret
ini_mouse endp

ALEATORIO PROC
		; XN+1=(2053*XN + 13849)MOD 2**16
		; RETORNA EL NUMERO PSEUDOALEATORIO EN AX
		MOV AX,DX 		;CARGANDO A AX EL NUMERO SEMILLA tomado de la int 21 serv2CH
		MOV DX,0 			;CARGANDO CERO EN LA POSICION MAS SIGNIFICATIVA DEL MULTIPLICANDO
		MOV BX,2053 	; MULTIPLICADOR
		MUL BX
		MOV BX,13849 	;CARGA EN BX LA CONSTANTE ADITIVA
		CLC
		ADD AX,BX 		; SUMA PARTES MENOS SIGNIFICATIVAS DEL RESULTADO
		ADC DX,0 			; SUMA EL ACARREO SI ES NECESARIO
		MOV BX,0FFFFH ; CARGAR LA CONSTANTE 2**16-1
		DIV BX
		MOV AX,DX 		; MUEVE EL RESIDUO AX
		RET
ALEATORIO ENDP
SEMILLA PROC
		PUSH AX
		MOV AH,2CH
		INT 21H 			; RETORNA CH=HORAS, EN FORMATO 00-23, MEDIANOCHE=0
									; CL MINUTOS 00-59
									;DH SEGUNDOS 00-59
									;DL CENTESIMAS DE SEGUNDO 00-99
		POP AX
		RET
SEMILLA ENDP
crea_aleatorio proc
		push ax
		push dx
		call SEMILLA
		call aleatorio
		MOV DX,0
		MOV BX, num_aleatorio ;NUMEROS ALEATORIOS ENTRE 0 Y 9
		DIV BX
		;MOV AX,DX
		mov num_aleatorio, DX		; el numero se queda en la variable
		pop dx
		pop ax
		ret
crea_aleatorio endp
;_delay proc near  bx cx, tiempo
delay proc
     mov ah,2ch
     int 21h
     mov ti_min,cl
     mov ti_seg,dh

        mov al,ti_min
        mov dl,60
        mul dl
        mov dx,ax
        xor ax,ax
        mov al,ti_seg
        add dx,ax
        mov pausa,dx

 espera:
       mov ah,2ch
       int 21h
       mov ti_min,cl
       mov ti_seg,dh
        mov al,ti_min
        mov dl,60
        mul dl
        mov dx,ax
        xor ax,ax
        mov al,ti_seg
        add dx,ax
        mov ax,dx
        sub dx,pausa
        cmp dx,tiempo
        jb espera
        ret

delay endp
frecuencia proc near
		push ax
		push dx
		mov dx,12h ; frecuencia de clk 8253
		mov ax,34dch ; frecuencia
		div cx ; dividir
		mov cx,ax ; cx cuenta de timer
		pop dx
		pop ax
		ret
frecuencia endp
inicializa proc near
		push ax
		mov al,182 		; palabra de control
		out 67,al 		; programar 8253
		pop ax
		ret
inicializa endp
sonido proc near
		push ax
		in al,97 	; leer pto 97 del 8255
		or al,03h	 	;
		out 97,al 	; activar
		pop ax ;
		ret
sonido endp
desactivar proc near
		push ax ;
		in al,97 ;
		and al,0fch ; bit 0 y bit 8255 = 0
		out 97,al ; parlante apagado
		pop ax
		ret
desactivar endp
cargar proc near
push ax
		mov al,cl ; enviar cuenta 8253
		out 66,al ;
		mov al,ch ;
		out 66,al ;
		pop ax
		ret
cargar endp
RETARDO PROC
			MOV BX,0FAAAH
		CUENTA:
			CMP BX,0
			JE SALIR
			DEC BX
			JMP CUENTA
		SALIR:
			RET
RETARDO ENDP

end inicio
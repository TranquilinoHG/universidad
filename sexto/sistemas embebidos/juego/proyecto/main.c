/*
 * LCD_Ejemplo2.c
 *
 * Created: 10/07/2020 12:04:23 a. m.
 * Author : Tranquilino Hernandez Garcia
 */ 
#define F_CPU 1000000UL
#include <avr/io.h>
#include <avr/interrupt.h>
#include <util/delay.h>
#include "LCD.h"

uint8_t teclado();
void	waitSeg(uint8_t seg);
void    imprime_num(uint8_t num);
void    limpiaValores();
void    juego();
void    LCD_write_num(uint8_t cad[], uint8_t  tam);
uint8_t validarNum(uint8_t);
uint8_t  seg = 0;			// variable para almacenar los segundos transcurridos
uint8_t  estado=0;			// variable para guardar el estado actual 
uint8_t  numero[10]={0};	// vector donde guardar los 
uint8_t  carct=0;			// varible para almacenar el caracter recivido de
uint8_t  valores[12]={1,2,3,4,5,6,7,8,9,0xFA,0,13};
uint8_t  puntos = 0;
uint8_t  numsRs = 0;
uint8_t  nivel  = 1;
uint8_t dos=0;
uint8_t numR = 0;
uint8_t numG = 0;
ISR( TIMER1_COMPA_vect )	//Interrupcion por comparacion
{
	
	seg++;
	PORTD = (PORTD==0)?1:0;	
}
int main(void)
{	DDRD = 0xFF;
	//dates para el teclado
	DDRB = 0x0F;			// Puerto B como entrada/salida 
	PORTB = 0xF0;			// Pull - Up en las entradas
	//fin datos para el teclado
	DDRC = 0xFF;	// Salida para el LCD
	LCD_reset();	// Inicializa al LCD
	//configuracion del temporizador 0 con CTC
	OCR0A = 9;
	TCCR0A = 0x02;
	TCCR0B = 0x03;
	//configuracion del temporizador 1 con CTC
	OCR1A = 15624;
	TIFR1  = 0x02;
	TIMSK1 = 0x02;	
	sei();
	while (1)
	{
		juego();  //la funcion principal	
	}
}

void waitSeg(uint8_t seg){ // funcion para esperar  segundos
	for(uint8_t i=0;i<seg;i++){
		_delay_ms(200);
		_delay_ms(200);
		_delay_ms(200);
		_delay_ms(200);
		_delay_ms(200);
	}
}
void juego(){
	//
	if(estado== 0){
		LCD_write_cad("BIENVENIDO",10);
		waitSeg(2);
		estado = 4;
		
	}
	if(estado == 1){
		
		TCCR1B=0X00;			//reinicia el contador
		seg=0;
		if(nivel ==2)
			OCR0A  = 99;
		else
			OCR0A  = 9;	
		uint8_t numA  = TCNT0;   //leer el numero aleatorio
		numero[puntos]= numA;	 //agregar al vector el valor
		estado = 2;
		LCD_write_cad("recuerda el:",12);
		imprime_num(numA);
		waitSeg(1);
		LCD_write_cad("secuencia:       ",16);
		numsRs = 0;
		TCCR1B = 0x0B;			//iniciar el contador 1
		dos =0;
		numG = numG + 1;
	}
	if(estado == 2){
		if(seg <= 2*(numG)){	// siempre y cuando no se acabe el tiempo
								// por cada numero que se tiene que ingresar se espera dos segundos
			if(puntos == 3){
				puntos = 0;
				LCD_write_cad("GANASTE",7);
				waitSeg(2);
				if(nivel == 2){
					LCD_write_cad("pulsa # para    empezar nvl 1",29);
					nivel  = 1;
					estado = 3;
				
				}
				else{
					LCD_write_cad("pulsa # para    empezar nvl 2",29);
					nivel  = 2;
					estado = 3;
				
				}
				puntos = 0;
				seg    = 0;
				numG = 0;
				TCCR1B = 0x00;
			}
			else{
				carct = teclado();
				
				if(carct != 0xFF){
					LCD_write_data(valores[carct]+0x30);
					_delay_ms(200);
					_delay_ms(100);
					if(numero[numsRs]>9 && dos<2){
						//lee dos caracteres
						if(dos==0)
						{
							numR = valores[carct]*10;
							dos=1;
						}
						else 
						{
							numR = numR + valores[carct];
							dos= 2;
						}
						
					}
					else
						{
							dos = 2;
							numR = valores[carct];
						}
					if(dos == 2){	
						TCCR1B = 0x00;	//Desactivar el temporizador
						dos= 0;
						if(numero[numsRs]==numR){
							if(numsRs == puntos){
								LCD_write_cad("correcto",8);
								waitSeg(2);
								puntos = puntos + 1;
								seg = 0;
								estado = 1;
							}
							numsRs = numsRs+1;
						}
						else{
							LCD_write_cad("Secuencia mal",13);
							waitSeg(2);
							LCD_write_cad("la secuencia    correcta es...",30);
							waitSeg(2);
							LCD_write_num(numero,numG);
							waitSeg(1);
							estado = 4;
							puntos = 0;
							numG = 0;
							nivel = 1;
						}
					}
				}
			}
		}
		else{
			TCCR1B = 0x00;	//Desactivar el temporizador
			LCD_write_cad("limite de tiempo agotado",24);
			waitSeg(2);
			estado = 4;
			numG = 0;
			nivel = 1;
			puntos = 0;
		}
	}
	if(estado == 3){
		carct = teclado();
		if(carct == 11){
			estado = 1;
		}
	}
	if(estado == 4){
		LCD_write_cad("presiona '#' para continuar",28);
		estado = 3;
	}
}
void imprime_num(uint8_t num) {
	uint16_t  temp=10;		
	uint8_t u=0;				
	while(temp > 9){
		u = num / temp;				//obtenemos el valor mas significativo
		if(num >= temp)				//si es un cero a la izquierda lo ignora
			LCD_write_data(u+0x30);	 
		num = num % temp;			//quita el valor mas significativo
		temp = temp / 10;
	}
	LCD_write_data((num/temp)+0x30);
}
//devuelve un valor entero del 0 - 15
uint8_t  teclado() {
	uint8_t   sal[4] = { 0xFE, 0xFD, 0xFB, 0xF7 };
	uint8_t   i, ren, ent;
	for( i = 0, ren = 0; i < 4; i++, ren += 3 ) {
		PORTB = sal[i];
		asm("nop");
		ent = PINB & 0xF0;
		if( ent != 0xF0 ) {  //retorna el valor de la tecla pulsada desde el 0 - 15
			switch( ent ) {
				case	0xE0:	return  ren;
				case	0xD0:	return  ren + 1;
				case	0xB0:	return  ren + 2;
				case	0x70:	return  ren + 3;
			}
		}
	}
	return   0xFF;
}
void LCD_write_num(uint8_t cad[], uint8_t  tam)
{
	uint8_t  i;
	LCD_clear();
	for(i=0; i<tam; i++)
	{
		imprime_num(cad[i]);
	}
}

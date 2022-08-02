

#include "Arduino.h"
#include "AW_lib.h"
#include "math.h" 


int initialVal = 0; 
int currentVal = 0; 

float prev_x = 0; 
float prev_t = 0;
float force = 0;
float x = 0;

void Joystick::setInitial(int initial)
{

  initialVal = initial; 
}

void Joystick::setCurrent(int current)
{
  currentVal = current;
}

float Joystick::getForce()
{ 
  x = currentVal - initialVal;
  float dt = micros() - prev_t; 
  float dx = x - prev_x;
  float v = dx / dt;
  prev_x = x;

  force = x/2350.0 + 7.1 * v;

  prev_t = micros();

//  Serial.println(force);
  
  return force; 
}

//float x=0;
float y=0;

void Detent::setCurrent(int current)
{
  currentVal = current;
}

float Detent::getForce()
{   
    int scroll = fabs(currentVal);
    int multiplier = scroll/1000;
    int thousands = multiplier * 1000; 

    if (currentVal >= 0){
      if ((scroll > thousands) && (scroll <= thousands + 150)){
      y = fabs(scroll - thousands);
      x = y * pow((sin(20*(M_PI/180))),2);
      force =  x / 100;
  
      }
      else if ((scroll > thousands + 150) && (scroll < thousands + 300)){
        y = (-1)* scroll + thousands + 300;
        x = y * pow((sin(20*(M_PI/180))),2);
        force = (-1)*x / 100; 
        
      }
      else {
        force = 0;
      }
    }

    
    else if ((currentVal < 0) && (thousands != 0)){
      if ((scroll > thousands) && (scroll <= thousands + 150)){
      y = fabs(scroll - thousands);
      x = y * pow((sin(20*(M_PI/180))),2);
      force =  (-1)*x / 100;
  
      }
      else if ((scroll > thousands + 150) && (scroll < thousands + 300)){
        y = (-1)* scroll + thousands + 300;
        x = y * pow((sin(20*(M_PI/180))),2);
        force = x / 100; 
        
      }
      else {
        force = 0;
      }
    }

    else {
      force = 0;
    }

  return force; 
}

int prevVal = 0;


void Friction::setCurrent(int current)
{
  currentVal = current;
}

float Friction::getForce()
{
  x = currentVal - prevVal;
  if ((x<3) && (x>-3))
    force=0; 
  else
    force = ((exp(x) - exp(-x)) / (exp(x) + exp(-x)))/6; 
  
  prevVal = currentVal;

//  Serial.print(x);
//  Serial.print('\t');
//  Serial.println(force);
  
  return force;
}

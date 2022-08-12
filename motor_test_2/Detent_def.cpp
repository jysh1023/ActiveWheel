
#include "Arduino.h"
#include "AW_lib.h"
#include "math.h" 


void Detent::activate(int value, char input)
{
  initial = value;
  direction = input;
}

void Detent::setCurrent(int value)
{
  current = value;
}


float Detent::getForce()
{   
  if ((direction == 'u') && (current >= previous)){
    if((current > initial) && (current <= initial + 100)){
      y = 100 - fabs(initial - current);
      x = y * pow((sin(40*(M_PI/180))),2);
      force = (-1)*x / 80;
    }  
    else if((current > initial + 100) && (current <= initial + 200)){
      y = 200 - fabs(initial - current);
      x = y * pow((sin(40*(M_PI/180))),2);
      force = (-1)*x / 80;
    } 
    else {
      force = 0; 
    }
  }
  
  else if ((direction == 'd') && (previous >= current)){
    if((current < initial) && (current >= initial - 100)){
      y = 100 - fabs(initial - current);
      x = y * pow((sin(40*(M_PI/180))),2);
      force = x / 80; 
    } 
    else if((current < initial - 100) && (current >= initial - 200)){
      y = 200 - fabs(initial - current);
      x = y * pow((sin(40*(M_PI/180))),2);
      force = (-1)*x / 80;
    }
    else {
      force = 0;
    }
  } 

  else {
    force = 0;
  }

  previous = current;
  
  return force; 
}

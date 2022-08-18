

#include "Arduino.h"
#include "AW_lib.h"
#include "math.h" 

void Friction::setCurrent(int value)
{
  current = value;
  force = 0.0;
}

float Friction::getForce()
{

  float x = (current - previous)/5.0;
  if ((x <= 0.2) && (x>=-0.2)){
    force = ((exp(x) - exp(-x)) / (exp(x) + exp(-x))); 
  } else {
    force = ((exp(x) - exp(-x)) / (exp(x) + exp(-x)))/5.0; 
  }
  
  previous = current; 
  
  return force;
}

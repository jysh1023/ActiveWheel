
#include "Arduino.h"
#include "AW_lib.h"


void Joystick::setInitial(int value)
{
  initial = value; 
}

void Joystick::setCurrent(int value)
{
  current = value;
}

void Joystick::setTouchSensor(int value)
{
  touchVal = value;
}

float Joystick::getForce()
{ 
  x = current - initial;
  float dt = micros() - prev_t; 
  float dx = x - prev_x;
  float v = dx / dt;
  prev_x = x;

  force = x/700.0 + 5.5*v;
    
  prev_t = micros();
  
  return force; 
}

int Joystick::getScroll()
{
  int position = 0;
  if (touchVal > 400){
    position = current;
  } else {
    position = initial;
  }

  return position;
}

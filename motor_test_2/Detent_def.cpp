
#include "Arduino.h"
#include "AW_lib.h"
#include "math.h" 


void Detent::activateDetent(int value, char input)
{
  initial = value;
  activate = input;
}

void Detent::setCurrent(int value)
{
  current = value;
}


//float Detent::getForce()
//{   
//  float y = 100 - fabs(initial - current);
//  float x = y * pow((sin(40*(M_PI/180))),2);
//
//  if (activate == 'd'){
//    if (current >= previous){
//      if((current > initial) && (current <= initial + 100)){
//        force = (-1)*x / 70;
//      }  
//    }
//    else if (previous >= current){
//      if((current < initial) && (current >= initial - 100)){
//        force = x / 70; 
//      } 
//    }
//  } else {
//    force = 0;
//  }
//  
//  previous = current;
//  
//  return force; 
//}

float Detent::getForce()
{   
  float y = 50 - fabs(initial - current);
  float x = y * pow((sin(30*(M_PI/180))),2);

  if (activate == 'u' &&  current >= previous){
    if((current > initial) && (current <= initial + 50)){
      force = (-1)*x / 30;
    }  
  }
  else if (activate == 'd' && previous >= current){
    if((current < initial) && (current >= initial - 50)){
      force = x / 30; 
    } 
  }
  else {
  force = 0;
  }
  
  previous = current;
  
  return force; 
}

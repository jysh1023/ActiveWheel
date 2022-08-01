#include "Wire.h"
#include "AS5600.h"
#include "pwm_lib.h"
#include "AW_lib.h"

Joystick joystick; 
Detent detent;

AS5600 as5600(&Wire1);   //  use the second i2c port

int angle = 0;    // 0 -- 4091
int theta = 0;    // 4092 per revolution

bool startRun = false;

using namespace arduino_due::pwm_lib;

// the pwm frequency of due board is 1kHz for all pins 2-13.
// pwm frequency is audible, so we change the pwm frequency.
// See https://github.com/antodom/pwm_lib

#define MOTOR_R 8
#define MOTOR_F 9
// PWM objects for the motor outputs (Forward & Reverse)
// MOTOR_R - Pin 8 - PC22 - PWM_CH5
// MOTOR_F - Pin 9 - PC21 - PWM_CH4
pwm<pwm_pin::PWML5_PC22> pwm_r;
pwm<pwm_pin::PWML4_PC21> pwm_f;

// 20kHz -> 50us -> 5000 x 0.01us
#define PWM_FREQ 5000
#define DUTY_MAX 4000

typedef union packet_t {
  int scroll;
  byte buf[sizeof(int)];
};

packet_t packet;

void setup() {
  Serial.begin(115200);

  pinMode(MOTOR_R, OUTPUT);
  pinMode(MOTOR_F, OUTPUT);

  // starting PWM signals: pwm period and initial duty value in 0.01us
  pwm_r.start(PWM_FREQ, PWM_FREQ / 2);
  pwm_f.start(PWM_FREQ, PWM_FREQ / 2);

  AS5600 as5600(&Wire1);   //  use the second i2c port
  as5600.begin(4);  // the direction pin of the IC is hard-wired to VCC. Give any unused digital pin number to begin(). 
  as5600.setDirection(AS5600_CLOCK_WISE);
  angle = as5600.rawAngle();
  
}

// v = -1. ~ 1.
void set_output(float v){
  int duty = 0;
  if(v >= 0){
    duty = (int)(v * DUTY_MAX);
    if(duty > DUTY_MAX) duty = DUTY_MAX;
    pwm_r.set_duty(0);
    pwm_f.set_duty(duty);
  }
  else{
    duty = (int)(-v * DUTY_MAX);
    if(duty > DUTY_MAX) duty = DUTY_MAX;
    pwm_f.set_duty(0);
    pwm_r.set_duty(duty);
  }
}

int mode = '0';
bool initialized = false;

void loop(){

  if(Serial.available()){
    int b = Serial.read();
    if(isDigit(b)){
      mode = b;
    } else if (b == 's') {
      startRun = true;
    }
  }

  if (!startRun) {
    return;
  }


  int pre = angle;
  angle = as5600.rawAngle();
  int delta = angle - pre;
  if(delta > 2048)
    delta -= 4096;
  else if(delta < -2048)
    delta += 4096;
  theta += delta;


  if (mode == '2'){
    if(!initialized){
      joystick.setInitial(theta);
      initialized = true;
    }
  } else {
    initialized = false;
  }

 
  packet.scroll = theta;

  
  int freeSerialBufferSize = Serial.availableForWrite();
  if (freeSerialBufferSize >= sizeof(packet_t)) {
    Serial.write(packet.buf, sizeof(packet_t));
    delay(1);
  }
  

  switch(mode){
    case '1':
    loop_spin();
    break;
    case '2':
    loop_joystick();
    break;
    case '3':
    loop_friction();
    break;
    case '4':
    loop_detent();
    break;
    default:
    loop_off();
    break;
  }
}

void loop_off() {
  set_output(0);
  delay(1);
}


float f = 1.0;

void loop_spin() {
  float t = millis() / 1000.0;
  float v = 0.2 * sin(6.28 * f * t);
  set_output(v);
  delay(1);
}

#define V_LIMIT 0.5

void loop_joystick() {

  joystick.setCurrent(theta);
  float f = joystick.getForce(); 
  
  if(f > V_LIMIT) f = V_LIMIT;
  if(f < -V_LIMIT) f = -V_LIMIT;
  set_output(f);
  
  delay(1);

}

float xp = 0.0;

void loop_friction() {
  // friction force proportional to speed
  float x = theta / 50.0;
  float f = 0.0;
  if(xp != 0.0)   // ignore xp in the first call to this function.
    f = x - xp; 
//  v = 100 * v * fabs(v);

  if(f > V_LIMIT) f = V_LIMIT;
  if(f < -V_LIMIT) f = -V_LIMIT;
  set_output(f);

  xp = x;
  delay(1);
}

void loop_detent() {

  detent.setCurrent(theta);
  float f = detent.getForce(); 

  if(f > V_LIMIT) f = V_LIMIT;
  if(f < -V_LIMIT) f = -V_LIMIT;

  set_output(f); 

  delay(1); 
  

}

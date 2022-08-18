#include "Wire.h"
#include "AS5600.h"
#include "Adafruit_FreeTouch.h"
#include "AW_lib.h"

Joystick joystick; 
Detent detent;
Friction friction; 

// magnetic encoder
AS5600 as5600(&Wire);

int angle = 0;    // 0 -- 4091
int theta = 0;    // 4092 per revolution

bool startRun = false;

#define MOTOR_R 9
#define MOTOR_F 10

// touch sensor for the wheel
// using Adafruit Free Touch library - no documentation...
Adafruit_FreeTouch qt = Adafruit_FreeTouch(A8, OVERSAMPLE_4, RESISTOR_50K, FREQ_MODE_NONE);


typedef union packet_t {
  int scroll;
  byte buf[sizeof(int)];
};

packet_t packet;

void setup() {
  Serial.begin(115200);

  pinMode(MOTOR_R, OUTPUT);
  pinMode(MOTOR_F, OUTPUT);
  digitalWrite(MOTOR_R, LOW);
  digitalWrite(MOTOR_F, LOW);

  // the direction pin of the IC is hard-wired to VCC. Give any unused digital pin number to begin(). 
  if(!as5600.begin(0))
    Serial.println("as5600.begin failed"); 
  
  as5600.setDirection(AS5600_CLOCK_WISE);
  angle = as5600.rawAngle();

  if(!qt.begin())  
    Serial.println("Failed to begin qt");
    
}


// set_output is using an documented function called pwm, which is defined in
// ...\AppData\Local\Arduino15\packages\Seeeduino\hardware\samd\1.8.3\cores\arduino\wiring_pwm.cpp
// which may be specific to Seeeduino XIAO.
// Thanks: https://forum.seeedstudio.com/t/seeeduino-xiao-pwm/255245

// void pwm(uint32_t _pin, uint32_t frequency, uint32_t duty = 500);
// where
//   _pin = XIAO pin number
//   frequency = pwm frequency in Hz
//   duty = pwm duty cycle. 0 to 1000 (maybe)

#define PWM_FREQ 20000   // PWM frequency. it should be inaudible.
#define DUTY_MAX 990  // this should be <= 1000
// v = -1. ~ 1.
void set_output(float v){
  int duty = 0;
  if(v >= 0){
    duty = (int)(v * DUTY_MAX);
    digitalWrite(MOTOR_R, LOW);
    pwm(MOTOR_F, PWM_FREQ, duty);
  }
  else{
    duty = (int)(-v * DUTY_MAX);
    digitalWrite(MOTOR_F, LOW);
    pwm(MOTOR_R, PWM_FREQ, duty);
  }
}

int mode = '0';
int touch = '0';
bool initialized = false;
char activateDetent = '\0'; 

void loop(){
  // check a command from the PC
  if(Serial.available()){
    int b = Serial.read();
    if(isDigit(b)){
      mode = b;
    } else if (b == 's') {
      startRun = true;
    } else if (b == 'd'){
      activateDetent =  'd';
    }else if (b == 'u'){
      activateDetent =  'u';
    }
  }

  if (!startRun) {
    return;
  }

  // map the circular output to a linear output
  int pre = angle;
  angle = as5600.rawAngle();
  int delta = angle - pre;
  if(delta > 2048)
    delta -= 4096;
  else if(delta < -2048)
    delta += 4096;
  theta += delta;
  
  

  // read the touch sensor
  touch = qt.measure();

  //set initialized position for joystick mode 
  if (mode == '2'){
    if(!initialized){
      joystick.setInitial(theta);
      initialized = true;
    }
  } else {
    initialized = false;
  }
  
  // run algorithm for the selected mode.
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

  if (mode == '2'){
    packet.scroll = joystick.getScroll();
  } else {
    packet.scroll = theta;
  }

  int freeSerialBufferSize = Serial.availableForWrite();
  if (freeSerialBufferSize >= sizeof(packet_t)) {
    Serial.write(packet.buf, sizeof(packet_t));
    delay(1);
  }

}

void loop_off() {
  digitalWrite(MOTOR_R, LOW);
  digitalWrite(MOTOR_F, LOW);
  delay(10);
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
  joystick.setTouchSensor(touch);
  float f = joystick.getForce();
  
  if(f > V_LIMIT) f = V_LIMIT;
  if(f < -V_LIMIT) f = -V_LIMIT;
  set_output(f);

  delay(1);
}

float xp = 0.0;

void loop_friction() {

  friction.setCurrent(theta);
  float f = friction.getForce(); 

  if(f > V_LIMIT) f = V_LIMIT;
  if(f < -V_LIMIT) f = -V_LIMIT;

  set_output(f);
  delay(1);
}

void loop_detent() {

  if(activateDetent == 'd'){
    detent.activateDetent(theta, 'd');
  }if(activateDetent == 'u'){
    detent.activateDetent(theta, 'u');
  }
  
  detent.setCurrent(theta);
  float f = detent.getForce();
  
  if(f > V_LIMIT) f = V_LIMIT;
  if(f < -V_LIMIT) f = -V_LIMIT;

  set_output(f); 
  activateDetent = '\0';
  delay(1);
}

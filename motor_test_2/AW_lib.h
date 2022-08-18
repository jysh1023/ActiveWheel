

#ifndef AW_lib_h
#define AW_lib_h
# include<Arduino.h>



class Joystick 
{
  
  public: 
    void setInitial(int value);
    void setCurrent(int value); 
    void setTouchSensor(int value);
    float getForce();
    int getScroll();
    
  private: 
    int initial; 
    int current; 
    int touchVal;
    float prev_x = 0; 
    float prev_t = 0;
    double force;
    float x = 0;

}; 


class Detent
{
  
  public:
    void activateDetent(int value, char input);
    void setCurrent(int value);
    float getForce();

   private:
    int initial;
    char activate;
    int current; 
    int previous = 0;
    double force;
    float x = 0;
    float y = 0;
    
};

class Friction
{
  public: 
    void setCurrent(int value);
    float getForce();
  private:
    int current; 
    int previous = 0;
    double force = 0.0;
    
};

#endif 

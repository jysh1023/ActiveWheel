

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
    float prev_x; 
    float prev_t;
    double force;
    float x;

}; 


class Detent
{
  
  public:
    void activate(int value, char input);
    void setCurrent(int value);
    float getForce();

   private:
    int initial;
    char direction;
    int current; 
    int previous;
    double force;
    float x;
    float y;
    
};

class Friction
{
  public: 
    void setCurrent(int value);
    float getForce();
  private:
    int current; 
    int previous;
    double force;
    
};

#endif 

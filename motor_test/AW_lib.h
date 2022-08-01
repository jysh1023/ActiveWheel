

#ifndef AW_lib_h
#define AW_lib_h
# include<Arduino.h>



class Joystick 
{
  
  public: 
    void setInitial(int initial);
    void setCurrent(int current); 
    float getForce();
    
  private: 
    int currentVal;
    int initialVal;

}; 


class Detent
{
  
  public:
    void setCurrent(int current); 
    float getForce();

   private:
    int currentVal; 
    int initialVal;
    
};

#endif 

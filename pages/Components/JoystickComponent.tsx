import { useEffect, useRef, useState } from 'react'
import useInterval from 'react-useinterval';
import SerialComponent from './SerialComponent';


function JoystickComponent () {
  const interval = 10;
  const [scrollValue, setScrollValue] = useState<number>(0);
  const prevScrollValue = usePrevious<number>(scrollValue) 
  const [activatedValue, setInitial] = useState<number>(0);
  const [currentMode, setMode] = useState<string>('0');


  function serialOnUpdate(value: number) {
    // run on every serial update
    setScrollValue(value);
  }

  function modeInitialized(value: number){
    setInitial(value);
  }

  function modeController(mode:string){
    setMode(mode);
    
  }

  useInterval(async () => {

    if(currentMode == '2') {
      joyStickScroll(activatedValue, scrollValue);
    } else {
      scrollMouse(scrollValue, prevScrollValue);
    }

  }, interval);


  function usePrevious<T>(value: T): T {
    const ref: any = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }


  function scrollMouse (scrollValue: number, prevScrollValue:number ){

    const scrollStep = scrollValue - prevScrollValue; 

    if (scrollStep > 5){
      window.scrollBy(0, -20);
    }
    else if (scrollStep < -5){
      window.scrollBy(0, 20);
    }
  }

  function joyStickScroll (initial: number, current: number){

    const distance = current - initial; 

    if (distance <= 400 && distance >= -400){
      window.scrollBy(0, 0);

    } else {
      window.scrollBy(0, -1 * distance / 20);
    }
  }

  

  return<>
      <SerialComponent 
        onUpdate={serialOnUpdate} 
        mode={"2"} 
        initial={modeInitialized} 
        modeBuffer={modeController}
        detent = {""}/>
  </>
}


export default JoystickComponent 



  
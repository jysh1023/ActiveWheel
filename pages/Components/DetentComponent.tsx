import { useEffect, useRef, useState } from 'react'
import useInterval from 'react-useinterval';
import SerialComponent from './SerialComponent';



function DetentComponent(){

  const interval = 10;
  const [scrollValue, setScrollValue] = useState<number>(0);
  const prevScrollValue = usePrevious<number>(scrollValue) 
  const [initialScrollValue, setInitial] = useState<number>(0);
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

    scrollMouse(scrollValue, prevScrollValue);


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
      window.scrollBy(0, -15);
    }
    else if (scrollStep < -5){
      window.scrollBy(0, 15);
    }
  }


  function update(){
    
  }



  return<>
    <SerialComponent 
      onUpdate={serialOnUpdate} 
      writeBuffer={'4'} 
      initial={modeInitialized} 
      modeBuffer={modeController}/>
  </>  



}

export default DetentComponent
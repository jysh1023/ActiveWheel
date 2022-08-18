import { useEffect, useRef, useState } from 'react'
import useInterval from 'react-useinterval';
import SerialComponent from './SerialComponent';

interface propsType{
  position: Array<number[]>;
}

function DetentComponent(props: propsType){

  const interval = 20;
  const [scrollValue, setScrollValue] = useState<number>(0);
  const prevScrollValue = usePrevious<number>(scrollValue);
  const [objectPosition, setPosition] = useState<Array<number[]>>([]);
  const [activateD, activateDetent] = useState<string>(" "); 

  function serialOnUpdate(value: number) {
    // run on every serial update
    setScrollValue(value);
  }


  useInterval(async () => {

    scrollMouse(scrollValue, prevScrollValue);

    setPosition(props.position);
    initiateDetent(objectPosition);

  }, interval);


  function usePrevious<T>(value: T): T {
    const ref: any = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  var scrollStep = 0;

  function scrollMouse (scrollValue: number, prevScrollValue:number ){

    scrollStep = scrollValue - prevScrollValue;

    if (scrollStep > 5){
      window.scrollBy(0, -20);
    }
    else if (scrollStep < -5){
      window.scrollBy(0, 20);
    }

  }

  function initiateDetent(value: Array<number[]>){
    activateDetent("")
    for (var i = 0; i < value.length; i++){
      if((value[i][0] < 40 && value[i][0] >= 15) && scrollStep < -5){
        activateDetent("d");
        console.log(value[i][0]);
      } else if ((value[i][0] < (-value[i][1]-15)) && (value[i][0] >= (-value[i][1] - 40)) && scrollStep > 5){
        activateDetent("u"); 
        console.log(value[i][0]);
      } 
    }
  } 

  return<>
    <SerialComponent 
      onUpdate={serialOnUpdate} 
      mode={"4"} 
      initial={()=>void 0} 
      modeBuffer={()=>void 0}
      detent = {activateD}/>
  </>  

}

export default DetentComponent
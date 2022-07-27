import useInterval from 'react-useinterval';
import { useEffect, useRef, useState } from 'react'
import { LargeNumberLike } from 'crypto';


interface propsType {
  mode: string; 
  initialPosition: number; 
  scrollPosition: number;

}

function Joystick(){

  const [mode,setMode] = useState<string>();
  const [port, setPort] = useState<SerialPort>(); 
  const [initialScrollValue,setInitial] = useState<number>();
  const encoder = new TextEncoder();
  const [scrollValue, setScrollValue] = useState<number>(); 

  async function activate (props: propsType){
    if (port == null) {
      return;
    }

    const writer = port.writable!.getWriter();
    await writer.write(encoder.encode(props.mode)); 
    setInitial(props.initialPosition); 
    setMode(props.mode);
    if (mode == '2') {
      console.log('Joystick mode is ON');
    } else {
      console.log('Joystick mode is OFF');
    }
  }





  

}

export default Joystick(); 
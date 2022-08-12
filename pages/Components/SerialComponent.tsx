import styles from '/styles/Home.module.css';
import { useEffect, useState, useRef } from 'react'
import useInterval from 'react-useinterval';
import { Button } from '@mui/material';

interface propsType{
  onUpdate: (value: number) => void;
  mode: string;
  initial: (value: number) => void; 
  modeBuffer: (mode: string) => void;
  direction: string;
}

function SerialComponent (props: propsType) {
  const preventTooFastReconnectionDelay = 2000;
  const interval = 20;
  const warmup = 1000;
  const startDelay = warmup + 500;
  const [port, setPort] = useState<SerialPort>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [remainder, setRemainder] = useState<Uint8Array|null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [scrollValue, setScrollValue] = useState<number>(0);
  const [writeBuffer, setWrite] = useState<string>(" "); 
  const encoder = new TextEncoder(); 

  useEffect(()=> {
    if ("serial" in navigator) {
      console.log(" The serial port is supported.")
    }

    setTimeout(() => {
      setIsReady(true);
    }, preventTooFastReconnectionDelay);
  }, []);

  // read interval
  useInterval(async () => {
    if (!isPolling) {
      return;
    }
    if (port == null) {
      return;
    }

    if (port.readable == null ) {
      console.log("Port is not readable");
      return;
    }

    if (port.readable?.locked) {
      console.log("locked");
      return;
    }


    try {
      const reader = port.readable!.getReader();
      const {value,done} = await reader.read();
      
      reader.releaseLock();
  
      if (done || value == null || value.buffer.byteLength == 0) {
        console.log("no data");
        return;
      }
  
      if (!isParsing) {
        console.log("flushing garbages in the buffer", value.buffer.byteLength);
        return;
      }
  
      const splittedData = splitter(value.buffer, remainder);
      setRemainder(splittedData.remainder);
  
      const view = new DataView(splittedData.chunks.buffer);
      if (view.byteLength < 4 && view.byteLength > 0) {
        throw new Error("split error");
      }
      if (view.byteLength == 0) {
        return;
      }
      const scroll = view.getInt32(0, true);
      setScrollValue(scroll);
      props.onUpdate(scrollValue);
      // console.log(scrollValue);


    } catch (e) {
      disconnectOnClick();
      console.log("error while fetching. closing the port");
      console.log(e);
    }
  }, interval);

  // Todo: write interval

  useEffect(() => {
    async function serialWrite(){
      if (port == null) {
        return;
      }
  
      const writer = port.writable!.getWriter();
      await writer.write(encoder.encode(writeBuffer))

      console.log(writeBuffer);
  
  
      if (writeBuffer == props.mode){
        props.initial(scrollValue);
        props.modeBuffer(props.mode);
        console.log("Mode is ON")
      } else if (writeBuffer == '0'){
        props.modeBuffer('0');
        console.log("Mode is OFF")
      }
  
      writer.releaseLock();
    }
    serialWrite();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeBuffer])


  useEffect(()=>{
    setWrite(props.direction);
  },[props.direction])

  async function requestSerialPort() {
    let arduino = port;
    if (arduino != null) {
      await arduino.open({baudRate: 115200});
    } else 
    {
      arduino = await navigator.serial.requestPort();
      await arduino.open({baudRate: 115200});
    }

    setPort(arduino);
    if (!arduino.readable || arduino.readable.locked) {
      throw new Error("arudino port is not readalbe or locked");
    }

    if (arduino.writable == null) {
      throw new Error("failed to start");
    }
    
    setIsPolling(true);

    setTimeout(async () => {
      setIsParsing(true);
    }, warmup);

    setTimeout(async (arduino) => {
      const writer = arduino.writable!.getWriter();
      await writer.write(encoder.encode('s'));
      console.log("start sent");
      writer.releaseLock();
    }, startDelay, arduino);

  }

  function splitter(buffArray: ArrayBufferLike, remainder: Uint8Array | null): {chunks: Uint8Array, remainder: Uint8Array | null}{
    let array;

    if (remainder !== null){
      const concatedArray = new Uint8Array(buffArray.byteLength + remainder.length);
      concatedArray.set(remainder);
      concatedArray.set(new Uint8Array(buffArray), remainder.length);
      array = concatedArray;
    } else {
      array = new Uint8Array(buffArray);
    }

    const length = array.length;
    const numChunks = Math.floor(length / 4);
    const chunks = array.slice(0, numChunks * 4);

    let leftOver: Uint8Array | null = null;
    if (length % 4 !== 0){
      leftOver = array.slice(numChunks*4, length);
    }
    
    return {chunks, remainder: leftOver};
  }

  function disconnectOnClick() {
    setIsParsing(false);
    setIsPolling(false);
    setRemainder(null);
    while (port?.readable?.locked || port?.writable?.locked) {
      // busy wait
    }
    port?.close().then(() => {
      console.log("port closed");
      // refresch the page. 
      // I'm not sure why, but this makes the connected arduino to work again without physically disconnecting it.
      location.reload();
    });
  }

  
  return <>
    
    <Button className={styles.connectPort} size='small' variant = 'contained' onClick={requestSerialPort} disabled={!isReady}>Connect Serial Port</Button> 
    <Button className={styles.disconnectPort} size='small' variant = 'contained' onClick={disconnectOnClick} disabled={!isReady}>Disconnect Serial Port</Button> 
    <Button className={styles.modeOn} size='small' variant = 'contained' onClick={() => setWrite(props.mode)} disabled={!isReady}> Mode ON </Button>
    <Button className={styles.modeOff} size='small' variant = 'contained' onClick={() =>setWrite("0")} disabled={!isReady}> Mode OFF </Button>

  </>;
}


export default SerialComponent



  
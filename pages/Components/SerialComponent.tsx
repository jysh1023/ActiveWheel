import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import useInterval from 'react-useinterval';

function SerialComponent () {
  const preventTooFastReconnectionDelay = 2000;
  const interval = 10;
  const warmup = 1000;
  const startDelay = warmup + 500;
  const [port, setPort] = useState<SerialPort>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [remainder, setRemainder] = useState<Uint8Array|null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [scrollValue, setScrollValue] = useState<number>(0);
  const prevScroll = usePrevious<number>(scrollValue) 
  const encoder = new TextEncoder(); 

  useEffect(()=> {
    if ("serial" in navigator) {
      console.log(" The serial port is supported.")
    }

    setTimeout(() => {
      setIsReady(true);
    }, preventTooFastReconnectionDelay);
  }, []);

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
      const scrollValue = view.getInt32(0, true);
      setScrollValue(scrollValue);


    } catch (e) {
      disconnectOnClick();
      console.log("error while fetching. closing the port");
      console.log(e);
    }
  }, interval);


  function usePrevious<T>(value: T): T {
    const ref: any = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  useEffect(() => { 
    
    scrollMouse(scrollValue,prevScroll)

  }, [scrollValue, prevScroll]);


  function scrollMouse (scrollValue: number, prevScroll:number ){

    const scrollStep = scrollValue - prevScroll; 
    if (scrollStep > 2){
      window.scrollBy(0, -10);
    }
    else if (scrollStep < -2){
      window.scrollBy(0, 10);
    }
  }

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

    // const encoder = new TextEncoder(); 
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

  async function changeMode(mode:string){
    if (port == null) {
      return;
    }

    const writer = port.writable!.getWriter();
    await writer.write(encoder.encode(mode))
    if (mode != '0') {
      console.log('Mode', mode, ' is ON');
    } else {
      console.log('All mode is OFF');
    }
    writer.releaseLock();


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


}


export default SerialComponent



  
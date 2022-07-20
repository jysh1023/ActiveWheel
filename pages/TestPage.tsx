import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { MouseEvent } from 'react'
import { setServers } from 'dns';
import useInterval from 'react-useinterval';

function TestPage () {
  const interval = 5;
  const [port, setPort] = useState<SerialPort>();
  const [reader, setReader] = useState<ReadableStreamDefaultReader>();
  const [fetchInterval, setFetchInterval] = useState<NodeJS.Timer>();
  const [remainder, setRemainder] = useState<Uint8Array|null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  
  useEffect(()=> {
    if ("serial" in navigator) {
      console.log(" The serial port is supported.")
    }

    if (fetchInterval != null) {
      clearInterval(fetchInterval);
    }
  }, []);

  useInterval(async () => {
    if (!isFetching) {
      return;
    }
    if (reader == null) {
      return;
    }

    const {value,done} = await reader.read();

    if (done || value == null) {
      return;
    }

    const splittedData = splitter(value.buffer, remainder);
    setRemainder(splittedData.remainder);

    const view = new DataView(splittedData.chunks.buffer);
    if (view.byteLength < 4) {
      return;
    }
    console.log(view.getInt32(0, true));
  }, interval);

  async function requestSerialPort() {    
    const arduino = await navigator.serial.requestPort();
    console.log(arduino);
    console.log("request Serial port");
    await arduino.open({baudRate:115200});

    setPort(arduino);
    if (!arduino.readable || arduino.readable.locked) {
      throw new Error("arudino port is not readalbe or locked");
    }
    const reader = arduino.readable.getReader();
    setReader(reader);
  }


  function splitter(buffArray: ArrayBufferLike, remainder: Uint8Array | null): {chunks: Uint8Array, remainder: Uint8Array | null}{
    let array = new Uint8Array(buffArray);

    if (remainder != null){
      const concatedArray = new Uint8Array(array.length + remainder.length);
      concatedArray.set(remainder);
      concatedArray.set(array, remainder.length);
      array = concatedArray;
    }

    const length = array.length;
    const divider = Math.floor(length/4)
    const chunks = array.slice(0,divider*4)

    let leftOver: Uint8Array | null = null;
    if (length%4 != 0){
      leftOver = array.slice(divider*4, length);
    }
    
    return {chunks, remainder: leftOver};

  }

  function readDataClick() {
    setIsFetching(!isFetching);
  }

  async function changeMode(mode:string){
    if (port == null) {
      return;
    }
    
    const encoder = new TextEncoder(); 
    while(port.writable){
      const writer = port.writable.getWriter();
      await writer.write(encoder.encode(mode))
      writer.releaseLock();
    }
  }

  async function disconnectPort(){
    if (port == null){
      return;
    }
    await port.close();
    if(port.ondisconnect){
      console.log("Serial port disconnected")
    }
    
  }

  return(
    <div className = {styles.container}>
      
      <Head>
        <title>Test Page</title>
      </Head>
        
      <main className={styles.main}>

        <h1>Test Page</h1>

        <button onClick={requestSerialPort}>Request Serial Port</button> 
        <button onClick={readDataClick}>Read Data</button> 
        {/* <button onClick={scrollMouse}>Scroll</button>  */}
        {/* <button onClick={disconnectPort}>Disconnect Serial Port</button>  */}
        
        <button onClick={() =>changeMode("1")}> Mode 1 </button>
        <button onClick={() =>changeMode("2")}> Mode 2 </button>
        <button onClick={() =>changeMode("3")}> Mode 3 </button>
        <button onClick={() =>changeMode("4")}> Mode 4 </button>
        {/* <button onClick={}> OFF </button> */}

        <p className={styles.body}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar orci a metus scelerisque dictum. 
          In vitae diam quis justo posuere commodo. Pellentesque tristique fringilla tellus id posuere. 
          Nullam eu nisl rutrum, mollis sem id, ultricies leo. Ut pretium aliquam mi, sed ultricies tortor dapibus a. 
          Sed sodales diam in est gravida, ut sodales magna dapibus. Morbi lacinia, neque vel ultrices sollicitudin, 
          orci sem tristique mi, sed eleifend massa lacus eu risus. Nulla pellentesque porttitor ligula ut interdum. 
          Suspendisse rutrum, neque eu fermentum vehicula, mi ex pulvinar arcu, at accumsan purus velit nec leo. 
          Phasellus ac tortor urna. Quisque in lectus enim. Phasellus aliquet magna diam, viverra malesuada mauris 
          convallis nec. Duis et egestas felis, vitae molestie elit. Etiam feugiat mattis magna, sit amet maximus velit 
          commodo vitae. Morbi lectus velit, venenatis a orci ut, posuere malesuada ante. Nulla vitae tellus at risus 
          finibus mattis.</p>


      </main>
    </div>
  );
}


export default TestPage 



  
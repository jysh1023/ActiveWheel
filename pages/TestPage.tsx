import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { MouseEvent } from 'react'

function TestPage () {

  const [port, setPort] = useState<SerialPort>();
  const [reader, setReader] = useState<ReadableStreamDefaultReader>();
  
  useEffect(()=> {
    if ("serial" in navigator) {
      console.log(" The serial port is supported.")
    }
  });

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


  async function readData(){
    if (port == null){
      return null;
    }

    if (reader == null) {
      return;
    }

    try{
      while (true){
        
        const {value,done} = await reader.read();
        if(done){
          reader.releaseLock();
          break;
        }
        if(value.byteLength > 4) {
          const firstData = value.buffer.slice(0, 4);
          const view = new DataView(firstData);
          const decodedValue= view.getInt32(0, true);
          console.log(decodedValue);
        }
        // if(value.byteLength == 16){
        //   const arrayBufferToHex = require('array-buffer-to-hex')
        //   const string = arrayBufferToHex(value)
        //   const result = string.slice(2,4) + string.slice(0,2);

        //   // console.log(result);
        //   // console.log(parseInt(result, 16));
          
        // }
      }
    } catch (error) {
      console.log("error", error);
    }
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

  // async function scrollMouse(){
  //   if (port == null){
  //     return null;
  //   }

  //   while (port.readable){
  //     const textDecoder = new TextDecoderStream();
  //     const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  //     const reader = textDecoder.readable.getReader();
         
  //     try{
  //       const positions = [];

  //       while (true){
  //         const {value,done} = await reader.read();

  //         if(done){
  //           reader.releaseLock();
  //           break;
  //         }
  //         if (value){

  //           const position = parseInt(value);
  //           positions.push(position); 
  //           // console.log(position);

  //           if (positions.length == 2){

  //             console.log("Current: " + positions[0] + " , Previous: " + positions[1])

  //             if(positions[1] - positions[0] > 2){
  //               window.scrollBy(0,-5)
  //             } else if(positions[1] - positions[0] < -2){
  //               window.scrollBy(0, 5)
  //             }
  //             positions.pop();
  //             positions.pop();
  //           }
  //         }
  //       }   
  //     }catch (error) {
  //       console.log("error");
  //     }
  //   }   
  // }


  return(
    <div className = {styles.container}>
      
      <Head>
        <title>Test Page</title>
      </Head>
        
      <main className={styles.main}>

        <h1>Test Page</h1>

        <button onClick={requestSerialPort}>Request Serial Port</button> 
        <button onClick={readData}>Read Data</button> 
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



  
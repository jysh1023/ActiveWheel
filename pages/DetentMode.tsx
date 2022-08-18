import styles from '../styles/Home.module.css'
import Head from 'next/head'
import DetentComponent from './Components/DetentComponent';
import { useEffect, useRef, useState } from 'react'; 
import React from 'react';


function DetentMode(){
  const [objectPosition, setPosition] = useState<Array<number[]>>([]);
  const box = useRef<any>([]); 
  const position: Array<number[]> = [[],[],[],[],[],[],[],[],[],[]];

  function getPosition() {
    if(!box.current) return;
    for (var i=0; i < box.current.length; i++){
      const {top, height} = box.current[i].getBoundingClientRect(); 
      position[i][0] = top;
      position[i][1] = height;
    }
    setPosition(position);
  }

  useEffect(()=>{
    window.addEventListener('scroll', getPosition);
    return ()=>{
      window.removeEventListener('scroll', getPosition);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setMarking(){

  }
  

  return<>
    <div>
      <Head>
        <title>Detent Mode Page</title>
      </Head>

      <div className = {styles.container}>
        <div className={styles.box} ref={(el)=>box.current[0]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[1]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[2]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[3]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[4]=el}></div>

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
          </p>


        <div className={styles.box} ref={(el)=>box.current[5]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[6]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[7]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[8]=el}></div>
        <div className={styles.box} ref={(el)=>box.current[9]=el}></div>
        <div className={styles.empty}></div>
      </div>


      <DetentComponent position ={objectPosition}/> 


    </div>
  </>


}

export default DetentMode
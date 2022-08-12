import styles from '../styles/Home.module.css'
import Head from 'next/head'
import DetentComponent from './Components/DetentComponent';
import { useEffect, useRef, useState } from 'react'; 
import React from 'react';


function DetentMode(){
  const [objectPosition, setPosition] = useState<Array<number[]>>([]);
  const box = useRef<any>([]); 
  const position: Array<number[]> = [[],[],[],[]];

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
        <div className={styles.empty}></div>
      </div>


      <DetentComponent position ={objectPosition}/> 


    </div>
  </>


}

export default DetentMode
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import DetentComponent from './Components/DetentComponent';



function DetentMode(){

  return(
    <div className = {styles.container}>
      
      <Head>
        <title>Detent Mode Page</title>
      </Head>
        
      <DetentComponent/>

      <main className={'styles.main'}>

      </main>
    </div>

    
  );


}

export default DetentMode
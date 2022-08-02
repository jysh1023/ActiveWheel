import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import JoystickComponent from './Components/JoystickComponent';


function JoyStickMode () { 

  return(
    <div className = {styles.container}>
      
      <Head>
        <title>Joystick Mode Page</title>
      </Head>

      <Image 
        src = {"/image/Coupang.png"}
        alt = "coupangPage"
        width = {3456}
        height = {52606}
        layout = {"responsive"}
        objectPosition = {"center"}
        priority
      /> 

      <JoystickComponent/>

    </div>
  );
}


export default JoyStickMode 



  
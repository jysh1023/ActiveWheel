import styles from '../styles/Home.module.css'
import Head from 'next/head'

const TestPage = () => {
  return(
    <div className = {styles.container}>
      
      <Head>
        <title>Test Page</title>
      </Head>
        
      <main className={styles.main}>

        <h1>Test Page</h1>

      </main>
    </div>
  )
}

export default TestPage

  
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Active Wheel</title>
      </Head>

      <main className={styles.main}>

        <div className={styles.grid}>
          <Link href="/TestPage">
            <a className={styles.card}>
              <h2>Test Page &rarr;</h2>
            </a>
          </Link>

          <a href="" className={styles.card}>
            <h2>Mode 1 &rarr;</h2>
          </a>

          <a href="" className={styles.card}>
            <h2>Mode 2 &rarr;</h2>
          </a>

          <a
            href="" className={styles.card}
          >
            <h2>Mode 3 &rarr;</h2>
          </a>

          <a
            href="" className={styles.card}
          >
            <h2>Mode 4 &rarr;</h2>
            
          </a>
        </div>
      </main>

    </div>
  )
}

export default Home

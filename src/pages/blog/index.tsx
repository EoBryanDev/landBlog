import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "./styles.module.scss";
import thumb from "../../../public/images/thumb.png";

const Blog = () => {
  return (
    <>
      <Head>
        <title>Blog | Project Name</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href='/'>
            <Image
              src={thumb}
              alt='Post title 1'
              width={720}
              height={410}
              quality={100}
            />
            <strong>Building your first app</strong>
            <time>
              16 SET 2023
            </time>
            <p>Today we goint to build show password function in the input. Its a great feature to our forms!</p>
          </Link>
        </div>
      </main>
    </>
  );
};
export default Blog;

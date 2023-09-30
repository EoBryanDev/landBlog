import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "./styles.module.scss";
import thumb from "../../../public/images/thumb.png";
import {
  FiChevronRight,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronsLeft,
} from "react-icons/fi";
import { getPrismicClient } from "@/src/services/prismic";
import { RichText } from "prismic-dom";
import Prismic from "@prismicio/client";

type TPost = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
};
interface IProps {
  posts: TPost[];
}

const Blog = ({ posts }: IProps) => {
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
            <time>16 SET 2023</time>
            <p>
              Today we goint to build show password function in the input. Its a
              great feature to our forms!
            </p>
          </Link>
          <div className={styles.buttonNavigate}>
            <div>
              <button>
                <FiChevronsLeft size={25} color='#fff' />
              </button>
              <button>
                <FiChevronLeft size={25} color='#fff' />
              </button>
            </div>
            <div>
              <button>
                <FiChevronRight size={25} color='#fff' />
              </button>
              <button>
                <FiChevronsRight size={25} color='#fff' />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Blog;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at("document.type", "post")],
    {
      orderings: "[document.last_publication_date desc]",
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 3,
    }
  );
  // console.log(JSON.stringify(response, null, 2));
  const posts = response.results.map((post: any) => {
    
    const date = post.last_publication_date;
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description:
        post.data.description.find(
          (content: any) => content.type === "paragraph"
        )?.text ?? "",
      cover: post.data.cover.url,
      updatedAt: new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });
  // console.log(posts);

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60,
  };
};

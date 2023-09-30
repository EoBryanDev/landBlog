import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import styles from "./post.module.scss";
import { getPrismicClient } from "@/src/services/prismic";
import { RichText } from "prismic-dom";
import { ParsedUrlQuery } from "querystring";

interface IParams extends ParsedUrlQuery {
  slug: string;
}
interface IPostProps {
  post: {
    slug: string;
    title: string;
    description: string;
    cover: string;
    updatedAt: string;
  };
}
const Post = ({ post }: IPostProps) => {
  return (
    <>
      <Head>
        <title>Post | {post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <Image
            quality={100}
            src={post.cover}
            width={720}
            height={410}
            alt={post.title}
          />
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.description }}
          ></div>
        </article>
      </main>
    </>
  );
};
export default Post;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params as IParams;
  const prismic = getPrismicClient(req);

  const resp = await prismic.getByUID("post", `${slug}`, {});

  if (!resp) {
    return {
      redirect: {
        destination: "/blog",
        permanent: false,
      },
    };
  }

  const post = {
    slug,
    title: RichText.asText(resp.data.title),
    description: RichText.asHtml(resp.data.description),
    cover: resp.data.cover.url,
    updatedAt: new Date(resp.last_publication_date!).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};

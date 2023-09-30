import { useState } from "react";

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
  page: string;
  totalPage: string;
}

const Blog = ({ posts: postsBlog, page, totalPage }: IProps) => {
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(+page);

  const reqPost = async (pageNumber: number) => {
    const prismic = getPrismicClient();

    const resp = await prismic.query(
      [Prismic.Predicates.at("document.type", "post")],
      {
        orderings: "[document.last_publication_date desc]",
        fetch: ["post.title", "post.description", "post.cover"],
        pageSize: 2,
        page: `${pageNumber}`,
      }
    );

    return resp;
  };
  const navigatePage = async (pageNumber: number) => {
    const response = await reqPost(pageNumber);

    if (response.results.length === 0) {
      return;
    }
    const getPosts = response.results.map((post: any) => {
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

    setCurrentPage(pageNumber);
    setPosts(getPosts);
  };

  const [posts, setPosts] = useState(postsBlog || []);
  return (
    <>
      <Head>
        <title>Blog | Project Name</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Image
                src={post.cover}
                alt={post.title}
                width={720}
                height={410}
                quality={100}
                key={post.slug}
                className={`loadinggen ${isLoading ? "loading" : "loadingend"}`}
                onLoadingComplete={() => setLoading(false)}
              />
              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>{post.description}</p>
            </Link>
          ))}
          <div className={styles.buttonNavigate}>
            <div>
              <button
                onClick={() => {
                  navigatePage(1);
                }}
                disabled={currentPage < +totalPage}
              >
                <FiChevronsLeft size={25} color='#fff' />
              </button>
              <button
                onClick={() => {
                  navigatePage(currentPage - 1);
                }}
                disabled={currentPage < +totalPage}
              >
                <FiChevronLeft size={25} color='#fff' />
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  navigatePage(currentPage + 1);
                }}
                disabled={currentPage >= 2}
                
              >
                <FiChevronRight size={25} color='#fff' />
              </button>
              <button
                onClick={() => {
                  navigatePage(+totalPage);
                }}
                disabled={currentPage >= 2}
              >
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
      pageSize: 2,
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
      page: response.page,
      totalPage: response.total_pages,
    },
    revalidate: 60 * 60,
  };
};

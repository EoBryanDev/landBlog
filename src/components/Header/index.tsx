import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.svg";
import ActiveLink from "../ActiveLink";

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href='/' activeClassName={styles.active}>
          <Image src={logo} alt='logotype' />
        </ActiveLink>

        <nav>
          <ActiveLink
            className={styles.anchor}
            activeClassName={styles.active}
            href='/'
          >
            Home
          </ActiveLink>
          <ActiveLink
            className={styles.anchor}
            activeClassName={styles.active}
            href='/blog'
          >
            Blog
          </ActiveLink>
          <ActiveLink
            className={styles.anchor}
            activeClassName={styles.active}
            href='/aboutUs'
          >
            About us
          </ActiveLink>
        </nav>

        <a className={styles.readyButton} type='button'>
          Get Start!
        </a>
      </div>
    </header>
  );
};

export default Header;

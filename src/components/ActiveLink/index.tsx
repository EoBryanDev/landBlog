import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface IProps extends LinkProps {
  children: ReactNode;
  activeClassName: string;
  className?: string;
}

const ActiveLink: React.FC<IProps> = ({
  children,
  activeClassName,
  className,
  ...rest
}: IProps) => {
  const { asPath } = useRouter();
  const activeClass = asPath === rest.href ? activeClassName : "";
  return (
    <Link className={`${className} ${activeClass}`} {...rest}>
      {children}
    </Link>
  );
};
export default ActiveLink;

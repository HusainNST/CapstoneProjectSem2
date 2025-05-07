import Image from "next/image";

interface Props {
  type?: string;
}
const Logo = ({ type }: Props) => {
  return (
    <Image
      src="/FlippyLogo.png"
      alt="Flippy logo"
      height={117}
      width={434}
      priority
      className={`${!type && "h-auto w-[576]"} z-10`}
    />
  );
};

export default Logo;

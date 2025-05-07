import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/FlippyLogo.png"
      alt="Flippy Logo"
      height={60}
      width={209}
      priority
      className="h-auto w-[576] z-10"
    />
  );
};

export default Logo;

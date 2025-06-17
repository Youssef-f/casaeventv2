import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Nav = () => {
  return (
    <header className="flex justify-center items-center w-full h-10 bg-slate-400 px-8 max-sm:px-2 overflow-hidden">
      <nav className="flex items-center justify-between w-full max-w-6xl h-full">
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs font-semibold text-white"> FLOWDIGITAL</p>
          <Image
            src="/images/logo.webp"
            alt="logo"
            width={24}
            height={24}
            className="hidden md:block rounded-full "
          />
        </div>
        <div className="flex items-center justify-center gap-3">
          <ul className="hidden md:block md:flex items-center justify-between gap-2">
            <li>
              <Link href={"/"}>home</Link>
            </li>
            <li>
              <Link href={"/"}>home</Link>
            </li>
            <li>
              <Link href={"/"}>home</Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center border border-slate-300 rounded-full px-2 h-8 bg-white w-full max-w-[400px] max-sm:w-[200px]">
          <Image
            src={"/icons/search.svg"}
            alt="search"
            width={15}
            height={15}
          />
          <Input
            type="text"
            placeholder="Rechercher une activité"
            className="border-none bg-transparent text-xs placeholder:text-xs focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none active:outline-none"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button className="bg-transparent ">Sign-in</Button>
          <Button>Sign-up</Button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;

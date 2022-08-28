import { Link } from "@remix-run/react";
interface Props {
  userId: string;
  url: string;
}

export default function Navbar(props: Props) {
  return (
    <nav className="bg-black w-full fixed top-0 left-0 px-5">
      <div
        className="w-full flex justify-between content-start py-3">
        <Link className="text-white text-3xl font-bold" to={"/"}>Attendances</Link>
        <div className="flex flex-col self-end md:flex-row items-center justify-center gap-x-4 text-blue-50 font-bold">
          {!props.userId ? <Link to="/login">Login</Link> : <Link to={`/logout?redirectTo=${encodeURIComponent((new URL(props.url)).pathname)}`}>Logout</Link>}
        </div>
      </div>
    </nav>
  );

}

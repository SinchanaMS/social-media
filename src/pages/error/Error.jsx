import error from "assets/jigsaw.png";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="absolute flex h-[85vh] w-full flex-col items-center justify-center gap-10 bg-slate-100 md:h-[80vh] lg:h-[85vh] lg:flex-row lg:gap-0">
      <img
        src={error}
        alt="error-404"
        className="max-h-[10rem] sm:max-h-[15rem] lg:max-h-[20rem]"
      />
      <div className="flex flex-col items-center gap-2">
        <p to="/home" className="text-xl lg:text-2xl xl:text-3xl">
          Oops! Looks like you lost your way.
        </p>
        <Link
          to="/home"
          className="text-xl font-semibold text-blue-700 lg:text-2xl xl:text-3xl"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

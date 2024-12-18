import { FileQuestionIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";

export default function SideBar() {
  const location = useLocation();

  return (
    <div className="w-1/5 bg-zinc-50 flex flex-col border-r border-zinc-300">
      <ul className="flex flex-col gap-2 py-12">
        <NavLink
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-l-lg hover:bg-zinc-200 ${
            location.pathname === "/" ? "bg-zinc-200" : ""
          }`}
        >
          <FileQuestionIcon className="w-4 h-4 text-zinc-700" />
          <span className="text-zinc-700 text-sm">Questions</span>
        </NavLink>
      </ul>
    </div>
  );
}

import {
  InboxIcon,
  SearchIcon,
  TrophyIcon,
  UserIcon,
  XIcon,
  CircleHelpIcon,
  LayersIcon,
} from "lucide-react";
import stackoverfaux from "../assets/stackoverfaux.svg";
import { useRef, useState, useEffect } from "react";
import { useDebounce } from "../hooks/use-debounce.ts";
import { Question } from "../types/model.ts";
import { useNavigate } from "react-router";

export default function NavBar() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [foundQuestions, setFoundQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (debouncedSearchValue) {
      fetch(`http://localhost:3000/questions/search?q=${debouncedSearchValue}`)
        .then((res) => res.json())
        .then((data) => {
          setFoundQuestions(data);
        });
    }
  }, [debouncedSearchValue]);

  return (
    <div className="bg-zinc-50 border-b border-zinc-300 w-full py-2">
      <div className="flex items-center md:w-3/4 xl:w-2/3 mx-auto gap-4">
        <h1 className="text-2xl tracking-tight font-light flex items-center">
          <img src={stackoverfaux} alt="stackoverfaux" className="w-10 h-10" />
          stack<span className="font-semibold">overfaux</span>
        </h1>
        <button className="text-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-200 text-sm">
          Products
        </button>
        <button className="text-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-200 text-sm">
          OverflowAI
        </button>
        <div
          onClick={() => searchRef.current?.focus()}
          className="flex items-center px-3 py-2 rounded-full border border-zinc-200 flex-grow shadow-inner cursor-text relative"
        >
          <SearchIcon className="w-4 h-4 text-zinc-700/50 mr-2" />
          <input
            id="search"
            ref={searchRef}
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="text-zinc-700 text-sm outline-none border-none bg-transparent w-full"
          />
          {searchValue && (
            <XIcon
              onClick={() => setSearchValue("")}
              className="w-4 h-4 text-zinc-700/50 ml-auto cursor-pointer"
            />
          )}
          {foundQuestions.length > 0 && (
            <div className="absolute top-[calc(100%+5px)] left-0 w-full bg-white shadow-md rounded-md p-2 flex flex-col gap-2">
              {foundQuestions.map((question) => (
                <div
                  onClick={() => {
                    navigate(`/questions/${question.id}`);
                    setSearchValue("");
                    setFoundQuestions([]);
                  }}
                  key={question.id}
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                >
                  {question.title}
                </div>
              ))}
            </div>
          )}
        </div>
        <UserIcon className="w-5 h-5 text-zinc-700 cursor-pointer" />
        <div className="relative group">
          <InboxIcon className="w-5 h-5 text-zinc-700 cursor-pointer" />
          <div className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-4 h-5 flex items-center justify-center text-xs font-bold border-2 border-zinc-50 transition-all group-hover:-top-2">
            2
          </div>
        </div>
        <TrophyIcon className="w-5 h-5 text-zinc-700 cursor-pointer" />
        <CircleHelpIcon className="w-5 h-5 text-zinc-700 cursor-pointer" />
        <LayersIcon className="w-5 h-5 text-zinc-700 cursor-pointer" />
      </div>
    </div>
  );
}

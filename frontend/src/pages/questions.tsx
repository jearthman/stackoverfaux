import { useState, useEffect } from "react";
import { Question } from "../types/model";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "react-router";

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/questions?count=5")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        console.log(data);
      });
  }, []);

  return (
    <div className="flex flex-col p-10">
      <h1 className="text-2xl font-bold mb-5">Some Questions</h1>
      <div className="flex flex-col gap-5">
        {questions.map((question) => (
          <div className="flex" key={question.id}>
            <div className="text-sm text-gray-500 justify-center align-middle p-2">
              Score {question.score}
            </div>
            <div className="flex-1 p-1">
              <h1
                className=" text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(`/questions/${question.id}`)}
              >
                {question.title}
              </h1>
              <div>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                >
                  {question.body.slice(0, 100) + "..."}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

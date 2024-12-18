import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Question } from "../types/model";

import { ArrowUp, CheckIcon, UserIcon } from "lucide-react";
import { ArrowDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "react-router";

export default function Question() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/questions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        console.log(data);
      });
  }, [id]);

  const postAnswer = () => {
    fetch(`http://localhost:3000/questions/${id}/newanswer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer: answer }),
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        res.json().then((data) => {
          setQuestion((prev) => {
            if (!prev) return prev;
            console.log(data);
            return {
              ...prev,
              answers: [...prev.answers, data],
            };
          });
        });
      }
    });
    setAnswer("");
  };

  return (
    <div className="flex flex-col p-6 min-h-full">
      <h1 className="text-2xl text-zinc-700 mb-2">{question?.title}</h1>
      <div className="flex gap-2 text-sm">
        <span>
          <span className="text-zinc-500">Asked</span>{" "}
          {new Date(
            (question?.creation ?? Date.now()) * 1000
          ).toLocaleDateString()}
        </span>
        <span>
          <span className="text-zinc-500">Score</span> {question?.score}
        </span>
      </div>
      <div className="h-[0.5px] bg-zinc-300 w-full mt-3"></div>

      <div className="flex w-full">
        <div className="flex flex-col items-center gap-2 p-4">
          <button className="border-zinc-200 border p-2 rounded-full aspect-square">
            <ArrowUp />
          </button>
          <div className="text-zinc-500 font-bold text-lg">
            {question?.score}
          </div>
          <button className="border-zinc-200 border p-2 rounded-full aspect-square">
            <ArrowDown />
          </button>
        </div>
        <div className="flex-1 p-4 text-sm">
          <ReactMarkdown
            className="whitespace-pre-wrap break-words max-w-full overflow-hidden"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ children }) => (
                <pre className="overflow-x-auto max-w-full">{children}</pre>
              ),
              code: ({ children }) => (
                <code className="break-all whitespace-pre-wrap">
                  {children}
                </code>
              ),
            }}
          >
            {question?.body}
          </ReactMarkdown>
          <div className="bg-blue-100 rounded-md ml-auto mt-3 w-fit px-3 py-2 text-xs text-blue-800/75">
            <span>asked on </span>
            <span>
              {new Date(
                (question?.creation ?? Date.now()) * 1000
              ).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 mt-2" />
              <span
                className="text-sm text-blue-900 cursor-pointer hover:underline"
                onClick={() => {
                  navigate(`/users/${question?.user?.id}`);
                }}
              >
                {question?.user?.name}
              </span>
            </div>
          </div>
          <div className="h-[0.5px] bg-zinc-300 w-full my-6"></div>
          {question?.comments?.map((comment) => (
            <div key={comment.id}>
              <span>{comment.body}</span>
              <span className="pl-2">
                -{" "}
                <span
                  className="text-blue-900 cursor-pointer hover:underline"
                  onClick={() => {
                    navigate(`/users/${comment.user?.id}`);
                  }}
                >
                  {comment.user?.name}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center p-4">
        <div className="text-xl">{question?.answers?.length ?? 0} answers</div>
      </div>
      {question?.answers?.map((answer) => (
        <div className="flex w-full" key={answer.id}>
          <div className="flex flex-col items-center gap-2 p-4">
            <button className="border-zinc-200 border p-2 rounded-full aspect-square">
              <ArrowUp />
            </button>
            <div className="text-zinc-500 font-bold text-lg">
              {answer.score}
            </div>
            <button className="border-zinc-200 border p-2 rounded-full aspect-square">
              <ArrowDown />
            </button>
            {answer.accepted && (
              <CheckIcon className="w-8 h-8 mt-2 text-green-500" />
            )}
          </div>
          <div className="flex-1 p-4 text-sm">
            <ReactMarkdown
              className="whitespace-pre-wrap break-words max-w-full overflow-hidden prose prose-sm"
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="overflow-x-auto max-w-full">{children}</pre>
                ),
                code: ({ children }) => (
                  <code className="break-all whitespace-pre-wrap">
                    {children}
                  </code>
                ),
              }}
            >
              {answer.body}
            </ReactMarkdown>
            <div className="border-zinc-200 border rounded-md ml-auto mt-3 w-fit px-3 py-2 text-xs text-zinc-500">
              <span>answered on </span>
              <span>
                {new Date(
                  (answer.creation ?? Date.now()) * 1000
                ).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <UserIcon className="w-6 h-6 mt-2" />
                <span
                  className="text-sm text-blue-900 cursor-pointer hover:underline"
                  onClick={() => {
                    navigate(`/users/${answer.user?.id}`);
                  }}
                >
                  {answer.user?.name}
                </span>
              </div>
            </div>
            <div className="h-[0.5px] bg-zinc-300 w-full my-6"></div>
            {answer?.comments?.map((comment) => (
              <div key={comment.id} className="mb-3">
                <ReactMarkdown
                  className="whitespace-pre-wrap break-words max-w-full overflow-hidden prose prose-sm"
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children }) => (
                      <pre className="overflow-x-auto max-w-full">
                        {children}
                      </pre>
                    ),
                    code: ({ children }) => (
                      <code className="break-all whitespace-pre-wrap">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {comment.body}
                </ReactMarkdown>
                <span className="pl-2">
                  -{" "}
                  <span
                    className="text-blue-900 cursor-pointer hover:underline"
                    onClick={() => {
                      navigate(`/users/${comment.user?.id}`);
                    }}
                  >
                    {comment.user?.name}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="h-[0.5px] bg-zinc-300 w-full my-6"></div>
      <div className="flex items-center p-4">
        <div className="text-xl">Your Answer</div>
      </div>
      <textarea
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full h-32 border-zinc-200 border rounded-md p-4 outline-none"
      ></textarea>
      <button
        onClick={() => {
          postAnswer();
        }}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md w-fit hover:bg-blue-600 transition-all"
      >
        Post Your Answer
      </button>
    </div>
  );
}

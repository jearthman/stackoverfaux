import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { User } from "../types/model";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "react-router";

export default function User() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        console.log(data);
      });
  }, [id]);

  return (
    <div className="flex flex-col p-10">
      <span className="text-4xl">{user?.name}</span>
      <div className="text-xl mt-4">Questions: {user?.questions.length}</div>
      {user?.questions.map((question) => (
        <div
          onClick={() => {
            navigate(`/questions/${question.id}`);
          }}
        >
          <ReactMarkdown
            className="text-sm mt-2 ml-2 cursor-pointer text-blue-600 hover:underline"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {question.title}
          </ReactMarkdown>
        </div>
      ))}
      <div className="text-xl mt-4">Answers: {user?.answers.length}</div>
      {user?.answers.map((answer) => (
        <div
          onClick={() => {
            navigate(`/questions/${answer.questionId}`);
          }}
        >
          <ReactMarkdown
            className="text-sm mt-2 ml-2 cursor-pointer text-blue-600 hover:underline"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {answer.body.slice(0, 100) + "..."}
          </ReactMarkdown>
        </div>
      ))}
      <div className="text-xl mt-4">Comments: {user?.comments.length}</div>
      {user?.comments.map((comment) => (
        <div
          onClick={() => {
            navigate(`/questions/${comment.questionId}`);
          }}
        >
          <ReactMarkdown
            className="text-sm mt-2 ml-2 cursor-pointer text-blue-600 hover:underline"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {comment.body.slice(0, 100) + "..."}
          </ReactMarkdown>
        </div>
      ))}
      <button
        onClick={() => {
          fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
          });
          navigate("/");
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
      >
        I dont like this user, delete their account
      </button>
    </div>
  );
}

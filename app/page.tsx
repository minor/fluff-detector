"use client";
import { useState, useEffect } from "react";

interface Suggestion {
  fluff: string;
  suggestion: string;
}

export default function Home() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [fluffLevel, setfluffLevel] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const words = text.trim().split(/\s+/);
    setWordCount(words.length);
  }, [text]);

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setText(value);
  };

  const handleClick = async () => {
    if (wordCount > 1000) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setfluffLevel(data.score);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <div className="relative">
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(#A4A4A3, transparent 50%)",
          }}
        ></div>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full stroke-gray-400/80 opacity-50 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth="{0}"
            ></path>
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth="{0}"
            fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          ></rect>
        </svg>
        <div className="mx-auto max-w-2xl pt-64 text-center">
          <div className="relative mx-4 flex flex-col sm:mx-0">
            <h1 className="relative mb-4 text-5xl font-semibold">
              Find out how much{" "}
              <span className="bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent">
                bullshit
              </span>{" "}
              you&apos;re writing
            </h1>

            <p className="mx-auto max-w-xl text-center text-xl text-gray-600">
              Stop writing fluff. Use this GPT-4o-powered calculator to figure
              out how much BS you&apos;re writing and how you can fix it.
            </p>
            <div className="mt-8">
              <textarea
                placeholder="Paste your paragraph/essay here (1000 words max)"
                className="w-full h-96 p-2 border rounded resize-none focus:outline-rose-100"
                value={text}
                onChange={handleChange}
              />
              <p
                className={
                  wordCount >= 1000
                    ? "text-red-500 text-sm mb-4"
                    : "text-gray-500 text-sm mb-4"
                }
              >
                {wordCount}/1000
              </p>
            </div>
            <button
              className={`bg-rose-400/80 mt-2 text-white px-6 py-2 rounded-lg font-semibold ${
                wordCount > 1000 || loading
                  ? "disabled cursor-default"
                  : "transition ease-in-out duration-200 hover:bg-rose-400"
              }`}
              onClick={handleClick}
              disabled={wordCount > 1000 || loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
            {/* logic for displaying fluff score + suggestions */}
            {fluffLevel !== null && (
              <div className="mt-8 border-t border-[#D8DADF] justify-center">
                <h1 className="mt-8 text-2xl font-medium text-gray-800">
                  Fluff Level:{" "}
                  <span className="bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent">
                    {fluffLevel}%
                  </span>
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Find out ways to improve your writing below:
                </p>
                <ol className="mt-4 gap-y-2 grid text-left">
                  {suggestions.map((item, index) => (
                    <li key={index} value={index + 1} className="">
                      {`${index + 1}. "${item.fluff}"`}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-rose-500/80 inline"
                        fill="currentColor"
                      >
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                      </svg>{" "}
                      {`"${item.suggestion}"`}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="flex justify-center pt-20 pb-10 bg-gray-50">
        <h3 className="text-gray-600 font-light text-base cursor-default">
          hacked together with <span className="hover:text-rose-400">♡</span> by{" "}
          <a
            className="underline text-rose-400 text-base hover:text-rose-400/60"
            href="https://saurish.com/"
          >
            saurish
          </a>{" "}
          |{" "}
          <a
            className="underline text-rose-400 text-base hover:text-rose-400/60"
            href="https://github.com/minor/fluff-detector/"
          >
            how it works
          </a>
        </h3>
      </footer>
    </main>
  );
}

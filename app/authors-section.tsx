"use client";
import { useState } from "react";
import Image from "next/image";
import caisLogo from "@/assets/cais_icon_black_text.svg";
import github_logo from "@/assets/github_logo.svg";
import hf_logo from "@/assets/hf-logo.png";
import { FileText, Users, ChevronDown, ChevronUp } from "lucide-react";
import { PAPER_URL, GITHUB_URL } from "./constants";

export function AuthorsSection() {
  const [showFullAuthors, setShowFullAuthors] = useState(false);

  const authorGroups = {
    firstLine: [
      {
        name: "Long Phan",
        sup: "1",
        link: "https://longphan.ai/",
      },
      {
        name: "Mantas Mazeika",
        sup: "1",
        link: "https://scholar.google.com/citations?user=fGeEmLQAAAAJ&hl=en",
      },
      {
        name: "Andy Zou",
        sup: "1,2,3",
        link: "https://andyzoujm.github.io/",
      },
      {
        name: "Dan Hendrycks",
        sup: "1",
        link: "https://people.eecs.berkeley.edu/~hendrycks/",
      },
    ],
  };

  const renderAuthors = (
    authors: { name: string; sup: string; link: string }[]
  ) => {
    return authors.map((author, index) => (
      <span
        key={author.name}
        className="text-sm whitespace-nowrap inline-block"
      >
        {author.link ? (
          <a
            href={author.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 hover:underline"
          >
            {author.name}
          </a>
        ) : (
          author.name
        )}
        <sup>{author.sup}</sup>
        {index < authors.length - 1 ? ", " : ""}
      </span>
    ));
  };

  return (
    <div className="w-full text-base">
      <div className="ml-10 flex items-center justify-center gap-2">
        <a className="flex items-center justify-center border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100 transition-colors" href={PAPER_URL} target="_blank">
          <FileText className="mr-1.5 h-4 w-4" /> Paper
        </a>
        <a 
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100 transition-colors"
        >
          <Image src={github_logo} alt="GitHub" width={16} height={16} className="mr-1.5" />
          Code
        </a>
        <a 
          href="https://huggingface.co/blog/textquests"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100 transition-colors"
        >
          <Image src={hf_logo} alt="Hugging Face" width={20} height={20} className="mr-1" />
          Blog
        </a>
        <button 
          onClick={() => setShowFullAuthors(!showFullAuthors)}
          className="flex items-center justify-center border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100 transition-colors"
        >
          <Users className="mr-1.5 h-4 w-4" /> Authors {showFullAuthors ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </button>
      </div>
      <div className="flex mt-4 mr-5 flex-wrap justify-center gap-4 text-center text-gray-700 items-center">
        <a
          href="https://safe.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 hover:underline flex items-center gap-2"
        >
          <Image src={caisLogo.src} alt="Center for AI Safety Logo" width={84} height={84} />
        </a>
      </div>
      <div className="w-full">
        <div className="mx-auto max-w-4xl rounded-lg p-6 text-center">
          {showFullAuthors ? (
            <>
              <p className="text-base">{renderAuthors(authorGroups.firstLine)}</p>
              <div className="mt-4 text-xs font-semibold text-gray-700">
                <p>
                  <sup>1</sup>Center for AI Safety
                </p>
                <p className="mt-1">
                  <sup>2</sup>Carnegie Mellon University
                </p>
                <p className="mt-1">
                  <sup>3</sup>Gray Swan AI
                </p>
              </div>
            </>
          ) : <></>}
        </div>
      </div>
    </div>
  );
}

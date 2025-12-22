import React, { useState, useEffect } from "react";
import { examples, NUM_PER_PAGE } from "@/components/examples_paper";

const renderText = (text: string) => {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
};

const ExampleCard: React.FC<{ example: typeof examples[0]; index?: number }> = ({ example, index }) => {
  return (
    <div className="flex flex-col h-full space-y-4 rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col h-full">
        <h4 className="text-black-700 mt-2 font-medium sm:text-base text-sm">Question:</h4>
        <div className="flex-1 flex text-sm flex-col">
          <div>
            <p className="whitespace-pre-wrap text-gray-600">
              {renderText(example.question)}
            </p>
            {example?.image && (
              <img
                src={example.image}
                alt="Question image"
                className={`mb-2 h-auto max-h-40 max-w-full rounded-md mx-auto ${index === 1 ? 'mt-9' : ''}`}
              />
            )}
          </div>

          {example.answerType === "multipleChoice" && (
            <div className={`${index === 1 ? 'mt-9' : ''}`}>              <span className="text-black-700 font-medium">
                {"Answer Statements:"}
              </span>
              <p className="whitespace-pre-wrap text-sm text-gray-600">
                {renderText(example.answer)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function ExampleCarousel({ questionsPerPage = NUM_PER_PAGE }) {
  const [isMobile, setIsMobile] = useState(false);

  // Add useEffect to check screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet/mobile breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Adjust questionsPerPage based on screen size
  const effectiveQuestionsPerPage = isMobile ? 1 : questionsPerPage;

  // Update renderGrid to handle mobile layout
  const renderGrid = () => {
    // Show single example for mobile
    if (isMobile) {
      return (
        <div className="flex flex-col gap-4">
          {examples.slice(0, 1).map((example, index) => (
            example && <ExampleCard key={index} example={example} />
          ))}
        </div>
      );
    }

    // Original layout logic for desktop
    if (effectiveQuestionsPerPage === 5) {
      const [first, second, third, fourth, fifth] = examples;
      return (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {first && <ExampleCard example={first} />}
            {second && <ExampleCard example={second} />}
          </div>
          <div className="flex justify-center">
            {third && <div className="w-full"><ExampleCard example={third} /></div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {fourth && <ExampleCard example={fourth} />}
            {fifth && <ExampleCard example={fifth} />}
          </div>
        </div>
      );
    }

    // Default grid layout for 2 questions per row
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: Math.ceil(examples.length / 2) }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {examples.slice(rowIndex * 2, rowIndex * 2 + 2).map((example, index) => (
              example && <ExampleCard key={index} example={example} index={index} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl rounded-md bg-white p-3 text-sm shadow-sm">
      <div className="mb-2 flex items-center justify-between">
      </div>

      {renderGrid()}
    </div>
  );
}

const ExamplesAccordion2: React.FC = () => {
  return (
    <div className="borderrounded-md my-2 overflow-hidden  -mx-[10%]">
                  <div className="p-2">
              <ExampleCarousel questionsPerPage={2} />
            </div>
    </div>
  );
};

export default ExamplesAccordion2;
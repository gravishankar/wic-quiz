"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Question {
  id: number;
  passage: string;
  blank_sentence: string;
  choice_A: string;
  choice_B: string;
  choice_C: string;
  choice_D: string;
  correct_answer: string;
  strategy_tag: string;
  explanation: string;
}

interface HistoryItem {
  id: number;
  selected: string;
  isCorrect: boolean;
  confidence: number;
}

// Sample data for testing
const sampleQuestions: Question[] = [
  {
    id: 1,
    passage: "The scientist's findings were groundbreaking, fundamentally altering our understanding of cellular biology.",
    blank_sentence: "Her research was so _____ that it changed the entire field.",
    choice_A: "A. revolutionary",
    choice_B: "B. mundane",
    choice_C: "C. confusing",
    choice_D: "D. expensive",
    correct_answer: "A. revolutionary",
    strategy_tag: "Contextual Definition",
    explanation: "The passage describes findings as 'groundbreaking' and 'fundamentally altering understanding', which directly supports 'revolutionary' as the correct answer."
  },
  {
    id: 2,
    passage: "Despite the harsh criticism from reviewers, the author remained steadfast in her artistic vision.",
    blank_sentence: "The writer was _____ in maintaining her creative direction.",
    choice_A: "A. flexible",
    choice_B: "B. unwavering",
    choice_C: "C. uncertain",
    choice_D: "D. dismissive",
    correct_answer: "B. unwavering",
    strategy_tag: "Contrast/Despite Signal",
    explanation: "'Despite the harsh criticism' signals a contrast - the author didn't change course, remaining 'steadfast' or 'unwavering'."
  }
];

export default function WICQuiz() {
  const [questions] = useState<Question[]>(sampleQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [locked, setLocked] = useState(false);
  const [phase, setPhase] = useState(0); // 0: answering, 1-3: coaching phases
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const question = questions[currentIndex];
  const choices = [question?.choice_A, question?.choice_B, question?.choice_C, question?.choice_D];

  const letter = (choice: string) => choice?.charAt(0) || "";

  const isCorrect = selected === question?.correct_answer;

  const handleSubmit = () => {
    if (!selected) return;

    setLocked(true);
    setPhase(1);

    const historyItem: HistoryItem = {
      id: question.id,
      selected,
      isCorrect,
      confidence
    };

    setHistory(prev => [...prev, historyItem]);
  };

  const resetForNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }

    setSelected("");
    setConfidence(3);
    setLocked(false);
    setPhase(0);
  };

  if (!question) {
    return <div>Loading questions...</div>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">SAT Words in Context Quiz</h1>
        <p className="text-gray-600">Master vocabulary through contextual understanding</p>
        <Progress value={progress} className="mt-4 max-w-md mx-auto" />
        <p className="text-sm text-gray-500 mt-2">Question {currentIndex + 1} of {questions.length}</p>
      </div>

      {/* Passage */}
      <Card className="p-6 rounded-2xl">
        <CardContent>
          <h2 className="font-semibold text-lg mb-4">Passage</h2>
          <p className="text-gray-800 leading-relaxed">{question.passage}</p>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="p-6 rounded-2xl">
        <CardContent>
          <h2 className="font-semibold text-lg mb-4">Complete the sentence:</h2>
          <p className="text-lg mb-6">{question.blank_sentence}</p>

          {!locked && (
            <>
              <div className="grid gap-3 mb-6">
                {choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setSelected(choice)}
                    className={`p-4 text-left rounded-xl border-2 transition-all ${
                      selected === choice
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {/* Confidence Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Confidence Level: {confidence}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selected}
                className="w-full"
              >
                Submit Answer
              </Button>
            </>
          )}

          {/* Answer feedback */}
          {locked && phase === 0 && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
              {isCorrect ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <XCircle className="text-red-600" size={24} />
              )}
              <span className="font-medium">
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coaching Phase 1 */}
      {locked && phase === 1 && (
        <Card className="p-4 bg-blue-50 rounded-2xl">
          <CardContent>
            <p className="font-semibold">Phase 1 · Strategy</p>
            <p className="text-sm mt-1">This is a <b>{question.strategy_tag}</b> item.</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={() => setPhase(2)}>
                Next · Guided Elimination
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coaching Phase 2 */}
      {locked && phase === 2 && (
        <Card className="p-4 bg-yellow-50 rounded-2xl">
          <CardContent>
            <p className="font-semibold">Phase 2 · Guided Elimination</p>
            <div className="text-sm mt-2 space-y-1">
              {choices
                .filter((c) => c !== question.correct_answer)
                .map((c) => (
                  <div key={c}>
                    <span className="font-medium">{c}</span>
                    {": "}
                    <span className="text-gray-800">Does not fit the context.</span>
                    {selected === c && <span className="ml-2 text-xs text-amber-700">(You chose this)</span>}
                  </div>
                ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={() => setPhase(3)}>
                Next · Final Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coaching Phase 3 */}
      {locked && phase === 3 && (
        <Card className="p-4 bg-green-50 rounded-2xl">
          <CardContent>
            <p className="font-semibold">Phase 3 · Final Verification</p>
            <p className="text-sm mt-2">Correct: <b>{question.correct_answer}</b></p>
            <p className="text-sm mt-2">Explanation: {question.explanation}</p>
            <p className="text-sm mt-2">
              Substitution: {question.blank_sentence?.replace("_____", question.correct_answer.split(". ")[1] || question.correct_answer)}
            </p>
            <div className="flex gap-2 mt-3">
              <Button onClick={resetForNext} className="w-full">
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="p-4 rounded-2xl">
          <CardContent>
            <p className="font-semibold">Session Summary</p>
            <ul className="mt-2 text-sm space-y-1">
              {history.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span>{i + 1}. Q{h.id} — You chose {letter(h.selected)};</span>
                  <span className={`font-medium ${h.isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {h.isCorrect ? "correct" : "incorrect"}
                  </span>
                  <span>; confidence {h.confidence}/5</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
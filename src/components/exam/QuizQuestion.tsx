import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  onAnswer: (isCorrect: boolean) => void;
  showResult?: boolean;
}

export const QuizQuestion = ({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  showResult = false
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === correctAnswer;
    setHasAnswered(true);
    onAnswer(isCorrect);
  };

  const isCorrect = hasAnswered && selectedAnswer === correctAnswer;
  const isIncorrect = hasAnswered && selectedAnswer !== correctAnswer;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question}</h3>
          
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={hasAnswered}
            className="space-y-3"
          >
            {options.map((option, index) => {
              const isThisCorrect = hasAnswered && option === correctAnswer;
              const isThisSelected = option === selectedAnswer;
              const isThisWrong = hasAnswered && isThisSelected && !isThisCorrect;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    isThisCorrect
                      ? "bg-green-500/10 border-green-500"
                      : isThisWrong
                      ? "bg-red-500/10 border-red-500"
                      : isThisSelected
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                  {isThisCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {isThisWrong && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {hasAnswered && explanation && (
          <div className={`p-4 rounded-lg ${
            isCorrect ? "bg-green-500/10" : "bg-yellow-500/10"
          }`}>
            <p className="text-sm font-medium mb-1">Explication :</p>
            <p className="text-sm">{explanation}</p>
          </div>
        )}

        {!hasAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full"
          >
            Valider
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
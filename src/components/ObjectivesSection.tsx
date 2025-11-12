import { Card } from "./ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Target } from "lucide-react";

interface ObjectivesSectionProps {
  content: string;
}

export const ObjectivesSection = ({ content }: ObjectivesSectionProps) => {
  if (!content) return null;

  return (
    <div className="container mx-auto px-6 py-12">
      <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Mục tiêu bài tập lớn</h2>
        </div>
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
};

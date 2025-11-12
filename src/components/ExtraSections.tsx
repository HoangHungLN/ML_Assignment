import { Section } from "@/utils/markdownParser";
import { Card } from "./ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileCode, FolderTree, BookOpen, Users as UsersIcon, MessageCircle } from "lucide-react";

interface ExtraSectionsProps {
  sections: Section[];
}

const sectionIcons: Record<string, React.ReactNode> = {
  "Hướng dẫn chạy notebook": <FileCode className="w-5 h-5" />,
  "Cấu trúc dự án": <FolderTree className="w-5 h-5" />,
  "Notebook": <BookOpen className="w-5 h-5" />,
  "Phân chia công việc": <UsersIcon className="w-5 h-5" />,
  "Liên hệ": <MessageCircle className="w-5 h-5" />,
};

export const ExtraSections = ({ sections }: ExtraSectionsProps) => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="space-y-8">
        {sections.map((section, index) => (
          <Card
            key={index}
            className="p-8 bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {sectionIcons[section.title] || <FileCode className="w-5 h-5" />}
              </div>
              <h2 className="text-3xl font-bold text-foreground">{section.title}</h2>
            </div>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

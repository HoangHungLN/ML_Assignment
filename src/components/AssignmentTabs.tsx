import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "./ui/card";
import { MLPresentation } from "./MLPresentation";
import { HMMParameterLearning } from "./HMMParameterLearning";
import { Assignment2Presentation } from "./Assignment2Presentation";
import { Assignment3Presentation } from "./Assignment3Presentation";
import { Assignment1Part1 } from "./Assignment1Part1";
interface AssignmentTabsProps {
  assignment1: string;
  assignment2: string;
  assignment3: string;
  extension: string;
}

export const AssignmentTabs = ({
  assignment1,
  assignment2,
  assignment3,
  extension,
}: AssignmentTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("assignment1");

  const assignments = [
    { id: "assignment1", label: "Assignment 1", content: assignment1 },
    { id: "assignment2", label: "Assignment 2", content: assignment2 },
    { id: "assignment3", label: "Assignment 3", content: assignment3 },
    { id: "extension", label: "Phần mở rộng", content: extension },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-card/50 p-2 h-auto">
          {assignments.map((assignment) => (
            <TabsTrigger
              key={assignment.id}
              value={assignment.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm md:text-base font-semibold py-3 px-6 transition-all duration-300 hover:bg-primary/10"
            >
              {assignment.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {assignments.map((assignment) => (
          <TabsContent
            key={assignment.id}
            value={assignment.id}
            className="mt-8"
          >
            {assignment.id === "assignment1" ? (
  <div className="space-y-8">
    {/* Phần 1: EDA & Preprocessing (Mới thêm) */}
    <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
       <Assignment1Part1 />
    </Card>

    {/* Phần 2: Model & Kết quả (Giữ lại cái cũ tạm thời) */}
    <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
       <MLPresentation />
    </Card>
  </div>
) : assignment.id === "assignment2" ? (
              <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
                <Assignment2Presentation markdown={assignment.content} />
              </Card>
            ) : assignment.id === "assignment3" ? (
              <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
                <Assignment3Presentation />
              </Card>
            ) : assignment.id === "extension" ? (
              <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
                {(() => {
                  const content =
                    assignment.content ||
                    "*Nội dung đang được cập nhật...*";
                  const forwardAlgoMatch = content.match(
                    /^([\s\S]*?)(#{1,3}\s*Forward Algorithm[\s\S]*)$/m
                  );

                  if (forwardAlgoMatch) {
                    const [, beforeForward, forwardAndAfter] = forwardAlgoMatch;
                    return (
                      <>
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {beforeForward}
                          </ReactMarkdown>
                        </div>
                        <HMMParameterLearning />
                        <div className="markdown-content mt-8">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {forwardAndAfter}
                          </ReactMarkdown>
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      </div>
                      <HMMParameterLearning />
                    </>
                  );
                })()}
              </Card>
            ) : (
              <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {assignment.content ||
                      "*Nội dung đang được cập nhật...*"}
                  </ReactMarkdown>
                </div>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

import { useEffect, useState } from "react";
import { parseReadme, ParsedReadme } from "@/utils/markdownParser";
import { Hero } from "@/components/Hero";
import { ObjectivesSection } from "@/components/ObjectivesSection";
import { AssignmentTabs } from "@/components/AssignmentTabs";
import { ExtraSections } from "@/components/ExtraSections";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<ParsedReadme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReadme = async () => {
      try {
        const response = await fetch("/README.md");
        const markdown = await response.text();
        const parsed = parseReadme(markdown);
        setData(parsed);
      } catch (error) {
        console.error("Error loading README:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReadme();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Không thể tải dữ liệu
          </h1>
          <p className="text-muted-foreground">Vui lòng kiểm tra lại file README.md</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero
        courseInfo={data.courseInfo}
        lecturer={data.lecturer}
        teamMembers={data.teamMembers}
      />
      
      <ObjectivesSection content={data.objectives} />
      
      <AssignmentTabs
        assignment1={data.assignment1}
        assignment2={data.assignment2}
        assignment3={data.assignment3}
        extension={data.extension}
      />
      
      <ExtraSections sections={data.extraSections} />
      
      {/* Group Activities */}
      {data.groupActivities && (
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-lg text-foreground/80">
              <span className="text-muted-foreground">Hoạt động nhóm:</span>{" "}
              <a
                href={data.groupActivities.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 underline transition-colors"
              >
                {data.groupActivities.title}
              </a>
            </p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-border/50">
        <div className="text-center text-sm text-muted-foreground">
          <p>Bài Tập Lớn Học Máy – CO3117 | Nhóm CEML2 | {data.courseInfo.semester}, {data.courseInfo.academicYear}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

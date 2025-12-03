import { CourseInfo, Lecturer, TeamMember } from "@/utils/markdownParser";
import { GraduationCap, Users, Mail, Github } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface HeroProps {
  courseInfo: CourseInfo;
  lecturer: Lecturer;
  teamMembers: TeamMember[];
}

// Mapping tên thành viên -> đường dẫn avatar
const getAvatarMap = (): Record<string, string> => {
  const base = import.meta.env.BASE_URL;
  return {
    "Trương Thiên Ân": `${base}images/an-avatar.jpg`,
    "Lại Nguyễn Hoàng Hưng": `${base}images/hung-avatar.jpg`,
    "Nguyễn Tô Quốc Việt": `${base}images/viet-avatar.jpg`,
  };
};

export const Hero = ({ courseInfo, lecturer, teamMembers }: HeroProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Course Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {courseInfo.courseCode}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {courseInfo.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {courseInfo.className} • {courseInfo.semester},{" "}
            {courseInfo.academicYear}
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <a
                href="https://github.com/HoangHungLN/MachineLearning_Assignment"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                GitHub Repository
              </a>
            </Button>
          </div>
        </div>

        {/* Lecturer */}
        <div className="text-center mb-12">
          <p className="text-lg text-foreground/70">
            <span className="text-muted-foreground">Giảng viên:</span>{" "}
            <span className="font-semibold text-foreground">
              {lecturer.name}
            </span>
          </p>
        </div>

        {/* Team Members */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Nhóm CEML2</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => {
              const avatarSrc = getAvatarMap()[member.name];

              return (
                <Card
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="text-center space-y-3">
                    {avatarSrc ? (
                      // Nếu có avatar trong map -> hiển thị ảnh tròn
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-primary/60 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={avatarSrc}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      // Không có avatar -> fallback chữ cái đầu như cũ
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-primary">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        MSSV: {member.id}
                      </p>
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

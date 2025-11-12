export interface CourseInfo {
  title: string;
  courseName: string;
  courseCode: string;
  className: string;
  semester: string;
  academicYear: string;
}

export interface Lecturer {
  name: string;
}

export interface TeamMember {
  name: string;
  id: string;
  email: string;
}

export interface Section {
  title: string;
  content: string;
}

export interface GroupActivities {
  title: string;
  url: string;
}

export interface ParsedReadme {
  courseInfo: CourseInfo;
  lecturer: Lecturer;
  teamMembers: TeamMember[];
  objectives: string;
  assignment1: string;
  assignment2: string;
  assignment3: string;
  extension: string;
  groupActivities: GroupActivities | null;
  extraSections: Section[];
}

export const parseReadme = (markdown: string): ParsedReadme => {
  const lines = markdown.split('\n');
  
  // Extract course info from title
  const titleMatch = markdown.match(/# (.+?) – (.+?) \((.+?), (.+?)\)/);
  const courseInfo: CourseInfo = {
    title: titleMatch?.[1] || '',
    courseName: titleMatch?.[2] || '',
    courseCode: titleMatch?.[2]?.match(/CO\d+/)?.[0] || '',
    className: titleMatch?.[4] || '',
    semester: '',
    academicYear: ''
  };

  // Extract semester and academic year
  const semesterMatch = markdown.match(/Học kỳ:\*\* (.+?), Năm học (.+)/);
  if (semesterMatch) {
    courseInfo.semester = semesterMatch[1];
    courseInfo.academicYear = semesterMatch[2];
  }

  // Extract lecturer
  const lecturerMatch = markdown.match(/Giảng viên hướng dẫn[\s\S]*?-\s+\*\*(.+?)\*\*/);
  const lecturer: Lecturer = {
    name: lecturerMatch?.[1] || ''
  };

  // Extract team members
  const teamMembers: TeamMember[] = [];
  const memberRegex = /-\s+\*\*(.+?)\*\* – (\d+) – (.+?)(?:\s|$)/g;
  let match;
  while ((match = memberRegex.exec(markdown)) !== null) {
    teamMembers.push({
      name: match[1],
      id: match[2],
      email: match[3]
    });
  }

  // Extract sections by headings - improved to capture all content
  const getSection = (heading: string): string => {
    // Find the heading and capture everything until the next ## heading or end of file
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`##\\s+${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+[^#]|$)`, 'i');
    const match = markdown.match(regex);
    return match?.[1]?.trim() || '';
  };

  const objectives = getSection('Mục tiêu bài tập lớn');
  const assignment1 = getSection('Assignment 1');
  const assignment2 = getSection('Assignment 2');
  const assignment3 = getSection('Assignment 3');
  const extension = getSection('Phần mở rộng');

  // Extract group activities with link
  const groupActivitiesMatch = markdown.match(/Hoạt động nhóm:\s*\*\*\[(.+?)\]\((.+?)\)\*\*/);
  const groupActivities = groupActivitiesMatch ? {
    title: groupActivitiesMatch[1],
    url: groupActivitiesMatch[2]
  } : null;

  // Extract extra sections
  const extraSections: Section[] = [
    { title: 'Hướng dẫn chạy notebook', content: getSection('Hướng dẫn chạy notebook') },
    { title: 'Cấu trúc dự án', content: getSection('Cấu trúc dự án') },
    { title: 'Notebook', content: getSection('Notebook') },
    { title: 'Phân chia công việc', content: getSection('Phân chia công việc') },
    { title: 'Liên hệ', content: getSection('Liên hệ') }
  ].filter(section => section.content);

  return {
    courseInfo,
    lecturer,
    teamMembers,
    objectives,
    assignment1,
    assignment2,
    assignment3,
    extension,
    groupActivities,
    extraSections
  };
};

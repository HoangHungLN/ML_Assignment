import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Database,
  Layers,
  AlertTriangle,
  BarChart3,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

const labelStats = [
  { topic: "Hardware", count: 13617, ratio: 28.5 },
  { topic: "HR Support", count: 10915, ratio: 22.8 },
  { topic: "Access", count: 7125, ratio: 14.9 },
  { topic: "Miscellaneous", count: 7060, ratio: 14.8 },
  { topic: "Storage", count: 2777, ratio: 5.8 },
  { topic: "Purchase", count: 2464, ratio: 5.2 },
  { topic: "Internal Project", count: 2119, ratio: 4.4 },
  { topic: "Administrative rights", count: 1760, ratio: 3.7 },
];

const TOTAL_SAMPLES = 47837;
const NUM_CLASSES = labelStats.length;

const COLORS = [
  "hsl(var(--muted-foreground))",
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--ai-glow))",
];

const models = [
  {
    name: "Logistic Regression",
    icon: Target,
    bestCombo: "Bag of Words (BoW)",
    accuracy: "86.50%",
    role: "Mô hình tốt nhất",
    summary:
      "Hoạt động rất tốt trên dữ liệu thưa, chiều cao sinh ra từ BoW. Regularization với C = 0.1 giúp tránh overfitting.",
    bullets: [
      "Best combo: BoW + Logistic Regression",
      "Phù hợp dữ liệu text ngắn, nhiều từ khóa kỹ thuật",
      "Cân bằng giữa độ chính xác và tốc độ huấn luyện",
    ],
  },
  {
    name: "Linear SVM (LinearSVC)",
    icon: TrendingUp,
    bestCombo: "BoW / TF–IDF",
    accuracy: "Khá cao, thấp hơn LR một chút",
    role: "Đối thủ mạnh",
    summary:
      "Linear SVM cho biên quyết định sắc nét trên không gian chiều cao, nhưng nhạy hơn với nhiễu và cần tuning C cẩn thận.",
    bullets: [
      "Hiệu năng gần sát Logistic Regression trong nhiều cấu hình",
      "Ưu điểm trên dữ liệu tuyến tính phân tách rõ",
      "Thích hợp dùng như baseline mạnh để so sánh",
    ],
  },
  {
    name: "Naive Bayes (MultinomialNB)",
    icon: Layers,
    bestCombo: "BoW / TF–IDF",
    accuracy: "Ổn, nhưng thấp hơn LR & SVM",
    role: "Baseline nhẹ",
    summary:
      "Giả định độc lập điều kiện giữa các từ, huấn luyện cực nhanh, phù hợp làm baseline và chạy thử nghiệm nhanh.",
    bullets: [
      "Thời gian train & predict rất nhanh",
      "Hiệu quả tốt với dữ liệu nhiều từ khóa đặc trưng",
      "Độ chính xác thấp hơn Logistic Regression & SVM theo biểu đồ so sánh",
    ],
  },
];

interface Assignment2PresentationProps {
  markdown?: string;
}

export const Assignment2Presentation: React.FC<
  Assignment2PresentationProps
> = ({ markdown }) => {
  const [showRawDetail, setShowRawDetail] = useState(false);

  const minorityClasses = labelStats.filter((c) => c.ratio < 8);
  const majorityClasses = labelStats.filter((c) => c.ratio > 20);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--card))] via-[hsl(var(--background))] to-[hsl(var(--card))] border border-primary/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/40 rounded-full px-4 py-2 backdrop-blur-sm">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Assignment 2 · IT Ticket Classification
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Phân tích phân phối nhãn & xây dựng bài toán phân loại yêu cầu IT
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Phân tích cấu trúc tập dữ liệu ticket IT, trực quan hóa phân phối
            8 nhóm chủ đề và chuẩn bị nền tảng để huấn luyện mô hình phân loại
            tự động.
          </p>
        </div>
      </div>

      {/* 3 card thống kê */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tổng quan dữ liệu */}
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Tổng quan dữ liệu</CardTitle>
              <CardDescription>Tập ticket IT đã gán nhãn</CardDescription>
            </div>
            <Database className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">
                Số mẫu (tickets)
              </span>
              <span className="text-2xl font-bold text-primary">
                {TOTAL_SAMPLES.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">
                Số nhãn (topic groups)
              </span>
              <span className="text-xl font-semibold">{NUM_CLASSES}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mỗi mẫu tương ứng với một yêu cầu hỗ trợ, được gán vào một trong{" "}
              {NUM_CLASSES} nhóm chủ đề khác nhau.
            </p>
          </CardContent>
        </Card>

        {/* Nhóm chiếm tỉ lệ lớn */}
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Phân phối nhãn</CardTitle>
              <CardDescription>Nhóm chiếm tỉ lệ lớn nhất</CardDescription>
            </div>
            <Layers className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {majorityClasses.map((cls) => (
              <div
                key={cls.topic}
                className="flex items-baseline justify-between text-sm"
              >
                <span className="text-muted-foreground">{cls.topic}</span>
                <span className="font-medium">
                  {cls.count.toLocaleString("en-US")}{" "}
                  <span className="text-muted-foreground">
                    ({cls.ratio.toFixed(1)}%)
                  </span>
                </span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hai nhóm <span className="font-medium">Hardware</span> và{" "}
              <span className="font-medium">HR Support</span> chiếm hơn một
              nửa tổng số ticket trong tập dữ liệu.
            </p>
          </CardContent>
        </Card>

        {/* Các lớp thiểu số */}
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Mức độ mất cân bằng</CardTitle>
              <CardDescription>Các lớp thiểu số</CardDescription>
            </div>
            <AlertTriangle className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {minorityClasses.map((cls) => (
              <div
                key={cls.topic}
                className="flex items-baseline justify-between text-sm"
              >
                <span className="text-muted-foreground">{cls.topic}</span>
                <span className="font-medium">
                  {cls.count.toLocaleString("en-US")}{" "}
                  <span className="text-muted-foreground">
                    ({cls.ratio.toFixed(1)}%)
                  </span>
                </span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Các nhóm này có tỉ lệ dưới 8%, cần cân nhắc{" "}
              <span className="font-medium">
                class weighting / resampling
              </span>{" "}
              khi huấn luyện mô hình.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 🔻 BIỂU ĐỒ PHÂN PHỐI NHÃN – đặt ngay dưới 3 card trên */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">
              Phân phối số lượng mẫu theo nhãn
            </CardTitle>
            <CardDescription>
              Biểu đồ cột mô tả số ticket cho từng nhóm chủ đề
            </CardDescription>
          </div>
          <BarChart3 className="w-6 h-6 text-primary" />
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={labelStats}
              layout="vertical"
              margin={{ top: 16, right: 24, bottom: 8, left: 120 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => value.toLocaleString("en-US")}
              />
              <YAxis
                type="category"
                dataKey="topic"
                stroke="hsl(var(--muted-foreground))"
                width={120}
              />
              <Tooltip
                formatter={(value: number, _name, props) => {
                  const item = props.payload as (typeof labelStats)[number];
                  return [
                    `${value.toLocaleString("en-US")} mẫu (${item.ratio.toFixed(
                      1
                    )}%)`,
                    "Số lượng",
                  ];
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 4, 4]}
                maxBarSize={32}
                isAnimationActive={true}
              >
                {labelStats.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Workflow 3 bước */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wide">
              <span className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                1
              </span>
              Problem Understanding
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">
                Định nghĩa bài toán & mục tiêu
              </CardTitle>
            </div>
            <CardDescription>
              Chuyển bài toán ticket IT thành bài toán{" "}
              <span className="font-medium">multi-class text classification</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Xác định 8 nhóm chủ đề làm nhãn.</li>
              <li>Hiểu rõ nghiệp vụ từng nhóm ticket.</li>
              <li>Đặt tiêu chí đánh giá: accuracy, F1 theo lớp,…</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wide">
              <span className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                2
              </span>
              Data & Features
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">
                Tiền xử lý & biểu diễn văn bản
              </CardTitle>
            </div>
            <CardDescription>
              Làm sạch text và sinh đặc trưng BoW / TF–IDF / TF–IDF Weighted
              GloVe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Chuẩn hóa chữ, tokenization, loại bỏ stopwords.</li>
              <li>Xây dựng lớp <code>TextPreprocessor</code> linh hoạt.</li>
              <li>Trích xuất đặc trưng bằng BoW, TF–IDF, TF–IDF GloVe.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wide">
              <span className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                3
              </span>
              Modeling & Evaluation
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">
                Huấn luyện & đánh giá mô hình
              </CardTitle>
            </div>
            <CardDescription>
              Thử nghiệm Naive Bayes, Logistic Regression, Linear SVM.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Chia train/validation/test, giữ phân phối nhãn ổn.</li>
              <li>Tuning hyperparameters cho từng mô hình.</li>
              <li>
                Đánh giá bằng Accuracy, Precision, Recall, F1; phân tích lớp
                khó.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Models */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl">
              Các mô hình phân loại đã triển khai
            </CardTitle>
            <CardDescription>
              So sánh Naive Bayes, Logistic Regression, Linear SVM với các
              đặc trưng BoW / TF–IDF / TF–IDF GloVe.
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary">
              Best: LR + BoW (86.50%)
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {models.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.name}
                className="rounded-xl border border-border/60 bg-card/80 p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{m.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-mono uppercase tracking-wide">
                    {m.role}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <span className="font-semibold">Best combo: </span>
                    {m.bestCombo}
                  </p>
                  <p>
                    <span className="font-semibold">Hiệu năng: </span>
                    {m.accuracy}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{m.summary}</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  {m.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Markdown chi tiết (gốc) */}
      {markdown && (
        <Card className="bg-card/40 border-border/40">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                Báo cáo chi tiết Assignment 2
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRawDetail((v) => !v)}
              className="shrink-0"
            >
              {showRawDetail ? "Ẩn nội dung chi tiết" : "Xem chi tiết gốc"}
            </Button>
          </CardHeader>
          {showRawDetail && (
            <CardContent>
              <div className="markdown-content prose prose-sm md:prose-base max-w-none prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

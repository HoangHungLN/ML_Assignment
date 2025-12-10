import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
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
  Activity,
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
const METRIC_COLORS = {
  precision: "hsl(var(--ai-glow))",
  recall: "hsl(var(--primary))",
  f1: "hsl(var(--accent))",
};
// Kết quả best model: Logistic Regression + BoW
const BEST_MODEL_ACCURACY = 0.8649665551839465; // ~86.5%

// Precision / Recall / F1 cho từng nhãn của Logistic Regression + BoW
const perClassMetrics = [
  {
    label: "Access",
    precision: 0.92,
    recall: 0.9,
    f1: 0.91,
  },
  {
    label: "Administrative rights",
    precision: 0.88,
    recall: 0.69,
    f1: 0.77,
  },
  {
    label: "HR Support",
    precision: 0.87,
    recall: 0.87,
    f1: 0.87,
  },
  {
    label: "Hardware",
    precision: 0.82,
    recall: 0.88,
    f1: 0.85,
  },
  {
    label: "Internal Project",
    precision: 0.89,
    recall: 0.81,
    f1: 0.85,
  },
  {
    label: "Miscellaneous",
    precision: 0.83,
    recall: 0.83,
    f1: 0.83,
  },
  {
    label: "Purchase",
    precision: 0.97,
    recall: 0.9,
    f1: 0.93,
  },
  {
    label: "Storage",
    precision: 0.94,
    recall: 0.89,
    f1: 0.92,
  },
];

const models = [
  {
    name: "Logistic Regression",
    icon: Target,
    bestCombo: "Bag of Words (BoW)",
    accuracy: "86.5%",
    role: "Mô hình tốt nhất",
    summary:
      "Hoạt động rất tốt trên dữ liệu thưa sinh ra từ BoW. Regularization với C = 0.1 giúp tránh overfitting.",
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
    accuracy: "≈ 85.7%",
    role: "Đối thủ mạnh",
    summary:
      "Linear SVM cho biên quyết định sắc nét trên không gian chiều cao, hiệu năng rất gần Logistic Regression.",
    bullets: [
      "Hiệu năng gần sát Logistic Regression trong nhiều cấu hình",
      "Ưu điểm trên dữ liệu tuyến tính phân tách rõ",
      "Thích hợp dùng như baseline mạnh để so sánh",
    ],
  },
  {
    name: "Naive Bayes (MultinomialNB)",
    icon: Layers,
    bestCombo: "TF–IDF",
    accuracy: "≈ 80.0%",
    role: "Baseline nhẹ",
    summary:
      "Giả định độc lập điều kiện giữa các từ, huấn luyện cực nhanh, phù hợp làm baseline và thử nghiệm nhanh.",
    bullets: [
      "Thời gian train & predict rất nhanh",
      "Hiệu quả tốt với dữ liệu nhiều từ khóa đặc trưng",
      "Độ chính xác thấp hơn Logistic Regression & SVM theo đánh giá trên test set",
    ],
  },
];

interface Assignment2PresentationProps {
  markdown?: string; // vẫn để prop cho hợp với AssignmentTabs, nhưng không dùng nữa
}

export const Assignment2Presentation: React.FC<
  Assignment2PresentationProps
> = () => {
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

      {/* Biểu đồ phân phối nhãn */}
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
              margin={{ top: 16, right: 24, bottom: 8, left: 140 }}
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
                width={140}
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

      {/* Workflow 3 bước: tiền xử lý + trích xuất đặc trưng */}
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
              <li>Hiểu rõ nghiệp vụ & từ khóa đặc trưng từng nhóm.</li>
              <li>Đặt tiêu chí: Accuracy, F1 macro & weighted.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wide">
              <span className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                2
              </span>
              Preprocessing & Features
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">
                Tiền xử lý & trích xuất đặc trưng
              </CardTitle>
            </div>
            <CardDescription>
              Làm sạch text và sinh đặc trưng BoW / TF–IDF / TF–IDF GloVe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Làm sạch: lower-case, xoá HTML/ký tự thừa, chuẩn hóa khoảng
                trắng.
              </li>
              <li>
                Tách từ & loại stopwords tiếng Anh; encode nhãn từ tên nhóm
                sang số 0–7.
              </li>
              <li>
                Trích xuất BoW, TF–IDF và TF–IDF weighted GloVe thông qua lớp{" "}
                <code>TextPreprocessor</code> để dễ tái sử dụng.
              </li>
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
              <li>Chia train / validation / test theo tỉ lệ cố định.</li>
              <li>
                Grid search đơn giản trên hyperparameters (alpha, C, max_iter).
              </li>
              <li>
                Chọn mô hình theo validation accuracy, sau đó đánh giá chi tiết
                trên test bằng classification report.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Models overview */}
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
              Best: LR + BoW (≈{(BEST_MODEL_ACCURACY * 100).toFixed(1)}%)
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

      {/* Nhận xét & đánh giá – giống style Assigment 1 */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Nhận xét và đánh giá</CardTitle>
              <CardDescription>
                Phân tích chi tiết kết quả mô hình tốt nhất: Logistic
                Regression + BoW.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall accuracy */}
          <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Overall Accuracy: {(BEST_MODEL_ACCURACY * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Mô hình Logistic Regression + BoW đạt độ chính xác tổng thể
                  khoảng{" "}
                  {(BEST_MODEL_ACCURACY * 100).toFixed(1)}% trên tập test
                  gồm 4,784 mẫu.
                </p>
              </div>
            </div>
          </div>

          {/* High-level comments */}
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <p className="font-semibold text-foreground mb-1">
                Lớp tốt nhất
              </p>
              <p>
                <span className="font-semibold">Purchase</span> đạt F1-score{" "}
                <span className="font-semibold">0.93</span>, cho thấy các yêu
                cầu liên quan đến mua sắm (đặt hàng, license, gia hạn…) có đặc
                trưng từ khóa rất rõ ràng, mô hình phân biệt tốt.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <p className="font-semibold text-foreground mb-1">
                Lớp khó nhất
              </p>
              <p>
                <span className="font-semibold">Administrative rights</span> chỉ
                đạt F1-score <span className="font-semibold">0.77</span>. Nhóm
                này dễ bị nhầm với <span className="font-semibold">Access</span>{" "}
                hoặc <span className="font-semibold">Miscellaneous</span> do mô
                tả quyền truy cập/phân quyền khá tương đồng.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
              <p className="font-semibold text-foreground mb-1">
                Nhóm lớp hoạt động tốt
              </p>
              <p>
                Các nhóm <span className="font-semibold">Access</span>,{" "}
                <span className="font-semibold">HR Support</span>,{" "}
                <span className="font-semibold">Hardware</span> và{" "}
                <span className="font-semibold">Storage</span> đều có F1-score{" "}
                &gt; 0.85. Đây là các ticket có nội dung tương đối đồng nhất
                (hardware error, hỗ trợ nhân sự, lưu trữ), mô hình nắm bắt tốt
                pattern từ khóa.
              </p>
            </div>
          </div>

          {/* Chart Precision / Recall / F1 theo lớp */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Chi tiết Precision / Recall / F1-score theo lớp (Logistic
              Regression + BoW)
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={perClassMetrics}
                  margin={{ top: 16, right: 24, bottom: 40, left: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 1]}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    formatter={(value: number, name) => [
                      value.toFixed(2),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="precision"
                    name="Precision"
                    radius={[4, 4, 0, 0]}
                    fill={METRIC_COLORS.precision}
                  />
                  <Bar
                    dataKey="recall"
                    name="Recall"
                    radius={[4, 4, 0, 0]}
                    fill={METRIC_COLORS.recall}
                  />
                  <Bar
                    dataKey="f1"
                    name="F1-score"
                    radius={[4, 4, 0, 0]}
                    fill={METRIC_COLORS.f1}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tổng kết Assignment 2 */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader>
          <CardTitle className="text-xl">Tổng kết Assignment 2</CardTitle>
          <CardDescription>
            Đánh giá lại toàn bộ pipeline phân loại ticket IT và định hướng
            phát triển tiếp theo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Mục tiêu</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Xây dựng pipeline chuẩn cho phân loại ticket IT.</li>
              <li>Phân tích rõ phân phối nhãn & mức độ mất cân bằng.</li>
              <li>
                So sánh nhiều mô hình / đặc trưng để chọn baseline mạnh cho
                các bài toán tiếp theo.
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Kết quả chính</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Dataset gồm <b>47,837</b> ticket, <b>8</b> nhóm chủ đề.
              </li>
              <li>
                <b>Hardware</b> &amp; <b>HR Support</b> là hai lớp chiếm tỉ lệ
                lớn nhất (&gt; 50% tổng dataset).
              </li>
              <li>
                Best model: <b>Logistic Regression + BoW</b>, Accuracy ≈{" "}
                {(BEST_MODEL_ACCURACY * 100).toFixed(1)}%.
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Bài học & hướng phát triển
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Mất cân bằng lớp ảnh hưởng đáng kể tới nhóm{" "}
                <b>Administrative rights</b> → cần thử class weighting /
                oversampling.
              </li>
              <li>
                Feature sparse (BoW, TF–IDF) vẫn rất hiệu quả cho ticket ngắn;
                GloVe chưa vượt được baseline.
              </li>
              <li>
                Bước tiếp theo: thử fine-tune transformer (BERT, RoBERTa…) và
                so sánh với baseline Logistic Regression + BoW.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

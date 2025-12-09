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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  Database,
  Layers,
  ImageIcon,
  BarChart3,
  Sparkles,
  TrendingUp,
  Target,
  Cpu,
  Award,
  Activity,
} from "lucide-react";

// Dataset distribution - 15 classes, training only
const actionClasses = [
  { action: "calling", count: 840 },
  { action: "clapping", count: 840 },
  { action: "cycling", count: 840 },
  { action: "dancing", count: 840 },
  { action: "drinking", count: 840 },
  { action: "eating", count: 840 },
  { action: "fighting", count: 840 },
  { action: "hugging", count: 840 },
  { action: "laughing", count: 840 },
  { action: "listening_to_music", count: 840 },
  { action: "running", count: 840 },
  { action: "sitting", count: 840 },
  { action: "sleeping", count: 840 },
  { action: "texting", count: 840 },
  { action: "using_laptop", count: 840 },
];

// Classification report data for best model
const classificationReport = [
  { class: "calling", precision: 0.66, recall: 0.68, f1: 0.67 },
  { class: "clapping", precision: 0.75, recall: 0.76, f1: 0.76 },
  { class: "cycling", precision: 1.0, recall: 0.98, f1: 0.99 },
  { class: "dancing", precision: 0.76, recall: 0.81, f1: 0.79 },
  { class: "drinking", precision: 0.74, recall: 0.71, f1: 0.73 },
  { class: "eating", precision: 0.88, recall: 0.94, f1: 0.91 },
  { class: "fighting", precision: 0.77, recall: 0.87, f1: 0.82 },
  { class: "hugging", precision: 0.76, recall: 0.81, f1: 0.79 },
  { class: "laughing", precision: 0.76, recall: 0.73, f1: 0.74 },
  { class: "listening_music", precision: 0.61, recall: 0.55, f1: 0.58 },
  { class: "running", precision: 0.89, recall: 0.92, f1: 0.9 },
  { class: "sitting", precision: 0.66, recall: 0.63, f1: 0.65 },
  { class: "sleeping", precision: 0.8, recall: 0.86, f1: 0.83 },
  { class: "texting", precision: 0.74, recall: 0.62, f1: 0.68 },
  { class: "using_laptop", precision: 0.81, recall: 0.79, f1: 0.8 },
];

// Model comparison data - 4 classifiers x 3 backbones (from reference image)
const modelComparisonGrouped = [
  { classifier: "Random Forest", VGG16: 60.0, ResNet50: 65.2, EfficientNetB0: 68.8 },
  { classifier: "Logistic Regression", VGG16: 68.4, ResNet50: 72.9, EfficientNetB0: 74.0 },
  { classifier: "Linear SVC", VGG16: 66.1, ResNet50: 74.3, EfficientNetB0: 75.1 },
  { classifier: "SVC (RBF)", VGG16: 70.8, ResNet50: 74.6, EfficientNetB0: 77.6 },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--ai-glow))",
  "hsl(var(--muted-foreground))",
];

const TOTAL_TRAIN = 12600;
const TOTAL_TEST = 5400;
const NUM_CLASSES = 15;

export const Assignment3Presentation: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--card))] via-[hsl(var(--background))] to-[hsl(var(--card))] border border-primary/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/40 rounded-full px-4 py-2 backdrop-blur-sm">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Assignment 3 · Human Action Recognition
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nhận dạng hành động người từ ảnh với Deep Learning Features
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Trích xuất đặc trưng từ các mô hình CNN pre-trained (VGG16, ResNet50, 
            EfficientNetB0) kết hợp với các thuật toán phân loại truyền thống để 
            nhận dạng 15 loại hành động người.
          </p>
        </div>
      </div>

      {/* 3 card thống kê */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tổng quan dữ liệu */}
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Tổng quan Dataset</CardTitle>
              <CardDescription>Human Action Recognition</CardDescription>
            </div>
            <Database className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Training set</span>
              <span className="text-2xl font-bold text-primary">
                {TOTAL_TRAIN.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Test set</span>
              <span className="text-xl font-semibold">
                {TOTAL_TEST.toLocaleString("en-US")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tổng cộng 18,000 ảnh được phân bổ đều cho {NUM_CLASSES} lớp hành động,
              mỗi lớp có 840 ảnh train và 360 ảnh test.
            </p>
          </CardContent>
        </Card>

        {/* Số lớp hành động */}
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Phân bố lớp</CardTitle>
              <CardDescription>Cân bằng hoàn hảo</CardDescription>
            </div>
            <Layers className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Số lớp hành động</span>
              <span className="text-2xl font-bold text-primary">{NUM_CLASSES}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Mẫu/lớp (train)</span>
              <span className="text-xl font-semibold">840</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dataset được thiết kế cân bằng hoàn hảo, không cần xử lý 
              imbalanced class như các bài toán phân loại thông thường.
            </p>
          </CardContent>
        </Card>

        {/* Feature Extraction */}
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Feature Extraction</CardTitle>
              <CardDescription>Pre-trained CNN Models</CardDescription>
            </div>
            <Cpu className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">VGG16</span>
                <span className="font-medium">4,096-d vector</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ResNet50</span>
                <span className="font-medium">2,048-d vector</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">EfficientNetB0</span>
                <span className="font-medium">1,280-d vector</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sử dụng output từ lớp cuối cùng trước fully-connected layer làm 
              feature vector cho các classifier truyền thống.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ phân phối */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Phân phối số lượng ảnh theo lớp</CardTitle>
            <CardDescription>
              Tất cả 15 lớp hành động đều có số lượng mẫu bằng nhau
            </CardDescription>
          </div>
          <ImageIcon className="w-6 h-6 text-primary" />
        </CardHeader>
        <CardContent className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={actionClasses}
              margin={{ top: 16, right: 24, bottom: 60, left: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="action"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => value.toLocaleString("en-US")}
                domain={[0, 900]}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("en-US")} ảnh`, "Training"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar 
                dataKey="count" 
                name="Training" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Workflow 5 bước */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            Quy trình thực hiện
          </CardTitle>
          <CardDescription>
            Pipeline xử lý từ EDA đến đánh giá mô hình
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "EDA", desc: "Khám phá & phân tích dữ liệu ảnh" },
              { step: 2, title: "Tiền xử lý", desc: "Resize, normalize, augmentation" },
              { step: 3, title: "Feature Extraction", desc: "CNN pre-trained models" },
              { step: 4, title: "Training", desc: "SVC, Random Forest, KNN" },
              { step: 5, title: "Evaluation", desc: "Accuracy, F1-score" },
            ].map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center p-4 rounded-xl border border-border/60 bg-card/80 hover:border-primary/40 transition-all"
              >
                <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center mb-3">
                  <span className="text-primary font-bold">{item.step}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tiền xử lý & Trích xuất đặc trưng */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wide">
              <span className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                1
              </span>
              Preprocessing
            </div>
            <div className="flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">Tiền xử lý ảnh</CardTitle>
            </div>
            <CardDescription>
              Chuẩn hóa dữ liệu ảnh đầu vào cho CNN
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Resize ảnh về kích thước phù hợp với từng model (224×224 cho VGG16/ResNet50, 224×224 cho EfficientNetB0)</li>
              <li>Normalize pixel values theo chuẩn ImageNet</li>
              <li>Không áp dụng data augmentation vì dataset đã cân bằng</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wide">
              <span className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                2
              </span>
              Feature Extraction
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">Trích xuất đặc trưng</CardTitle>
            </div>
            <CardDescription>
              Sử dụng pre-trained CNN làm feature extractor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Load pre-trained weights từ ImageNet</li>
              <li>Loại bỏ fully-connected layers cuối cùng</li>
              <li>Output feature vectors được lưu dưới dạng .npy files</li>
              <li>Kết hợp với StandardScaler trước khi đưa vào classifier</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* So sánh mô hình - grouped bar chart */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl">So sánh độ chính xác (Accuracy) giữa các mô hình và backbone</CardTitle>
            <CardDescription>
              Kết hợp các CNN feature extractor với các classifier khác nhau
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary">
              Best: SVC (RBF) + EfficientNetB0 (77.6%)
            </span>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={modelComparisonGrouped}
              margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="classifier"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                domain={[50, 85]}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar 
                dataKey="VGG16" 
                name="VGG16" 
                fill="#4169E1" 
                radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 9, formatter: (v: number) => `${v}%` }}
              />
              <Bar 
                dataKey="ResNet50" 
                name="ResNet50" 
                fill="#DAA520" 
                radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 9, formatter: (v: number) => `${v}%` }}
              />
              <Bar 
                dataKey="EfficientNetB0" 
                name="EfficientNetB0" 
                fill="#228B22" 
                radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 9, formatter: (v: number) => `${v}%` }}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Nhận xét và đánh giá */}
      <Card className="bg-card/60 border-border/60">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            Nhận xét và đánh giá
          </CardTitle>
          <CardDescription>
            Phân tích chi tiết kết quả mô hình tốt nhất: SVC (RBF) + EfficientNetB0
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nhận xét text */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-primary/40 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Overall Accuracy: 78%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Mô hình đạt độ chính xác tổng thể 78% trên tập test với 1,260 mẫu.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-card/80 border border-border/40">
                <span className="font-semibold text-foreground">Lớp tốt nhất:</span>{" "}
                <span className="text-primary font-medium">cycling</span> đạt F1-score 0.99, 
                cho thấy đặc trưng hành động đạp xe rất dễ phân biệt.
              </div>
              <div className="p-3 rounded-lg bg-card/80 border border-border/40">
                <span className="font-semibold text-foreground">Lớp khó nhất:</span>{" "}
                <span className="text-primary font-medium">listening_music</span> chỉ đạt F1-score 0.58, 
                có thể do hành động này tương tự với texting hoặc calling.
              </div>
              <div className="p-3 rounded-lg bg-card/80 border border-border/40">
                <span className="font-semibold text-foreground">Nhóm lớp tốt:</span>{" "}
                eating (0.91), running (0.90), sleeping (0.83), fighting (0.82) - 
                các hành động có chuyển động hoặc tư thế đặc trưng rõ ràng.
              </div>
            </div>
          </div>

          {/* Detailed metrics radar chart */}
          <Card className="bg-card/80 border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chi tiết Precision / Recall / F1-Score theo lớp</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={classificationReport}
                  margin={{ top: 16, right: 24, bottom: 60, left: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="class"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={9}
                    interval={0}
                    height={60}
                  />
                  <YAxis
                    domain={[0, 1]}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value.toFixed(2),
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="precision" name="Precision" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recall" name="Recall" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1" name="F1-Score" fill="hsl(var(--ai-glow))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

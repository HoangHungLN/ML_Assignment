import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Layers, Award, Smartphone, Database, Target } from "lucide-react";

// Data for PCA Cumulative Explained Variance
const pcaData = [
  { components: 1, variance: 0.18 },
  { components: 2, variance: 0.31 },
  { components: 3, variance: 0.41 },
  { components: 4, variance: 0.49 },
  { components: 5, variance: 0.56 },
  { components: 6, variance: 0.62 },
  { components: 7, variance: 0.67 },
  { components: 8, variance: 0.72 },
  { components: 9, variance: 0.76 },
  { components: 10, variance: 0.80 },
  { components: 11, variance: 0.83 },
  { components: 12, variance: 0.86 },
  { components: 13, variance: 0.88 },
  { components: 14, variance: 0.90 },
  { components: 15, variance: 0.92 },
  { components: 16, variance: 0.93 },
  { components: 17, variance: 0.95 },
  { components: 18, variance: 0.96 },
  { components: 19, variance: 0.97 },
  { components: 20, variance: 0.98 },
];

// Data for Model Performance Comparison
const modelData = [
  { model: "Logistic Regression", accuracy: 86.2 },
  { model: "SVC", accuracy: 87.5 },
  { model: "Random Forest", accuracy: 87.7 },
];

const COLORS = ["hsl(var(--muted-foreground))", "hsl(var(--accent))", "hsl(var(--ai-glow))"];

export const MLPresentation = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--code-bg))] to-[hsl(var(--card))] border border-primary/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">Assignment 1</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Phân tích & Dự đoán Phân khúc Giá Điện thoại
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tối ưu hóa Pipeline học máy dựa trên thông số kỹ thuật phần cứng
          </p>
          <div className="inline-flex items-center gap-4 bg-primary/20 backdrop-blur-sm border border-primary/50 rounded-xl px-6 py-4">
            <Award className="w-8 h-8 text-primary" />
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Best Model</div>
              <div className="text-2xl font-bold text-primary">Random Forest (87.7%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Overview & Problem Definition */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Dataset Overview & Problem Definition
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Dataset Info */}
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Dữ liệu gốc</CardTitle>
              <CardDescription className="text-muted-foreground">Mobile Phone Specifications Dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
                  <span className="text-muted-foreground">Số mẫu (Samples)</span>
                  <span className="text-2xl font-bold text-primary">11,786</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
                  <span className="text-muted-foreground">Số thuộc tính (Features)</span>
                  <span className="text-2xl font-bold text-primary">14</span>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Bao gồm các thông số kỹ thuật phần cứng: RAM, Battery, Screen Resolution, Camera Pixels, Internal Memory, Weight, và các thuộc tính khác.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Problem Definition */}
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-2xl text-foreground">Định nghĩa bài toán</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Classification vs Regression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Loại bài toán</div>
                  <div className="text-xl font-bold text-primary">Multi-class Classification</div>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Mục tiêu là <span className="text-primary font-semibold">Phân loại Phân khúc Giá</span> (Classification), không phải dự đoán giá trị liên tục (Regression). Điều này giúp mô hình tập trung vào việc nhận diện các nhóm giá rời rạc thay vì ước lượng số cụ thể.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Variable Transformation */}
        <Card className="mt-6 bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Chuyển đổi biến mục tiêu (Target Transformation)</CardTitle>
            <CardDescription className="text-muted-foreground">
              Từ biến liên tục <code className="text-primary">price</code> sang biến phân loại <code className="text-primary">price_category</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-[hsl(var(--code-bg))] border border-green-500/30 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-1">Low</div>
                <div className="text-xs text-muted-foreground">≤ Q1 (25th percentile)</div>
              </div>
              <div className="text-center p-4 bg-[hsl(var(--code-bg))] border border-yellow-500/30 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400 mb-1">Medium</div>
                <div className="text-xs text-muted-foreground">Q1 - Q3 (25th - 75th)</div>
              </div>
              <div className="text-center p-4 bg-[hsl(var(--code-bg))] border border-red-500/30 rounded-lg">
                <div className="text-3xl font-bold text-red-400 mb-1">High</div>
                <div className="text-xs text-muted-foreground">≥ Q3 (75th percentile)</div>
              </div>
            </div>
            
            <div className="p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
              <div className="text-sm text-primary font-semibold mb-2">Tại sao sử dụng Quantile Thresholds?</div>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Chiến lược phân chia theo <span className="text-primary font-semibold">Ngưỡng Tứ phân vị (Quantile Thresholds)</span> giúp mô hình <span className="text-[hsl(var(--ai-glow))] font-semibold">robust</span> hơn trước sự phân bố lệch (<span className="text-primary">Skewness</span>) và các giá trị ngoại lai (<span className="text-primary">Outliers</span>) của dữ liệu giá gốc. Khác với Fixed Thresholds, Quantile đảm bảo các lớp có phân bố cân bằng hơn, giảm thiểu rủi ro Class Imbalance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Xử Lý Dữ Liệu & Giảm Chiều
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 - KNN Imputer */}
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Xử lý dữ liệu khuyết (Imputation)</CardTitle>
              <CardDescription className="text-muted-foreground">KNN Imputer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Thay vì dùng trung bình (Mean) làm sai lệch cấu trúc dữ liệu, nhóm sử dụng <span className="text-primary font-semibold">KNN Imputer</span>. Thuật toán tìm kiếm các thiết bị có cấu hình tương tự (Similar Specs) để điền giá trị thiếu, đảm bảo tính nhất quán cho từng phân khúc.
              </p>
              <div className="mt-4 p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
                <code className="text-sm font-mono text-primary">
                  KNNImputer(n_neighbors=5, weights='distance')
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 - PCA Strategy */}
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Trích xuất đặc trưng & Giảm chiều dữ liệu</CardTitle>
              <CardDescription className="text-muted-foreground">PCA Strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Nén các thông số phần cứng chi tiết (RAM, Battery, Pixels...) xuống còn <span className="text-primary font-semibold">12 Principal Components</span>. Tại ngưỡng này, PCA giữ lại tối đa lượng thông tin quan trọng trong khi loại bỏ nhiễu và hiện tượng đa cộng tuyến.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pcaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="components" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Số Components', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Phương Sai Tích Lũy', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="variance" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        if (payload.components === 12) {
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r={6} fill="hsl(var(--ai-glow))" stroke="hsl(var(--background))" strokeWidth={2} />
                              <text x={cx} y={cy - 15} textAnchor="middle" fill="hsl(var(--ai-glow))" fontSize="12" fontWeight="bold">
                                Elbow
                              </text>
                            </g>
                          );
                        }
                        return <circle cx={cx} cy={cy} r={3} fill="hsl(var(--primary))" />;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benchmark Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Đánh giá hiệu năng mô hình (Model Benchmarking)
          </h2>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Benchmark Accuracy</CardTitle>
            <CardDescription className="text-muted-foreground">
              Đánh giá các Classifier trên Dataset đã qua tiền xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="model" 
                    stroke="hsl(var(--muted-foreground))"
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    domain={[80, 90]}
                    label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Accuracy']}
                  />
                  <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                    {modelData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Logistic Regression</div>
                <div className="text-2xl font-bold text-foreground mb-2">86.2%</div>
                <div className="text-xs text-muted-foreground">Hiệu năng thấp do hạn chế với dữ liệu Non-linear</div>
              </div>
              <div className="p-4 bg-[hsl(var(--code-bg))] border border-accent/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">SVC</div>
                <div className="text-2xl font-bold text-foreground mb-2">87.5%</div>
                <div className="text-xs text-muted-foreground">Ổn định nhưng chi phí tính toán cao</div>
              </div>
              <div className="p-4 bg-[hsl(var(--code-bg))] border border-primary/50 rounded-lg ring-2 ring-[hsl(var(--ai-glow))]/50">
                <div className="text-sm text-[hsl(var(--ai-glow))] mb-1 font-semibold">Random Forest ⭐</div>
                <div className="text-2xl font-bold text-[hsl(var(--ai-glow))] mb-2">87.7%</div>
                <div className="text-xs text-muted-foreground">Model tối ưu nhất. Kiến trúc Ensemble xử lý tốt quan hệ phức tạp giữa cấu hình và giá bán</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Verdict */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <h2 className="text-3xl font-bold text-foreground">Kết Luận</h2>
        </div>
        
        <div className="bg-[hsl(var(--code-bg))] border border-primary/30 rounded-xl p-6 font-mono text-sm">
          <div className="text-primary mb-2">$ final-configuration --spec-sheet</div>
          <div className="text-foreground/80 space-y-1">
            <div><span className="text-accent">CẤU HÌNH TỐI ƯU:</span></div>
            <div className="pl-4">
              <div><span className="text-muted-foreground">Imputer:</span> <span className="text-primary">KNN (k=5)</span></div>
              <div><span className="text-muted-foreground">Scaler:</span> <span className="text-primary">StandardScaler</span></div>
              <div><span className="text-muted-foreground">Giảm chiều:</span> <span className="text-primary">PCA (n=12)</span></div>
              <div><span className="text-muted-foreground">Classifier:</span> <span className="text-primary">Random Forest (Ensemble)</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <span className="text-[hsl(var(--ai-glow))]">Kết luận:</span> <span className="text-foreground/90">Đây là cấu hình mang lại sự cân bằng tốt nhất giữa <span className="text-[hsl(var(--ai-glow))] font-bold">Accuracy</span> và độ ổn định trên tập kiểm thử ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

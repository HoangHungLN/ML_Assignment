import { Smartphone, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// ================== PHẦN 1: TỔNG QUAN & THỐNG KÊ ==================

// Phân phối nhãn price_category (từ notebook)
const distributionData = [
  { name: "low", value: 2956, fill: "#10b981" }, // 25.08%
  { name: "medium", value: 5896, fill: "#f59e0b" }, // 50.03%
  { name: "high", value: 2934, fill: "#ef4444" }, // 24.89%
];

// Missing values – đúng theo bảng missing_data
const missingData = [
  { feature: "other", count: 11785, rate: "99.99%" },
  { feature: "fm_radio", count: 10229, rate: "86.79%" },
  { feature: "os", count: 2963, rate: "25.14%" },
  { feature: "cpu", count: 2157, rate: "18.30%" },
  { feature: "expandable", count: 1770, rate: "15.02%" },
  { feature: "ram", count: 1261, rate: "10.70%" },
  { feature: "battery", count: 138, rate: "1.17%" },
  { feature: "user_rating", count: 20, rate: "0.17%" },
  { feature: "camera", count: 20, rate: "0.17%" },
  { feature: "display", count: 16, rate: "0.14%" },
  { feature: "connectivity", count: 11, rate: "0.09%" },
  { feature: "spec_score", count: 8, rate: "0.07%" },
  { feature: "price", count: 0, rate: "0.00%" },
  { feature: "name", count: 0, rate: "0.00%" },
];

// Thống kê mô tả cho các biến số (describe numeric)
const numericalStats = [
  {
    feature: "price",
    mean: "17,187.61",
    std: "23,707.84",
    min: "178.00",
    max: "480,000.00",
    insight:
      "Phân phối lệch phải mạnh, độ lệch chuẩn rất lớn → tồn tại nhiều ngoại lai giá rất cao so với trung vị 9,490.",
  },
  {
    feature: "spec_score",
    mean: "51.94",
    std: "26.66",
    min: "3.00",
    max: "98.00",
    insight:
      "Điểm cấu hình trải rộng trên thang 0–100, trung vị 58 lớn hơn trung bình → phân phối hơi lệch trái.",
  },
  {
    feature: "user_rating",
    mean: "4.18",
    std: "0.48",
    min: "0.50",
    max: "5.00",
    insight:
      "Đánh giá người dùng tập trung quanh 4–4.5 điểm, độ lệch chuẩn nhỏ → dữ liệu lệch trái, thiên về đánh giá tích cực.",
  },
];

// Thống kê mô tả cho các biến phân loại (describe categorical)
const categoricalStats = [
  {
    feature: "name",
    count: "11,786",
    unique: "11,468",
    top: "Realme 9i 5G (6GB RAM + 128GB)",
    freq: "3",
  },
  {
    feature: "connectivity",
    count: "11,775",
    unique: "68",
    top: "Dual Sim, 3G, 4G, VoLTE, Wi-Fi",
    freq: "2,554",
  },
  {
    feature: "cpu",
    count: "9,629",
    unique: "1,461",
    top: "Quad Core, 1.3GHz Processor",
    freq: "399",
  },
  {
    feature: "ram",
    count: "10,525",
    unique: "443",
    top: "8GB RAM, 128GB inbuilt",
    freq: "1,143",
  },
  {
    feature: "battery",
    count: "11,648",
    unique: "955",
    top: "1000mAh Battery",
    freq: "695",
  },
  {
    feature: "display",
    count: "11,770",
    unique: "1,751",
    top: "2.4 inches, 240x320px Display",
    freq: "681",
  },
  {
    feature: "camera",
    count: "11,766",
    unique: "1,142",
    top: "0.3MP Rear Camera",
    freq: "1,227",
  },
  {
    feature: "expandable",
    count: "10,016",
    unique: "31",
    top: "Memory Card Supported, upto 32GB",
    freq: "2,261",
  },
  {
    feature: "os",
    count: "8,823",
    unique: "184",
    top: "Android v11",
    freq: "818",
  },
  {
    feature: "fm_radio",
    count: "1,557",
    unique: "1",
    top: "No FM Radio",
    freq: "1,557",
  },
  {
    feature: "other",
    count: "1",
    unique: "1",
    top: "Wi-Fi",
    freq: "1",
  },
  {
    feature: "price_category",
    count: "11,786",
    unique: "3",
    top: "medium",
    freq: "5,896",
  },
];

// ================== PHẦN 2: FEATURE EXTRACTION & CORR ==================

// Ví dụ minh hoạ việc trích xuất RAM/ROM từ chuỗi văn bản
const extractedSamples = [
  {
    id: 1,
    raw: "8GB RAM, 128GB inbuilt",
    extracted_ram: "8",
    extracted_rom: "128",
    label: "medium",
  },
  {
    id: 2,
    raw: "6GB RAM, 64GB inbuilt",
    extracted_ram: "6",
    extracted_rom: "64",
    label: "low",
  },
  {
    id: 3,
    raw: "4GB RAM, 64GB inbuilt",
    extracted_ram: "4",
    extracted_rom: "64",
    label: "low",
  },
  {
    id: 4,
    raw: "12GB RAM, 256GB inbuilt",
    extracted_ram: "12",
    extracted_rom: "256",
    label: "high",
  },
  {
    id: 5,
    raw: "16GB RAM, 512GB inbuilt",
    extracted_ram: "16",
    extracted_rom: "512",
    label: "high",
  },
];

// ================== PHẦN 3: MODEL BENCHMARK ==================

// Số liệu lấy trực tiếp từ bảng kết quả trong notebook
// (tất cả là macro-average, đã nhân 100 và làm tròn 2 chữ số)
const benchmarkChartData = [
  {
    model: "Logistic Regression",
    Accuracy: 86.22,
    MacroF1: 86.22,
  },
  {
    model: "SVC",
    Accuracy: 87.28,
    MacroF1: 87.21,
  },
  {
    model: "Random Forest",
    Accuracy: 87.49,
    MacroF1: 87.56,
  },
];

const modelSummary = [
  {
    model: "Logistic Regression",
    bestConfig:
      "KNN Imputer (k = 5), StandardScaler, PCA giữ lại 12 thành phần chính",
    accuracy: "86.22%",
    precision: "86.46%",
    recall: "86.01%",
    f1: "86.22%",
    note: "Hiệu quả, dễ diễn giải, nhưng kém hơn SVC và Random Forest một chút.",
  },
  {
    model: "SVC",
    bestConfig:
      "KNN Imputer (k = 5), StandardScaler, PCA = 12 (kernel mặc định RBF)",
    accuracy: "87.28%",
    precision: "88.08%",
    recall: "86.50%",
    f1: "87.21%",
    note: "Độ chính xác cao, ổn định, nhưng thời gian huấn luyện suy luận chậm hơn LR.",
  },
  {
    model: "Random Forest",
    bestConfig:
      "KNN Imputer (k = 5), StandardScaler, PCA = 12 (số cây mặc định của sklearn)",
    accuracy: "87.49%",
    precision: "87.49%",
    recall: "87.63%",
    f1: "87.56%",
    note: "Cho Accuracy và F1-score cao nhất, cân bằng Precision/Recall → lựa chọn cuối cùng.",
  },
];

export const Assignment1Part1 = () => {
  const totalSamples = distributionData.reduce(
    (sum, d) => sum + d.value,
    0
  );

  return (
    <div className="space-y-16 animate-fade-in text-justify">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--code-bg))] to-[hsl(var(--card))] border border-primary/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Assignment 1
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Phân tích &amp; Dự đoán Phân khúc Giá Điện thoại
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tối ưu hóa Pipeline học máy dựa trên thông số kỹ thuật phần cứng
          </p>
          <div className="inline-flex items-center gap-4 bg-primary/20 backdrop-blur-sm border border-primary/50 rounded-xl px-6 py-4">
            <Award className="w-8 h-8 text-primary" />
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Best Model</div>
              <div className="text-2xl font-bold text-primary">
                Random Forest (≈ 87.49%)
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================== I. DATASET OVERVIEW ================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          I. Dataset Overview
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground">
                Sample Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                11,786
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Số dòng dữ liệu điện thoại sau bước làm sạch ban đầu.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground">
                Feature Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                14
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Bao gồm giá, điểm cấu hình, đánh giá người dùng và
                các thông số kỹ thuật như RAM, ROM, màn hình, camera, v.v.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground">
                Target Variable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-foreground">
                price_category
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Giá được chia thành 3 nhóm {`"low" / "medium" / "high"`}
                dựa trên các quantile 25% và 75%.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Phân phối nhãn */}
        <div className="grid md:grid-cols-2 gap-8 items-center pt-4">
          <Card className="h-full bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle>Target Distribution</CardTitle>
              <CardDescription>
                Phân phối 3 lớp giá (low / medium / high)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} – ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {distributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke="rgba(0,0,0,0.2)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      color: "#f3f4f6",
                    }}
                    formatter={(value: any, name: any) => [
                      value,
                      name as string,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-sm">
              <h3 className="text-base font-semibold text-yellow-500 mb-2 uppercase tracking-wide">
                Nhận xét
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sau khi chia price theo quantile (25% và 75%), ta thu
                được:
              </p>
              <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>
                  <strong>Low:</strong> 2,956 mẫu (
                  {((2956 / totalSamples) * 100).toFixed(2)}%).
                </li>
                <li>
                  <strong>Medium:</strong> 5,896 mẫu (
                  {((5896 / totalSamples) * 100).toFixed(2)}%).
                </li>
                <li>
                  <strong>High:</strong> 2,934 mẫu (
                  {((2934 / totalSamples) * 100).toFixed(2)}%).
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-yellow-500/20 text-sm text-foreground/90">
                Tập dữ liệu mang tính{" "}
                <strong>mất cân bằng vừa phải</strong>: lớp
                <strong> medium</strong> chiếm khoảng một nửa tổng số
                mẫu, hai lớp còn lại mỗi lớp chiếm ~25%. Khi đánh giá
                mô hình phân loại, cần ưu tiên các chỉ số cân bằng như{" "}
                <strong>Macro F1-score</strong>, tránh chỉ dựa vào
                Accuracy.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== II. DATA QUALITY & STATISTICS ================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          II. Data Quality & Statistics
        </h2>

        {/* Missing values */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            1. Missing Values Analysis
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/30 border-border/50">
              <CardContent className="pt-6">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Feature</th>
                      <th className="px-4 py-2 text-right">
                        Missing Count
                      </th>
                      <th className="px-4 py-2 text-right">
                        Missing Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {missingData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/50"
                      >
                        <td className="px-4 py-2 font-mono text-primary">
                          {item.feature}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.count}
                        </td>
                        <td className="px-4 py-2 text-right text-red-400">
                          {item.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/10 h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Handling Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 text-justify mb-3 leading-relaxed">
                    Hai cột <code>other</code> và <code>fm_radio</code>{" "}
                    gần như trống hoàn toàn, không mang nhiều thông
                    tin phân biệt nên có thể được loại bỏ khỏi mô
                    hình. Các cột như <code>os</code>, <code>cpu</code>,{" "}
                    <code>expandable</code>, <code>ram</code> có tỷ lệ
                    thiếu từ 10–25% nên cần xử lý cẩn thận.
                  </p>
                  <p className="text-sm text-foreground/80 text-justify mb-3 leading-relaxed">
                    Nhóm sử dụng <strong>KNN Imputer</strong> với{" "}
                    <code>n_neighbors = 5</code> thay cho Simple
                    Imputer. Cách này tận dụng mối quan hệ giữa các
                    đặc trưng (RAM, ROM, camera, màn hình,...) để suy
                    đoán giá trị còn thiếu, giúp mô hình sau đó đạt
                    Accuracy cao hơn.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Thống kê mô tả biến số */}
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold text-primary">
            2. Descriptive Statistics (Numeric Features)
          </h3>
          <Card className="bg-card/30 border-border/50">
            <CardContent className="pt-6">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Feature</th>
                      <th className="px-4 py-3 text-right">Mean</th>
                      <th className="px-4 py-3 text-right">
                        Std Dev
                      </th>
                      <th className="px-4 py-3 text-right">Range</th>
                      <th className="px-4 py-3">Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {numericalStats.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-primary font-mono">
                          {item.feature}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.mean}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.std}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {item.min} – {item.max}
                        </td>
                        <td className="px-4 py-3 text-xs italic text-muted-foreground">
                          {item.insight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border border-blue-500/20 rounded-sm mt-4">
            <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                • <strong>Price:</strong> phân phối lệch phải, xuất
                hiện nhiều điện thoại flagship giá cao kéo trung bình
                lên ~17k trong khi trung vị chỉ 9,490 → phù hợp hơn
                khi biến đổi log hoặc gom nhóm thành{" "}
                <code>price_category</code>.
              </p>
              <p>
                • <strong>Spec Score:</strong> trải trên khoảng rộng
                3–98, trung vị 58 &gt; trung bình 51.94 nên hơi lệch
                trái nhưng vẫn bao phủ tốt dải cấu hình thấp–cao.
              </p>
              <p>
                • <strong>User Rating:</strong> lệch trái mạnh, phần
                lớn tập trung quanh 4–5 sao, thể hiện thiên lệch đánh
                giá tích cực – thông tin phân biệt giữa các mẫu khá
                tốt nhưng không phải yếu tố quyết định giá.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Thống kê mô tả biến phân loại */}
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold text-primary">
            3. Categorical Features Distribution
          </h3>
          <Card className="bg-card/30 border-border/50">
            <CardContent className="pt-6">
              <div className="relative overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Feature</th>
                      <th className="px-4 py-3 text-right">
                        Count
                      </th>
                      <th className="px-4 py-3 text-right">
                        Unique
                      </th>
                      <th className="px-4 py-3 text-right">
                        Top Value (Freq)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoricalStats.map((item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="px-4 py-3 font-medium text-primary font-mono">
                          {item.feature}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          {item.count}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          {item.unique}
                        </TableCell>
                        <TableCell
                          className="px-4 py-3 text-right text-foreground max-w-[220px] truncate"
                          title={item.top}
                        >
                          {item.top}
                          <span className="text-xs text-muted-foreground block">
                            {item.freq}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-green-500/5 rounded-sm border border-green-500/10 text-sm text-foreground/80 text-justify space-y-2">
                <p>
                  • <code>name</code> có tới 11,468 giá trị duy nhất
                  trên 11,786 dòng → gần như đóng vai trò ID cho từng
                  model, không dùng làm feature huấn luyện.
                </p>
                <p>
                  • Các cột như <code>connectivity</code>,{" "}
                  <code>ram</code>, <code>battery</code>,{" "}
                  <code>display</code>, <code>camera</code>,{" "}
                  <code>expandable</code>, <code>os</code> là những
                  chuỗi mô tả dài, nhiều dạng khác nhau → cần tách
                  thành các thuộc tính số (RAM, ROM, dung lượng pin,
                  kích thước màn hình, độ phân giải, số camera,...) và
                  one-hot encode phần còn lại.
                </p>
                <p>
                  • <code>fm_radio</code> và <code>other</code> gần
                  như không đa dạng về giá trị, đồng thời thiếu dữ
                  liệu rất nhiều → ít đóng góp cho bài toán nên có
                  thể loại bỏ khỏi pipeline.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================== III. FEATURE ENGINEERING & CORRELATION ================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          III. Feature Engineering & Correlation
        </h2>

        {/* Feature extraction snapshot */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            1. Feature Extraction (Snapshot)
          </h3>
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardDescription>
                Minh hoạ việc tách RAM/ROM dạng số từ cột{" "}
                <code>ram</code> gốc dạng text (ví dụ:&nbsp;
                {"`8GB RAM, 128GB inbuilt`"}).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead className="text-muted-foreground">
                      Raw Text
                    </TableHead>
                    <TableHead className="text-primary">
                      RAM (GB)
                    </TableHead>
                    <TableHead className="text-primary">
                      ROM (GB)
                    </TableHead>
                    <TableHead className="text-right">
                      price_category
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedSamples.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">
                        {row.id}
                      </TableCell>
                      <TableCell
                        className="text-xs text-muted-foreground font-mono truncate max-w-[200px]"
                        title={row.raw}
                      >
                        {row.raw}
                      </TableCell>
                      <TableCell className="font-bold text-foreground">
                        {row.extracted_ram}
                      </TableCell>
                      <TableCell className="font-bold text-foreground">
                        {row.extracted_rom}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded text-[10px] border ${
                            row.label === "high"
                              ? "border-red-500/20 text-red-500"
                              : row.label === "medium"
                              ? "border-yellow-500/20 text-yellow-500"
                              : "border-green-500/20 text-green-500"
                          }`}
                        >
                          {row.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground text-justify">
                Các bước tiền xử lý chính gồm: tách chuỗi mô tả RAM,
                ROM, camera, màn hình thành các trường số; chuẩn hoá
                đơn vị; và mã hoá các thuộc tính phân loại còn lại
                bằng One-Hot Encoding trước khi đưa vào pipeline mô
                hình.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Correlation heatmap + nhận xét */}
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold text-primary">
            2. Correlation Matrix (Numeric Features)
          </h3>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Ảnh heatmap */}
            <Card className="bg-card/30 border-border/50">
              <CardContent className="p-6 flex justify-center items-center">
                <img
                  src="/images/CorrelationMatrixAssignment1.png"
                  alt="Correlation Matrix of numeric features (spec_score, ram_num, rom_num, price)"
                  className="w-full max-w-md rounded-md border border-border/40 object-contain shadow-sm"
                />
              </CardContent>
            </Card>

            {/* Insight bám sát nhận xét gốc */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-sm">
                <h4 className="text-sm font-bold text-blue-500 mb-2 uppercase">
                  Key Insights
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed text-justify mb-2">
                  • <strong>Nhóm tương quan rất cao (≥ 0.9):</strong>{" "}
                  <code>spec_score</code> có tương quan chặt với{" "}
                  <code>ram_num</code>, <code>rom_num</code>,{" "}
                  <code>cpu_speed</code>, <code>ppi</code>,{" "}
                  <code>screen_size</code>. Điều này hợp lý vì điểm
                  cấu hình vốn được tổng hợp từ các thành phần phần
                  cứng này → rủi ro <strong>multicollinearity</strong>{" "}
                  nếu đưa tất cả vào mô hình tuyến tính.
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed text-justify mb-2">
                  • <strong>Nhóm tương quan trung bình (0.5–0.7):</strong>{" "}
                  các đặc trưng về camera, pin, fast_charging, kích
                  thước màn hình… có tương quan vừa phải với{" "}
                  <code>spec_score</code> và <code>price</code>. Đây
                  là các yếu tố bổ sung, góp phần phân biệt cấu hình
                  nhưng không phải thành phần chính của điểm cấu hình.
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed text-justify">
                  • <strong>Nhóm tương quan yếu (&lt; 0.4):</strong>{" "}
                  <code>user_rating</code>,{" "}
                  <code>expandable_storage</code>,{" "}
                  <code>is_dual_sim</code>, <code>is_5g</code>,{" "}
                  <code>is_nfc</code> hầu hết chỉ có hệ số tương quan
                  khoảng 0.2–0.3 với các biến còn lại. Đây là các đặc
                  trưng độc lập, mang thêm thông tin “tính năng cộng
                  thêm” thay vì cấu hình lõi.
                </p>
              </div>

              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-sm">
                <span className="text-yellow-500 font-bold text-sm">
                  Conclusion:&nbsp;
                </span>
                <span className="text-sm text-muted-foreground">
                  Biến <code>price</code> có mức tương quan trung bình
                  (~0.55–0.60) với các đặc trưng phần cứng chính như{" "}
                  <code>ram_num</code>, <code>rom_num</code>,{" "}
                  <code>spec_score</code> – phù hợp với thực tế là giá
                  còn phụ thuộc thương hiệu, năm ra mắt, chính sách
                  thị trường. Trong mô hình, <code>price</code> được
                  dùng làm target (sau khi rời rạc hoá thành{" "}
                  <code>price_category</code>), còn{" "}
                  <code>spec_score</code> được cân nhắc loại khỏi tập
                  feature thô để tránh trùng thông tin với các biến
                  cấu hình chi tiết.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PCA – Dimensionality Reduction */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold text-primary">
            3. Dimensionality Reduction with PCA
          </h3>
          <Card className="bg-card/30 border-border/50">
            <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                Sau bước chuẩn hoá (StandardScaler) và mã hoá one-hot
                cho các biến phân loại, số chiều của feature space khá
                lớn và chứa nhiều cặp đặc trưng tương quan cao (đặc
                biệt là nhóm cấu hình: RAM, ROM, CPU, màn hình,{" "}
                <code>spec_score</code>). Để giảm{" "}
                <strong>multicollinearity</strong> và tăng tốc huấn
                luyện, nhóm áp dụng{" "}
                <strong>Principal Component Analysis (PCA)</strong>.
              </p>
              <p>
                Dựa trên đường tích luỹ phương sai trong notebook, nhóm
                chọn giữ lại <strong>12 principal components</strong>.
                Cấu hình này giúp nén phần lớn thông tin của tập
                feature gốc vào một không gian chiều thấp hơn, trong
                khi độ mất mát phương sai chấp nhận được cho cả ba mô
                hình (Logistic Regression, SVC, Random Forest).
              </p>
              <p>
                Các mô hình trong phần benchmark bên dưới đều được
                huấn luyện trên không gian PCA 12 chiều này, sau khi
                đã xử lý thiếu dữ liệu bằng KNN Imputer và chuẩn hoá
                toàn bộ biến số.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================== IV. MODEL BENCHMARK ================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
          IV. Model Benchmark
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Biểu đồ cột Accuracy / Macro F1 */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle>So sánh mô hình</CardTitle>
              <CardDescription>
                Accuracy và Macro F1-score (macro-average, %) của cấu
                hình tốt nhất mỗi mô hình.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={benchmarkChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="model"
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    domain={[80, 90]}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${(value as number).toFixed(2)}%`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="Accuracy"
                    name="Accuracy"
                    barSize={22}
                    fill="#38bdf8" // cyan
                  />
                  <Bar
                    dataKey="MacroF1"
                    name="Macro F1"
                    barSize={22}
                    fill="#f97316" // orange
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bảng chi tiết metrics */}
          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle>Benchmark chi tiết</CardTitle>
              <CardDescription>
                Các độ đo được trích trực tiếp từ notebook sau khi
                chạy train/test split 80/20.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">Best Config</th>
                      <th className="px-4 py-3 text-right">
                        Acc (%)
                      </th>
                      <th className="px-4 py-3 text-right">
                        Prec (%)
                      </th>
                      <th className="px-4 py-3 text-right">
                        Recall (%)
                      </th>
                      <th className="px-4 py-3 text-right">
                        F1 (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelSummary.map((m, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-primary">
                          {m.model}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {m.bestConfig}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {m.accuracy}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {m.precision}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {m.recall}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {m.f1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-sm text-sm text-foreground/80 space-y-2">
                {modelSummary.map((m) => (
                  <p key={m.model}>
                    <strong>{m.model}:</strong> {m.note}
                  </p>
                ))}
                <p className="pt-2 border-t border-emerald-500/20">
                  Tổng hợp lại, <strong>Random Forest</strong> với
                  KNN Imputer (k = 5), StandardScaler và PCA 12
                  chiều cho Accuracy ≈ <strong>87.49%</strong> và
                  Macro F1 ≈ <strong>87.56%</strong>, cao nhất trong
                  các mô hình được thử nghiệm; do đó được chọn làm
                  mô hình cuối cùng cho bài toán phân loại{" "}
                  <code>price_category</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

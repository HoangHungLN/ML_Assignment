import { Database, Calculator, Grid3X3 } from "lucide-react";
import { Card } from "./ui/card";

export const HMMParameterLearning = () => {
  const steps = [
    {
      step: 1,
      title: "Xây dựng bộ từ điển (Vocabulary & States)",
      icon: Database,
      content: (
        <>
          Hệ thống duyệt qua tập Train Data để trích xuất tập nhãn <strong>Q</strong> (Hidden States) và tập từ vựng <strong>V</strong>. 
          Để xử lý các từ hiếm (Rare words) xuất hiện ≤ 1 lần, hệ thống quy hoạch chúng về token đặc biệt <code className="bg-primary/20 px-1.5 py-0.5 rounded text-primary font-mono text-sm">&lt;UNK&gt;</code>. 
          Điều này giúp mô hình xử lý được các từ chưa gặp (Out-of-vocabulary) trong thực tế.
        </>
      ),
    },
    {
      step: 2,
      title: "Cơ chế học (Counting & Smoothing)",
      icon: Calculator,
      content: (
        <>
          Tham số được ước lượng dựa trên tần suất xuất hiện (Frequency Counting) của các cặp nhãn và cặp từ-nhãn. 
          Nhóm áp dụng kỹ thuật <strong>Add-1 Smoothing</strong> (Laplace) vào công thức tính xác suất để tránh lỗi chia cho 0 (Zero Probability) 
          đối với các trường hợp chưa xuất hiện trong tập huấn luyện.
        </>
      ),
    },
    {
      step: 3,
      title: "Ma trận trọng số (The Learned Matrices)",
      icon: Grid3X3,
      content: null,
      matrices: true,
    },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-border/50">
      {/* Section Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Phần 1: Học tham số mô hình (Parameter Learning)
        </h3>
        <p className="text-muted-foreground">
          Quá trình huấn luyện HMM theo phương pháp Supervised Learning
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <Card
            key={step.step}
            className="p-6 bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300"
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Step {step.step}
              </span>
            </div>

            {/* Step Title */}
            <h4 className="text-lg font-semibold text-foreground mb-3">
              {step.title}
            </h4>

            {/* Step Content */}
            {step.content && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.content}
              </p>
            )}

            {/* Matrices Display for Step 3 */}
            {step.matrices && (
              <div className="space-y-4">
                {/* Matrix A */}
                <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-mono font-bold">Matrix A</span>
                    <span className="text-muted-foreground text-sm">(Transition)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mô tả xác suất chuyển từ nhãn này sang nhãn khác
                  </p>
                  <code className="block mt-2 text-xs text-primary/80 font-mono">
                    P(Verb | Noun)
                  </code>
                </div>

                {/* Matrix B */}
                <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-mono font-bold">Matrix B</span>
                    <span className="text-muted-foreground text-sm">(Emission)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mô tả xác suất sinh ra từ từ một nhãn
                  </p>
                  <code className="block mt-2 text-xs text-primary/80 font-mono">
                    P('apple' | Noun)
                  </code>
                </div>

                {/* Initial π */}
                <div className="p-4 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-mono font-bold">Initial π</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Xác suất nhãn khởi đầu câu
                  </p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// src/components/MLPresentation.tsx
export const MLPresentation = () => {
  return (
    <div className="space-y-6">
      {/* Tiêu đề kết luận */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <h2 className="text-3xl font-bold text-foreground">Kết Luận</h2>
      </div>

      {/* Block cấu hình cuối cùng */}
      <div className="bg-[hsl(var(--code-bg))] border border-primary/30 rounded-xl p-6 font-mono text-sm">
        <div className="text-primary mb-2">
          $ final-configuration --spec-sheet
        </div>
        <div className="text-foreground/80 space-y-1">
          <div>
            <span className="text-accent">CẤU HÌNH TỐI ƯU:</span>
          </div>
          <div className="pl-4">
            <div>
              <span className="text-muted-foreground">Imputer:</span>{" "}
              <span className="text-primary">KNN (k=5)</span>
            </div>
            <div>
              <span className="text-muted-foreground">Scaler:</span>{" "}
              <span className="text-primary">StandardScaler</span>
            </div>
            <div>
              <span className="text-muted-foreground">Giảm chiều:</span>{" "}
              <span className="text-primary">PCA (n=12)</span>
            </div>
            <div>
              <span className="text-muted-foreground">Classifier:</span>{" "}
              <span className="text-primary">Random Forest (Ensemble)</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/30">
            <span className="text-[hsl(var(--ai-glow))]">Kết luận:</span>{" "}
            <span className="text-foreground/90">
              Đây là cấu hình mang lại sự cân bằng tốt nhất giữa{" "}
              <span className="text-[hsl(var(--ai-glow))] font-bold">
                Accuracy
              </span>{" "}
              và độ ổn định trên tập kiểm thử ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

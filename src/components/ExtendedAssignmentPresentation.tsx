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
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Beaker,
  Type,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Brain,
  GitBranch,
  Activity,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_EXT_ASSIGN_API_URL ??
  "http://localhost:8000/api/assignment3/analyze";

interface ForwardResult {
  is_grammatical: boolean;
  forward_log_prob: number;
}

interface ViterbiResult {
  tokens: string[];
  tags: string[];
  viterbi_log_prob?: number;
}

/* ---------- Ô demo Forward ---------- */

const ForwardGrammarDemo: React.FC = () => {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState<ForwardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    const trimmed = sentence.trim();
    if (!trimmed) {
      setError("Hãy nhập một câu tiếng Anh để kiểm tra.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: trimmed }),
      });

      if (!res.ok) throw new Error(`Server trả mã lỗi ${res.status}`);

      const data = await res.json();
      setResult({
        is_grammatical: data.is_grammatical,
        forward_log_prob: data.forward_log_prob,
      });
    } catch (e) {
      console.error(e);
      setError(
        "Không gọi được API HMM. Kiểm tra lại server (FastAPI) hoặc NEXT_PUBLIC_EXT_ASSIGN_API_URL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/60 border-border/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">
          Demo thuật toán Forward – kiểm tra ngữ pháp
        </CardTitle>
        <CardDescription className="text-xs">
          Dùng xác suất forward để xem câu có “hợp ngữ pháp” theo HMM hay không.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground flex items-center gap-2">
            <Type className="w-3 h-3 text-primary" />
            Câu cần kiểm tra
          </label>
          <Textarea
            rows={2}
            className="bg-background/60 border-border/70 focus-visible:ring-primary/70 text-xs"
            placeholder='Ví dụ: "I will book a meeting room for tomorrow."'
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleCheck();
              }
            }}
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Ctrl+Enter / Cmd+Enter để chạy nhanh.</span>
            <Button
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={handleCheck}
              disabled={loading}
            >
              {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Kiểm tra
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/60 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
            <AlertTriangle className="w-3 h-3 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="flex items-center justify-between rounded-2xl border px-3 py-2 bg-background/60 border-border/70">
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center ${
                  result.is_grammatical
                    ? "bg-emerald-500/15 border border-emerald-400/60"
                    : "bg-red-500/10 border border-red-400/60"
                }`}
              >
                {result.is_grammatical ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {result.is_grammatical
                    ? "Câu hợp lệ theo HMM (forward)"
                    : "Câu không hợp lệ theo HMM (forward)"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Forward log-probability:{" "}
                  <span className="font-mono">
                    {result.forward_log_prob.toFixed(3)}
                  </span>
                </p>
              </div>
            </div>
            <Badge
              variant={result.is_grammatical ? "default" : "outline"}
              className={
                result.is_grammatical
                  ? "bg-emerald-500/90 text-emerald-50 border-emerald-400 text-[10px]"
                  : "border-red-400 text-red-300 text-[10px]"
              }
            >
              {result.is_grammatical ? "Grammatical" : "Ungrammatical"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- Ô demo Viterbi ---------- */

const ViterbiTaggingDemo: React.FC = () => {
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState<ViterbiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTag = async () => {
    const trimmed = sentence.trim();
    if (!trimmed) {
      setError("Hãy nhập một câu tiếng Anh để gán nhãn.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: trimmed }),
      });

      if (!res.ok) throw new Error(`Server trả mã lỗi ${res.status}`);

      const data = await res.json();
      setResult({
        tokens: data.tokens,
        tags: data.tags,
        viterbi_log_prob: data.viterbi_log_prob,
      });
    } catch (e) {
      console.error(e);
      setError(
        "Không gọi được API HMM. Kiểm tra lại server (FastAPI) hoặc NEXT_PUBLIC_EXT_ASSIGN_API_URL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/60 border-border/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">
          Demo thuật toán Viterbi – gán nhãn từ loại
        </CardTitle>
        <CardDescription className="text-xs">
          Suy diễn chuỗi POS tối ưu cho câu bằng Viterbi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground flex items-center gap-2">
            <Type className="w-3 h-3 text-primary" />
            Câu cần gán nhãn
          </label>
          <Textarea
            rows={2}
            className="bg-background/60 border-border/70 focus-visible:ring-primary/70 text-xs"
            placeholder='Ví dụ: "The quick brown fox jumps over the lazy dog."'
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleTag();
              }
            }}
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Ctrl+Enter / Cmd+Enter để chạy nhanh.</span>
            <Button
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={handleTag}
              disabled={loading}
            >
              {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Gán nhãn
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/60 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
            <AlertTriangle className="w-3 h-3 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {typeof result.viterbi_log_prob === "number" && (
              <p className="text-[11px] text-muted-foreground">
                Viterbi log-probability:{" "}
                <span className="font-mono">
                  {result.viterbi_log_prob.toFixed(3)}
                </span>
              </p>
            )}

            <div className="overflow-x-auto rounded-2xl border border-border/70 bg-background/40">
              <table className="min-w-full text-xs">
                <thead className="bg-background/80">
                  <tr className="text-left border-b border-border/50">
                    <th className="px-3 py-2 font-medium text-muted-foreground">
                      #
                    </th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">
                      Token
                    </th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">
                      POS Tag
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.tokens.map((tok, idx) => (
                    <tr
                      key={`${tok}-${idx}`}
                      className="border-t border-border/40 hover:bg-background/60 transition-colors"
                    >
                      <td className="px-3 py-2 text-muted-foreground font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 font-mono text-foreground">
                        {tok}
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          variant="outline"
                          className="font-mono text-[11px] border-primary/60 text-primary"
                        >
                          {result.tags[idx]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Chuỗi nhãn được tìm bằng thuật toán{" "}
              <span className="font-semibold">Viterbi</span>.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- Component chính Extended Assignment ---------- */

interface ExtendedAssignmentPresentationProps {
  markdown?: string;
}

export const ExtendedAssignmentPresentation: React.FC<
  ExtendedAssignmentPresentationProps
> = ({ markdown }) => {
  const [showRawDetail, setShowRawDetail] = useState(false);
  const content =
    markdown && markdown.trim().length > 0
      ? markdown
      : "*Nội dung đang được cập nhật...*";

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--card))] via-[hsl(var(--background))] to-[hsl(var(--card))] border border-primary/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/40 rounded-full px-4 py-2 backdrop-blur-sm">
            <Beaker className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Extended Assignment · HMM for POS Tagging & Grammar Checking
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Mô hình HMM cho gán nhãn từ loại và kiểm tra ngữ pháp
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Thêm hai demo nhỏ cho thuật toán Forward và Viterbi, chạy trực tiếp
            trên mô hình bạn đã huấn luyện.
          </p>
        </div>
      </div>

      {/* 3 card tóm tắt */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/60 border-border/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Mục tiêu
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Huấn luyện HMM từ dữ liệu gán nhãn.</p>
            <p>• Cài đặt Forward & Viterbi.</p>
            <p>• Xây dựng demo kiểm tra câu mới.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-primary" />
              Cấu phần HMM
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• π: xác suất khởi tạo trạng thái.</p>
            <p>• A: xác suất chuyển giữa các trạng thái.</p>
            <p>• B: xác suất phát xạ từ trạng thái ra từ.</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Ứng dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Gán nhãn POS.</p>
            <p>• Đánh giá độ “hợp ngữ pháp”.</p>
            <p>• So sánh độ tự nhiên của câu.</p>
          </CardContent>
        </Card>
      </div>

      {/* Forward + demo */}
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)] gap-6 items-start">
        <Card className="bg-card/60 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Thuật toán Forward
            </CardTitle>
            <CardDescription>
              Tính P(observation sequence | HMM) – xác suất câu theo mô hình.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>
              Thuật toán Forward cộng xác suất của mọi đường đi có thể tạo ra
              câu, dùng để đánh giá câu có “hợp ngữ pháp” theo HMM hay không.
            </p>
          </CardContent>
        </Card>

        <ForwardGrammarDemo />
      </div>

      {/* Viterbi + demo */}
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)] gap-6 items-start">
        <Card className="bg-card/60 border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              Thuật toán Viterbi
            </CardTitle>
            <CardDescription>
              Tìm chuỗi trạng thái ẩn tối ưu – ứng với chuỗi nhãn POS tốt nhất.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>
              Với câu đầu vào, Viterbi dùng quy hoạch động để tìm đường đi qua
              các trạng thái (tags) có xác suất cao nhất.
            </p>
          </CardContent>
        </Card>

        <ViterbiTaggingDemo />
      </div>

      {/* Markdown gốc giữ nguyên */}
      <Card className="bg-card/40 border-border/40">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">
              Báo cáo chi tiết Extended Assignment (nội dung gốc)
            </CardTitle>
            <CardDescription className="text-sm">
              Toàn bộ nội dung cũ từ file báo cáo được giữ nguyên bên dưới.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawDetail((v) => !v)}
            className="shrink-0"
          >
            {showRawDetail ? "Ẩn nội dung chi tiết" : "Xem nội dung chi tiết"}
          </Button>
        </CardHeader>
        {showRawDetail && (
          <CardContent>
            <div className="markdown-content prose prose-sm md:prose-base max-w-none prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

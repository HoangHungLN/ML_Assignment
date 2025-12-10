import React, { useState } from "react";
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
import { Loader2, AlertTriangle, Type } from "lucide-react";

interface ViterbiResult {
  tokens: string[];
  tags: string[];
  viterbi_log_prob?: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_EXT_ASSIGN_API_URL ??
  "http://localhost:8000/api/assignment3/analyze";

export const ViterbiTaggingDemo: React.FC = () => {
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

      if (!res.ok) {
        throw new Error(`Server trả mã lỗi ${res.status}`);
      }

      const data = await res.json();
      const next: ViterbiResult = {
        tokens: data.tokens,
        tags: data.tags,
        viterbi_log_prob: data.viterbi_log_prob,
      };
      setResult(next);
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
          Tìm chuỗi nhãn POS có xác suất cao nhất cho câu, sử dụng thuật toán
          Viterbi trên HMM đã huấn luyện.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground flex items-center gap-2">
            <Type className="w-3 h-3 text-primary" />
            Câu cần gán nhãn từ loại
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
              <span className="font-semibold">Viterbi</span>, tương ứng với
              đường đi có xác suất cao nhất trong HMM.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

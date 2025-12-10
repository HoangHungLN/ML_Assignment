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
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Type,
} from "lucide-react";

interface ForwardResult {
  is_grammatical: boolean;
  forward_log_prob: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_EXT_ASSIGN_API_URL ??
  "http://localhost:8000/api/assignment3/analyze";

export const ForwardGrammarDemo: React.FC = () => {
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

      if (!res.ok) {
        throw new Error(`Server trả mã lỗi ${res.status}`);
      }

      const data = await res.json();
      const next: ForwardResult = {
        is_grammatical: data.is_grammatical,
        forward_log_prob: data.forward_log_prob,
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
          Demo thuật toán Forward – kiểm tra ngữ pháp
        </CardTitle>
        <CardDescription className="text-xs">
          Tính forward probability của câu theo HMM, dùng làm tiêu chí xem câu
          có “hợp ngữ pháp” theo mô hình hay không.
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
                    ? "Câu hợp lệ theo mô hình HMM (forward)"
                    : "Câu không hợp lệ theo mô hình HMM (forward)"}
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

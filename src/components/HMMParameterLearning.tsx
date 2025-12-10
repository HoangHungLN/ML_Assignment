// src/components/HMMParameterLearning.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Brain,
  Type,
  Loader2,
  AlertTriangle,
  GitBranch,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { tagSentence } from "../hmm/hmmLocal"; // đường import tuỳ folder của cậu

interface ViterbiResult {
  tokens: string[];
  tags: string[];
  viterbiLogProb?: number;
}

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
      const res = tagSentence(trimmed);
      setResult({
        tokens: res.tokens,
        tags: res.tags,
        viterbiLogProb: res.viterbiLogProb,
      });
    } catch (e) {
      console.error(e);
      setError("Có lỗi khi chạy Viterbi trên frontend.");
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
            {typeof result.viterbiLogProb === "number" && (
              <p className="text-[11px] text-muted-foreground">
                Viterbi log-probability:{" "}
                <span className="font-mono">
                  {result.viterbiLogProb.toFixed(3)}
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
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const HMMParameterLearning: React.FC = () => {
  const summaryMarkdown = `
### Học tham số HMM (Supervised)

Từ tập dữ liệu đã gán nhãn, ta ước lượng:

- \\(\\pi\\): tần suất xuất hiện tag ở vị trí đầu câu  
- \\(A\\): xác suất chuyển từ tag này sang tag khác  
- \\(B\\): xác suất một tag sinh ra một từ cụ thể  

Các tham số này được serialize sang JSON và nhúng vào frontend để thuật toán **Viterbi** sử dụng trực tiếp.
  `;

  return (
    <div className="space-y-6">
      <Card className="bg-card/60 border-border/60">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Học tham số HMM từ dữ liệu gán nhãn
          </CardTitle>
          <CardDescription className="text-xs">
            Tham số được export sang JSON, dùng lại ở phía client.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summaryMarkdown}
          </ReactMarkdown>
        </CardContent>
      </Card>

      <ViterbiTaggingDemo />
    </div>
  );
};

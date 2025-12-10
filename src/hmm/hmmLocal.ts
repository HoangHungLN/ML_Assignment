// src/hmm/hmmLocal.ts
import rawData from "./hmm_params_frontend.json";

// Kiểu dữ liệu tham số HMM
interface HMMParams {
  pi: number[];
  A: number[][];
  B: number[][];
  tag2id: Record<string, number>;
  word2id: Record<string, number>;
}

const data = rawData as HMMParams;

const pi = data.pi;
const A = data.A;
const B = data.B;
const tag2id = data.tag2id;
const word2id = data.word2id;

// Map id -> tag
const id2tag: Record<number, string> = {};
Object.entries(tag2id).forEach(([tag, id]) => {
  id2tag[id] = tag;
});

const UNK_TOKEN = "<UNK>";
const UNK_ID = word2id[UNK_TOKEN] ?? 0;

// Tokenize giống lúc train (ở notebook cậu chỉ split theo khoảng trắng)
function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

// Map token -> id
function encodeObservation(tokens: string[]): number[] {
  return tokens.map((w) => {
    if (w in word2id) return word2id[w];
    return UNK_ID;
  });
}

// Viterbi trong log-space
export function tagSentence(sentence: string): {
  tokens: string[];
  tags: string[];
  viterbiLogProb: number;
} {
  const tokens = tokenize(sentence);
  if (tokens.length === 0) {
    throw new Error("Empty sentence");
  }

  const O = encodeObservation(tokens);
  const T = O.length;
  const N = pi.length;

  const eps = 1e-300;
  const logPi = pi.map((p) => Math.log(p + eps));
  const logA = A.map((row) => row.map((p) => Math.log(p + eps)));
  const logB = B.map((row) => row.map((p) => Math.log(p + eps)));

  const delta: number[][] = Array.from({ length: T }, () =>
    Array<number>(N).fill(0)
  );
  const psi: number[][] = Array.from({ length: T }, () =>
    Array<number>(N).fill(0)
  );

  // Khởi tạo
  for (let i = 0; i < N; i++) {
    delta[0][i] = logPi[i] + logB[i][O[0]];
    psi[0][i] = 0;
  }

  // Đệ quy
  for (let t = 1; t < T; t++) {
    for (let j = 0; j < N; j++) {
      let bestPrev = 0;
      let bestScore = -Infinity;
      for (let i = 0; i < N; i++) {
        const score = delta[t - 1][i] + logA[i][j];
        if (score > bestScore) {
          bestScore = score;
          bestPrev = i;
        }
      }
      psi[t][j] = bestPrev;
      delta[t][j] = bestScore + logB[j][O[t]];
    }
  }

  // Kết thúc
  let lastState = 0;
  let bestLastScore = -Infinity;
  for (let i = 0; i < N; i++) {
    if (delta[T - 1][i] > bestLastScore) {
      bestLastScore = delta[T - 1][i];
      lastState = i;
    }
  }

  // Truy vết
  const path: number[] = [lastState];
  for (let t = T - 1; t > 0; t--) {
    lastState = psi[t][lastState];
    path.push(lastState);
  }
  path.reverse();

  const tags = path.map((id) => id2tag[id]);

  return {
    tokens,
    tags,
    viterbiLogProb: bestLastScore,
  };
}

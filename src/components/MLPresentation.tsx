import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Layers, Award } from "lucide-react";

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
  { model: "Logistic Regression", accuracy: 86.2, color: "hsl(var(--muted-foreground))" },
  { model: "SVC", accuracy: 87.5, color: "hsl(var(--accent))" },
  { model: "Random Forest", accuracy: 87.7, color: "hsl(var(--ai-glow))" },
];

export const MLPresentation = () => {
  return (
    <div className="space-y-12">
      {/* Executive Summary - Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--code-bg))] to-[hsl(var(--card))] border border-primary/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-primary">Executive Summary</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Optimizing ML Pipeline for Employee Attrition Prediction
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            From Data Imputation to Ensemble Learning
          </p>
          <div className="inline-flex items-center gap-4 bg-primary/20 backdrop-blur-sm border border-primary/50 rounded-xl px-6 py-4">
            <div className="text-5xl font-bold text-primary">87.7%</div>
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Final Accuracy</div>
              <div className="text-xs font-mono text-primary">Random Forest + KNN Imputer + PCA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 1: Data Integrity & Dimension Reduction */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Phase 1: Data Integrity & Dimension Reduction
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Card - Imputation Logic */}
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Why KNN Imputer?</CardTitle>
              <CardDescription className="text-muted-foreground">Preserving Data Structure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                Unlike Simple Imputer (Mean/Median) which distorts feature distribution, <span className="text-primary font-semibold">KNN Imputer preserves local data structure</span> by utilizing inter-feature correlations. This provided a robust foundation for downstream tasks.
              </p>
              <div className="mt-4 p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
                <code className="text-sm font-mono text-primary">
                  KNNImputer(n_neighbors=5, weights='distance')
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - PCA Strategy */}
          <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Dimensionality Reduction Strategy</CardTitle>
              <CardDescription className="text-muted-foreground">The Elbow Point</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We selected <span className="text-primary font-semibold">12 Principal Components</span>. This specific threshold balances 'Explained Variance' vs. 'Computational Efficiency', discarding noise while retaining critical information.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pcaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="components" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Components', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Cumulative Variance', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
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

      {/* Phase 2: Algorithm Benchmarking */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Phase 2: Algorithm Benchmarking
          </h2>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Model Performance Comparison</CardTitle>
            <CardDescription className="text-muted-foreground">
              Evaluating Linear vs. Non-Linear Classifiers on the processed dataset
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
                  <Bar 
                    dataKey="accuracy" 
                    radius={[8, 8, 0, 0]}
                  >
                    {modelData.map((entry, index) => (
                      <rect key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[hsl(var(--code-bg))] border border-border/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Logistic Regression</div>
                <div className="text-2xl font-bold text-foreground mb-2">86.2%</div>
                <div className="text-xs text-muted-foreground">The Baseline - struggles with non-linearity</div>
              </div>
              <div className="p-4 bg-[hsl(var(--code-bg))] border border-accent/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">SVC</div>
                <div className="text-2xl font-bold text-foreground mb-2">87.5%</div>
                <div className="text-xs text-muted-foreground">Strong performance in high-dimensional space</div>
              </div>
              <div className="p-4 bg-[hsl(var(--code-bg))] border border-primary/50 rounded-lg ring-2 ring-primary/30">
                <div className="text-sm text-primary mb-1 font-semibold">Random Forest ⭐</div>
                <div className="text-2xl font-bold text-primary mb-2">87.7%</div>
                <div className="text-xs text-muted-foreground">The Winner - Ensemble method robustness</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engineering Verdict */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <h2 className="text-3xl font-bold text-foreground">The Engineering Verdict</h2>
        </div>
        
        <div className="bg-[hsl(var(--code-bg))] border border-primary/30 rounded-xl p-6 font-mono text-sm">
          <div className="text-primary mb-2">$ system-status --configuration</div>
          <div className="text-foreground/80 space-y-1">
            <div><span className="text-accent">FINAL CONFIGURATION:</span></div>
            <div className="pl-4">
              <div><span className="text-muted-foreground">Imputer:</span> <span className="text-primary">KNN (n_neighbors=5)</span></div>
              <div><span className="text-muted-foreground">Scaler:</span> <span className="text-primary">StandardScaler</span></div>
              <div><span className="text-muted-foreground">Dimensionality:</span> <span className="text-primary">PCA (n_components=12)</span></div>
              <div><span className="text-muted-foreground">Classifier:</span> <span className="text-primary">RandomForest (Ensemble)</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <span className="text-ai-glow">Status:</span> <span className="text-ai-glow font-bold">OPTIMAL STABILITY & ACCURACY ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

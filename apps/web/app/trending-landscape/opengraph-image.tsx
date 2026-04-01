import { ImageResponse } from 'next/og';
import { getTrendingForTreemap } from '../ai-home-data';

export const runtime = 'edge';
export const alt = 'Open Source Trending — Topic Landscape';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

const AI_TOPICS = new Set([
  'ai', 'artificial-intelligence', 'machine-learning', 'deep-learning',
  'llm', 'large-language-model', 'chatgpt', 'gpt', 'openai',
  'agent', 'ai-agent', 'autonomous-agent',
  'rag', 'retrieval-augmented-generation', 'vector-database',
  'mcp', 'model-context-protocol',
  'coding-assistant', 'code-generation', 'copilot',
  'nlp', 'natural-language-processing', 'transformers',
  'computer-vision', 'image-generation', 'stable-diffusion',
  'mlops', 'model-serving', 'inference',
  'langchain', 'llamaindex', 'huggingface',
]);

function pickTopic(topics: string[]): string {
  if (!topics || topics.length === 0) return 'other';
  const aiTopic = topics.find(t => AI_TOPICS.has(t));
  if (aiTopic) return aiTopic;
  const partial = topics.find(t =>
    ['ai', 'ml', 'llm', 'agent', 'model', 'neural', 'gpt', 'chat', 'bot', 'rag', 'vector', 'embed', 'inference', 'train', 'prompt', 'code', 'automat'].some(k => t.includes(k))
  );
  if (partial) return partial;
  const skip = new Set(['python', 'javascript', 'typescript', 'go', 'rust', 'java', 'cpp', 'c', 'swift', 'kotlin', 'ruby', 'php', 'hacktoberfest', 'awesome', 'open-source', 'linux', 'macos', 'windows', 'docker', 'github']);
  const good = topics.find(t => !skip.has(t) && t.length > 2);
  return good || 'other';
}

const COLORS = [
  '#4ecdc4', '#6c8cff', '#ff8a65', '#ab7df0', '#5cb85c', '#e06c75',
  '#45b7d1', '#f0c040', '#26c6da', '#d47ecf', '#7cb342', '#ffa726',
  '#5c9de6', '#c770b0', '#2ec4a0', '#e8a050',
];

// Simple squarified treemap layout
function layoutTreemap(
  items: { name: string; value: number; color: string; alpha: number }[],
  x: number, y: number, w: number, h: number,
): { name: string; x: number; y: number; w: number; h: number; color: string; alpha: number }[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ ...items[0], x, y, w, h }];
  }

  const total = items.reduce((s, i) => s + i.value, 0);
  const isHorizontal = w >= h;

  // Split items into two halves by value
  let half = 0;
  let splitIdx = 0;
  for (let i = 0; i < items.length; i++) {
    half += items[i].value;
    if (half >= total / 2) {
      splitIdx = i + 1;
      break;
    }
  }
  if (splitIdx === 0) splitIdx = 1;
  if (splitIdx >= items.length) splitIdx = items.length - 1;

  const ratio = half / total;
  const left = items.slice(0, splitIdx);
  const right = items.slice(splitIdx);

  if (isHorizontal) {
    const splitW = Math.round(w * ratio);
    return [
      ...layoutTreemap(left, x, y, splitW, h),
      ...layoutTreemap(right, x + splitW, y, w - splitW, h),
    ];
  } else {
    const splitH = Math.round(h * ratio);
    return [
      ...layoutTreemap(left, x, y, w, splitH),
      ...layoutTreemap(right, x, y + splitH, w, h - splitH),
    ];
  }
}

export default async function Image() {
  const trendingRepos = await getTrendingForTreemap();

  // Group by topic
  const groups = new Map<string, any[]>();
  for (const repo of trendingRepos) {
    const topic = pickTopic(repo.topics || []);
    if (!groups.has(topic)) groups.set(topic, []);
    groups.get(topic)!.push(repo);
  }

  const sorted = [...groups.entries()]
    .map(([name, repos]) => ({
      name,
      repos: repos.sort((a: any, b: any) => (b.stars ?? 0) - (a.stars ?? 0)),
      total: repos.reduce((s: number, r: any) => s + (r.stars ?? 0), 0),
    }))
    .filter(g => g.name !== 'other')
    .sort((a, b) => b.total - a.total)
    .slice(0, 16);

  // Flatten repos with their group color
  const allRepos: { name: string; value: number; color: string; alpha: number; stars: number; topic: string }[] = [];
  for (let gi = 0; gi < sorted.length; gi++) {
    const color = COLORS[gi % COLORS.length];
    const group = sorted[gi];
    for (const repo of group.repos.slice(0, 5)) {
      const maxStars = group.repos[0]?.stars || 1;
      allRepos.push({
        name: (repo.repo_name?.split('/')[1]) || repo.repo_name,
        value: Math.max(repo.stars || 100, 100),
        color,
        alpha: 0.35 + Math.min((repo.stars ?? 0) / maxStars * 0.5, 0.5),
        stars: repo.stars || 0,
        topic: group.name,
      });
    }
  }

  // Sort by value descending for better treemap layout
  allRepos.sort((a, b) => b.value - a.value);

  // Layout treemap in the chart area
  const chartX = 0, chartY = 0, chartW = 1200, chartH = 560;
  const rects = layoutTreemap(allRepos, chartX, chartY, chartW, chartH);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0d1117',
          fontFamily: 'Inter, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Treemap blocks */}
        {rects.map((rect, i) => {
          const fontSize = Math.max(Math.min(Math.sqrt(rect.w * rect.h) / 6, 18), 9);
          const showStars = rect.w > 80 && rect.h > 40;
          // Convert hex color + alpha to rgba
          const r = parseInt(rect.color.slice(1, 3), 16);
          const g = parseInt(rect.color.slice(3, 5), 16);
          const b = parseInt(rect.color.slice(5, 7), 16);

          return (
            <div
              key={`${rect.name}-${i}`}
              style={{
                position: 'absolute',
                left: rect.x + 1,
                top: rect.y + 1,
                width: rect.w - 2,
                height: rect.h - 2,
                backgroundColor: `rgba(${r},${g},${b},${rect.alpha})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  color: '#fff',
                  fontSize,
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  maxWidth: rect.w - 8,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {rect.name}
              </div>
              {showStars && (
                <div
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: Math.max(fontSize - 3, 8),
                    marginTop: 2,
                  }}
                >
                  ★ {Number((allRepos[i] as any)?.stars || 0).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom bar with title and watermark */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            backgroundColor: 'rgba(13,17,23,0.9)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
              Open Source Trending — Topic Landscape
            </div>
          </div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            ossinsight.io
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

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
  const partial = topics.find(t => ['ai', 'ml', 'llm', 'agent', 'model', 'neural', 'gpt', 'chat', 'bot', 'rag', 'vector', 'embed', 'inference', 'train', 'prompt', 'code', 'automat'].some(k => t.includes(k)));
  if (partial) return partial;
  const skip = new Set(['python', 'javascript', 'typescript', 'go', 'rust', 'java', 'cpp', 'c', 'swift', 'kotlin', 'ruby', 'php', 'hacktoberfest', 'awesome', 'open-source', 'linux', 'macos', 'windows', 'docker', 'github']);
  const good = topics.find(t => !skip.has(t) && t.length > 2);
  return good || 'other';
}

const COLORS = ['#4ecdc4', '#6c8cff', '#ff8a65', '#ab7df0', '#5cb85c', '#e06c75', '#45b7d1', '#f0c040', '#26c6da', '#d47ecf', '#7cb342', '#ffa726', '#5c9de6', '#c770b0', '#2ec4a0', '#e8a050'];

export default async function Image() {
  const trendingRepos = await getTrendingForTreemap();

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
    .slice(0, 12);

  const grandTotal = sorted.reduce((s, g) => s + g.total, 0);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0d1117',
          padding: '32px 40px',
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
              Open Source Trending
            </div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              Topic Landscape · ossinsight.io
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            flex: 1,
          }}
        >
          {sorted.map((group, gi) => {
            const color = COLORS[gi % COLORS.length];
            const widthPct = Math.max(Math.floor((group.total / grandTotal) * 100), 15);
            return (
              <div
                key={group.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: `${color}22`,
                  borderRadius: 8,
                  padding: '10px 12px',
                  width: `${widthPct}%`,
                  minWidth: 160,
                  maxWidth: 380,
                  flexGrow: 1,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: color,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    letterSpacing: 0.5,
                  }}
                >
                  {group.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {group.repos.slice(0, 4).map((repo: any) => (
                    <div
                      key={repo.repo_name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.8)',
                        backgroundColor: `${color}18`,
                        borderRadius: 4,
                        padding: '3px 8px',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                        {repo.repo_name.split('/')[1] || repo.repo_name}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginLeft: 8, flexShrink: 0 }}>
                        ★ {Number(repo.stars || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { ...size },
  );
}

import { NextResponse } from 'next/server';
import * as echarts from 'echarts/core';
import { TreemapChart } from 'echarts/charts';
import { GraphicComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { Resvg } from '@resvg/resvg-js';
import { getTrendingForTreemap } from '../ai-home-data';

echarts.use([TreemapChart, SVGRenderer, GraphicComponent]);

export const revalidate = 3600;
// Node.js runtime required for @resvg/resvg-js native binding

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

const GROUP_TINTS = [
  '#4ecdc4', '#6c8cff', '#ff8a65', '#ab7df0', '#5cb85c', '#e06c75',
  '#45b7d1', '#f0c040', '#26c6da', '#d47ecf', '#7cb342', '#ffa726',
  '#5c9de6', '#c770b0', '#2ec4a0', '#e8a050', '#6abecd', '#d4a05a',
  '#7986cb', '#e57373',
];

export async function GET() {
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
    .slice(0, 20);

  const W = 1200, H = 630;
  const chart = echarts.init(null, null, { renderer: 'svg', ssr: true, width: W, height: H });

  chart.setOption({
    backgroundColor: '#0d1117',
    graphic: [
      {
        type: 'text',
        right: 24,
        bottom: 16,
        style: { text: 'ossinsight.io', fontSize: 14, fontWeight: 500, fill: 'rgba(255,255,255,0.35)' },
      },
    ],
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      left: 24, right: 24, top: 16, bottom: 48,
      breadcrumb: { show: false },
      itemStyle: { borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, gapWidth: 2 },
      label: {
        show: true,
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
        overflow: 'truncate',
        ellipsis: '..',
        formatter: '{b}',
      },
      upperLabel: {
        show: true,
        height: 22,
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: [4, 8],
        formatter: '{b}',
      },
      levels: [
        { itemStyle: { borderColor: 'rgba(255,255,255,0.12)', borderWidth: 2, gapWidth: 3 }, upperLabel: { show: true } },
        { itemStyle: { borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, gapWidth: 2 }, label: { show: true } },
      ],
      data: sorted.map((group, gi) => {
        const tint = GROUP_TINTS[gi % GROUP_TINTS.length];
        return {
          name: group.name,
          itemStyle: { color: tint, colorAlpha: 0.3 },
          children: group.repos.map((repo: any) => ({
            name: repo.repo_name?.split('/')[1] || repo.repo_name,
            value: Math.max(repo.stars || 100, 100),
            itemStyle: {
              color: tint,
              colorAlpha: 0.3 + Math.min((repo.stars ?? 0) / (group.repos[0]?.stars || 1) * 0.5, 0.5),
            },
            label: {
              fontSize: Math.max(Math.log2(repo.stars || 1) * 1.8, 9),
            },
          })),
        };
      }),
    }],
  });

  const svg = chart.renderToSVGString();
  chart.dispose();

  // Convert SVG to PNG via resvg
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new NextResponse(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

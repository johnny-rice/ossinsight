'use client';

import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { CategoryWithRankings } from './ai-home-data';

const LazyECharts = dynamic(() => import('@/components/Analyze/EChartsWrapper'), { ssr: false });

interface AIHomeProps {
  categories: CategoryWithRankings[];
  trendingRepos: any[];
}

function formatK(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

const COLORS = ['#6ec6a5', '#7eb8e0', '#e8a87c', '#b19cd9', '#7ecba1', '#f0a0a0', '#87cefa', '#c4b078', '#a0d2db', '#d4a5c4', '#8cc084', '#e6c87e', '#8faabe', '#c9a0dc', '#6dc8c8', '#d4a07a'];

// Pick the most representative topic for a repo (prefer AI-related)
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
  // Prefer AI-related topics
  const aiTopic = topics.find(t => AI_TOPICS.has(t));
  if (aiTopic) return aiTopic;
  // Partial match on AI keywords
  const partial = topics.find(t => ['ai', 'ml', 'llm', 'agent', 'model', 'neural', 'gpt', 'chat', 'bot', 'rag', 'vector', 'embed', 'inference', 'train', 'prompt', 'code', 'automat'].some(k => t.includes(k)));
  if (partial) return partial;
  // Exclude generic/language topics
  const skip = new Set(['python', 'javascript', 'typescript', 'go', 'rust', 'java', 'cpp', 'c', 'swift', 'kotlin', 'ruby', 'php', 'hacktoberfest', 'awesome', 'open-source', 'linux', 'macos', 'windows', 'docker', 'github']);
  const good = topics.find(t => !skip.has(t) && t.length > 2);
  return good || 'other';
}


export default function AIHomeContent({ categories, trendingRepos }: AIHomeProps) {
  const router = useRouter();
  const totalRepos = categories.reduce((s, c) => s + c.repoCount, 0);
  const totalStars = categories.reduce((s, c) => s + c.totalStarsEarned, 0);

  const onTreemapClick = useCallback((params: any) => {
    const repoName = params.data?.repoName;
    if (repoName) router.push(`/analyze/${repoName}`);
  }, [router]);

  const treemapOption = useMemo(() => {
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
      .filter(g => g.repos.length >= 2 && g.name !== 'other')
      .sort((a, b) => b.total - a.total)
      .slice(0, 16);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (p: any) => {
          if (!p.data?.repoName) return `<b>${p.name}</b>`;
          return `<div style="font-size:12px">
            <b style="color:#fff">${p.data.repoName}</b><br/>
            ★ ${Number(p.data.stars || 0).toLocaleString()}<br/>
            ${p.data.desc ? `<div style="color:#aaa;margin-top:4px;max-width:280px">${String(p.data.desc).slice(0, 100)}</div>` : ''}
          </div>`;
        },
        backgroundColor: '#222',
        borderColor: '#444',
        textStyle: { color: '#eee' },
      },
      series: [{
        type: 'treemap',
        roam: false,
        nodeClick: false,
        width: '100%',
        height: '100%',
        breadcrumb: { show: false },
        itemStyle: { borderColor: 'transparent', borderWidth: 2, gapWidth: 2 },
        label: {
          show: true,
          color: '#fff',
          fontSize: 11,
          formatter: (p: any) => p.data?.shortName || p.name,
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowBlur: 2,
        },
        upperLabel: {
          show: true,
          height: 24,
          color: '#fff',
          fontSize: 11,
          fontWeight: 'bold' as const,
          backgroundColor: 'transparent',
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowBlur: 2,
        },
        levels: [
          { itemStyle: { borderColor: 'transparent', borderWidth: 4, gapWidth: 4 }, upperLabel: { show: true } },
          { itemStyle: { borderColor: 'transparent', borderWidth: 1, gapWidth: 1 }, label: { show: true } },
        ],
        data: sorted.map((group, gi) => ({
          name: group.name,
          itemStyle: { color: COLORS[gi % COLORS.length] },
          children: group.repos.map((repo: any) => ({
            name: repo.repo_name,
            shortName: repo.repo_name.split('/')[1] || repo.repo_name,
            repoName: repo.repo_name,
            value: Math.max(repo.stars || 100, 100),
            stars: repo.stars,
            desc: repo.description,
            itemStyle: {
              color: COLORS[gi % COLORS.length],
              colorAlpha: 0.3 + Math.min((repo.stars ?? 0) / (group.repos[0]?.stars || 1) * 0.7, 0.7),
            },
            label: { fontSize: Math.max(Math.log2(repo.stars || 1) * 1.3, 8) },
          })),
        })),
      }],
    };
  }, [trendingRepos]);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1280px] px-6">
        <LazyECharts option={treemapOption} style={{ height: 500, width: '100%' }} onEvents={{ click: onTreemapClick }} />
      </div>
    </section>
  );
}

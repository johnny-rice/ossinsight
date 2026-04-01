'use client';

import React, { useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { CategoryWithRankings } from './ai-home-data';
import { triggerDownload } from '@/components/ui/export-button';
import { Download } from 'lucide-react';

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

// Group tint colors — medium saturation, good variety
const GROUP_TINTS = ['#4ecdc4', '#6c8cff', '#ff8a65', '#ab7df0', '#5cb85c', '#e06c75', '#45b7d1', '#f0c040', '#26c6da', '#d47ecf', '#7cb342', '#ffa726', '#5c9de6', '#c770b0', '#2ec4a0', '#e8a050', '#6abecd', '#d4a05a', '#7986cb', '#e57373'];

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


// Build a 4K export — uses canvas directly for reliability
async function export4KTreemap(treemapData: any[], title: string) {
  // Use the already-registered global echarts
  const echartsModule = await import('echarts/core');

  const W = 3840, H = 2160;
  const container = document.createElement('div');
  container.style.cssText = `position:absolute;left:-9999px;top:-9999px;width:${W}px;height:${H}px;visibility:hidden;`;
  document.body.appendChild(container);

  const instance = echartsModule.init(container, undefined, { renderer: 'canvas', width: W, height: H });

  // Rebuild data with solid colors and large labels
  const exportData = treemapData.map((group: any, gi: number) => {
    const tint = GROUP_TINTS[gi % GROUP_TINTS.length];
    return {
      name: group.name,
      itemStyle: { color: tint, colorAlpha: 0.35 },
      label: { show: true, color: '#fff', fontSize: 26, fontWeight: 700 },
      children: (group.children || []).map((child: any) => ({
        name: child.shortName || child.name,
        value: child.value,
        stars: child.stars,
        repoName: child.repoName,
        shortName: child.shortName,
        itemStyle: {
          color: tint,
          colorAlpha: 0.35 + Math.min((child.stars ?? 0) / ((group.children?.[0]?.stars) || 1) * 0.45, 0.45),
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: Math.max(Math.log2(child.stars || 1) * 3, 16),
          fontWeight: 500,
          overflow: 'truncate',
          ellipsis: '..',
        },
      })),
    };
  });

  instance.setOption({
    backgroundColor: '#0d1117',
    graphic: [
      {
        type: 'text',
        left: 60,
        top: 40,
        style: { text: title, fontSize: 42, fontWeight: 700, fontFamily: "'Inter', -apple-system, sans-serif", fill: '#fff' },
      },
      {
        type: 'text',
        right: 60,
        bottom: 40,
        style: { text: 'ossinsight.io', fontSize: 28, fontWeight: 500, fontFamily: "'Inter', -apple-system, sans-serif", fill: 'rgba(255,255,255,0.4)' },
      },
    ],
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      left: 60, right: 60, top: 110, bottom: 80,
      breadcrumb: { show: false },
      itemStyle: { borderColor: 'rgba(255,255,255,0.1)', borderWidth: 2, gapWidth: 4 },
      label: {
        show: true,
        color: '#fff',
        fontSize: 20,
        overflow: 'truncate',
        ellipsis: '..',
        formatter: '{b}',
      },
      upperLabel: {
        show: true,
        height: 48,
        color: '#fff',
        fontSize: 28,
        fontWeight: 700,
        fontFamily: "'Inter', -apple-system, sans-serif",
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: [8, 16],
        formatter: '{b}',
      },
      levels: [
        { itemStyle: { borderColor: 'rgba(255,255,255,0.15)', borderWidth: 4, gapWidth: 6 }, upperLabel: { show: true } },
        { itemStyle: { borderColor: 'rgba(255,255,255,0.08)', borderWidth: 2, gapWidth: 3 }, label: { show: true } },
      ],
      data: exportData,
    }],
  });

  // Wait for ECharts to finish rendering
  await new Promise(r => setTimeout(r, 500));

  const canvas = container.querySelector('canvas');
  let url: string;
  if (canvas) {
    url = canvas.toDataURL('image/png');
  } else {
    url = instance.getDataURL({ type: 'png', pixelRatio: 1, backgroundColor: '#0d1117' });
  }

  instance.dispose();
  document.body.removeChild(container);
  return url;
}

function shareToTwitter() {
  const text = encodeURIComponent('Open Source Trending — Topic Landscape\n\nDiscover trending repos grouped by topic\n\n@OSSInsight');
  const url = encodeURIComponent('https://ossinsight.io/share/trending');
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
}

export default function AIHomeContent({ categories, trendingRepos }: AIHomeProps) {
  const router = useRouter();
  const totalRepos = categories.reduce((s, c) => s + c.repoCount, 0);
  const totalStars = categories.reduce((s, c) => s + c.totalStarsEarned, 0);
  const treemapDataRef = useRef<any[]>([]);

  const onTreemapClick = useCallback((params: any) => {
    const repoName = params.data?.repoName;
    if (repoName) router.push(`/analyze/${repoName}`);
  }, [router]);

  const handleExport4K = useCallback(async () => {
    const url = await export4KTreemap(treemapDataRef.current, 'Open Source Trending — Topic Landscape');
    triggerDownload(url, 'ossinsight-trending-4k.png');
  }, []);

  const handleShare = useCallback(() => {
    shareToTwitter();
  }, []);

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
      .filter(g => g.name !== 'other')
      .sort((a, b) => b.total - a.total)
      .slice(0, 20);

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
        itemStyle: { borderColor: 'transparent', borderWidth: 0, gapWidth: 1 },
        emphasis: {
          itemStyle: { borderColor: 'transparent', borderWidth: 0 },
          label: { color: '#fff' },
          upperLabel: { color: '#fff' },
        },
        label: {
          show: true,
          color: 'rgba(255,255,255,0.85)',
          fontSize: 11,
          formatter: (p: any) => p.data?.shortName || p.name,
        },
        upperLabel: {
          show: true,
          height: 26,
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          backgroundColor: 'transparent',
          textShadowColor: 'rgba(0,0,0,0.4)',
          textShadowBlur: 3,
        },
        levels: [
          {
            itemStyle: { borderColor: 'transparent', borderWidth: 0, gapWidth: 2 },
            upperLabel: { show: true },
          },
          {
            itemStyle: { borderColor: 'transparent', borderWidth: 0, gapWidth: 1 },
            label: { show: true },
          },
        ],
        data: (treemapDataRef.current = sorted.map((group, gi) => {
          const tint = GROUP_TINTS[gi % GROUP_TINTS.length];
          return {
            name: group.name,
            itemStyle: { color: 'transparent' },
            emphasis: { itemStyle: { color: tint, colorAlpha: 0.12 } },
            children: group.repos.map((repo: any) => ({
              name: repo.repo_name,
              shortName: repo.repo_name.split('/')[1] || repo.repo_name,
              repoName: repo.repo_name,
              value: Math.max(repo.stars || 100, 100),
              stars: repo.stars,
              desc: repo.description,
              itemStyle: {
                color: tint,
                colorAlpha: 0.15 + Math.min((repo.stars ?? 0) / (group.repos[0]?.stars || 1) * 0.2, 0.2),
              },
              emphasis: {
                itemStyle: { color: tint, colorAlpha: 0.45 },
              },
              label: { fontSize: Math.max(Math.log2(repo.stars || 1) * 1.3, 8) },
            })),
          };
        })),
      }],
    };
  }, [trendingRepos]);

  return (
    <section className="py-8">
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="flex justify-end gap-3 pb-3">
          <button
            type="button"
            onClick={handleExport4K}
            className="flex h-9 items-center gap-2 rounded-md border border-[#444] bg-[#1a1a1a] px-4 text-[14px] font-medium text-white transition hover:border-[#666] hover:bg-[#2a2a2a]"
          >
            <Download className="h-4 w-4" />
            Download 4K
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-9 items-center gap-2 rounded-md border border-[#444] bg-[#1a1a1a] px-4 text-[14px] font-medium text-white transition hover:border-[#666] hover:bg-[#2a2a2a]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share to X
          </button>
        </div>
        <LazyECharts option={treemapOption} style={{ height: 500, width: '100%' }} onEvents={{ click: onTreemapClick }} />
      </div>
    </section>
  );
}

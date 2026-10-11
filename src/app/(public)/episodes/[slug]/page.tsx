import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils/formatters";
import { InstagramEmbed } from "@/components/episode/InstagramEmbed";
import { CommentsSection } from "@/components/episode/CommentsSection";
import { EpisodeCard } from "@/components/episode/EpisodeCard";
import { 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  Share2, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Users,
  Building2 
} from "lucide-react";

export const dynamic = "force-dynamic";

interface EpisodeDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EpisodeDetailPageProps): Promise<Metadata> {
  const episode = await dbRepository.getEpisodeBySlug(params.slug);
  if (!episode || episode.status !== "published") {
    return { title: "Episode Not Found" };
  }

  const title = `Day ${episode.day_number}: ${episode.title} | Project Dhurandhar`;
  const description = episode.summary.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `https://projectdhurandhar.automationlabs.online/episodes/${episode.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://projectdhurandhar.automationlabs.online/episodes/${episode.slug}`,
      type: "article",
      publishedTime: episode.published_at || episode.created_at,
    },
  };
}

export default async function EpisodeDetailPage({ params }: EpisodeDetailPageProps) {
  const episode = await dbRepository.getEpisodeBySlug(params.slug);

  if (!episode || episode.status !== "published") {
    notFound();
  }

  // Fetch adjacent episodes for previous/next navigation
  const { episodes: allEpisodes } = await dbRepository.getPublishedEpisodes({ limit: 100, sort: "newest" });
  const currentIndex = allEpisodes.findIndex((e) => e.id === episode.id);
  const nextEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const prevEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  // Related episodes sharing tags
  const relatedEpisodes = allEpisodes
    .filter((e) => e.id !== episode.id && e.tags?.some((t) => episode.tags?.some((et) => et.id === t.id)))
    .slice(0, 3);

  // JSON-LD structured data for SEO indexability (AC-18, AC-27)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: `Day ${episode.day_number}: ${episode.title}`,
    description: episode.summary,
    datePublished: episode.published_at || episode.created_at,
    author: {
      "@type": "Person",
      name: "Dr. Ajay Kumar",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Automation Labs LLP",
      url: "https://automationlabs.online",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://projectdhurandhar.automationlabs.online/episodes/${episode.slug}`,
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400" aria-label="Breadcrumb">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <a href="/episodes" className="hover:text-white transition-colors">Episodes</a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-brand-gold font-medium truncate">Day {episode.day_number}</span>
      </nav>

      {/* 2. Episode Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold">
            Day {episode.day_number}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <time dateTime={episode.published_at || episode.created_at}>
              {formatDate(episode.published_at || episode.created_at)}
            </time>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {episode.title}
        </h1>

        {episode.tags && episode.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {episode.tags.map((t) => (
              <a
                key={t.id}
                href={`/episodes?tag=${t.slug}`}
                className="text-xs px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-800 transition-colors"
              >
                #{t.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 3. Instagram Video Embed & Fallback Area */}
      <InstagramEmbed
        url={episode.instagram_url}
        dayNumber={episode.day_number}
        title={episode.title}
      />

      {/* 4. Human-Approved AI Summary */}
      <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Episode Summary (AI-assisted • Human-verified)</span>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {episode.summary}
        </p>
      </section>

      {/* 5. Key Takeaways & Strategic Decisions */}
      {episode.takeaways && episode.takeaways.length > 0 && (
        <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Key Decisions & Execution Takeaways
          </h2>

          <ul className="space-y-3">
            {episode.takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                <span className="w-2 h-2 rounded-full bg-brand-sky shrink-0 mt-1.5" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Spoken Transcript / Source Notes (Collapsible) */}
      {episode.transcript_text && (
        <details className="group bg-navy-900/60 border border-navy-800 rounded-2xl p-5 text-xs">
          <summary className="font-semibold text-slate-300 cursor-pointer list-none flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Full Spoken Transcript / Raw Notes</span>
            </span>
            <span className="text-brand-sky group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-4 pt-4 border-t border-navy-800 text-slate-400 whitespace-pre-wrap leading-relaxed">
            {episode.transcript_text}
          </div>
        </details>
      )}

      {/* 7. People & Entities Attribution */}
      <div className="bg-navy-950 border border-navy-800/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center font-bold text-brand-gold">
            AK
          </div>
          <div>
            <span className="font-bold text-white block">Dr. Ajay Kumar</span>
            <span className="text-[11px] text-slate-400">Managing Partner, AI Automation Labs LLP</span>
          </div>
        </div>

        <a
          href="/about"
          className="text-brand-sky hover:underline text-xs flex items-center space-x-1"
        >
          <span>About Founder & Mission</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 8. Previous & Next Episode Navigation */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-navy-800/80" aria-label="Episode Navigation">
        {prevEpisode ? (
          <a
            href={`/episodes/${prevEpisode.slug}`}
            className="p-4 bg-navy-900 hover:bg-navy-850 border border-navy-800 rounded-xl transition-colors block text-left group"
          >
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
              ← Previous Episode
            </span>
            <span className="text-xs font-semibold text-white group-hover:text-brand-sky transition-colors line-clamp-1">
              Day {prevEpisode.day_number}: {prevEpisode.title}
            </span>
          </a>
        ) : <div />}

        {nextEpisode ? (
          <a
            href={`/episodes/${nextEpisode.slug}`}
            className="p-4 bg-navy-900 hover:bg-navy-850 border border-navy-800 rounded-xl transition-colors block text-right group sm:col-start-2"
          >
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
              Next Episode →
            </span>
            <span className="text-xs font-semibold text-white group-hover:text-brand-sky transition-colors line-clamp-1">
              Day {nextEpisode.day_number}: {nextEpisode.title}
            </span>
          </a>
        ) : <div />}
      </nav>

      {/* 9. Sign-in Gated Community Comments Section */}
      <CommentsSection episodeId={episode.id} />

      {/* 10. Related Episodes */}
      {relatedEpisodes.length > 0 && (
        <section className="pt-8 border-t border-navy-800/80 space-y-6">
          <h2 className="text-lg font-bold text-white">Related Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedEpisodes.map((rel) => (
              <EpisodeCard key={rel.id} episode={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

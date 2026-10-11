import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Project Dhurandhar",
  description: "Privacy and data protection notice for Project Dhurandhar and AI Automation Labs LLP.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-sky uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Privacy Notice
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Effective Date: 11 October 2026 • AI Automation Labs LLP ("we", "us", "our")
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p className="text-xs text-slate-400">
            We collect only the minimal information required to authenticate community members and maintain constructive discussions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li><strong>Account Details:</strong> Email address and chosen public display name when you register.</li>
            <li><strong>Discussion Data:</strong> Comment texts submitted on episodes.</li>
            <li><strong>Technical Telemetry:</strong> Anonymized server logs for security, abuse detection, and rate limiting.</li>
          </ul>
        </section>

        <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">2. Private Email Guarantee</h2>
          <p className="text-xs text-slate-400">
            Your registered email address is <strong>never displayed publicly</strong> on episode pages, in API responses, or in page source. Only your public display name is displayed alongside approved comments.
          </p>
        </section>

        <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">3. Third-Party Instagram Embeds & Cookies</h2>
          <p className="text-xs text-slate-400">
            Our daily episodes feature video players provided by Instagram (Meta Platforms, Inc.). Loading embedded content connects your browser to Instagram servers, which may set or read cookies governed by Meta's privacy policy. You can choose to use our direct link to view videos directly on the Instagram platform.
          </p>
        </section>

        <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">4. AI Processing Safeguards</h2>
          <p className="text-xs text-slate-400">
            Our AI-assisted summaries process only episode transcripts, captions, and administrative notes uploaded by our team. <strong>We do not transmit user account data, comments, or emails to external AI models.</strong>
          </p>
        </section>

        <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-base font-bold text-white">5. Account Deletion & Contact</h2>
          <p className="text-xs text-slate-400">
            You may request deletion of your account and personal data at any time by contacting our administrator at:{" "}
            <a href="mailto:privacy@automationlabs.online" className="text-brand-sky underline">
              privacy@automationlabs.online
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

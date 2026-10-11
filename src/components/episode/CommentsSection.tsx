"use client";

import React, { useState, useEffect } from "react";
import { Comment } from "@/lib/types/comment";
import { formatDate } from "@/lib/utils/formatters";
import { MessageSquare, Send, ShieldAlert, CheckCircle2, User, Lock, AlertCircle } from "lucide-react";

interface CommentsSectionProps {
  episodeId: string;
}

export function CommentsSection({ episodeId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "pending"; text: string } | null>(null);

  // Simulated logged-in session state (can be toggled or integrated with Supabase auth)
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    display_name: string;
    is_verified: boolean;
  } | null>({
    id: "user-1",
    display_name: "Rahul Verma",
    is_verified: true,
  });

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?episodeId=${episodeId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [episodeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // AC-09: Signed-out check
    if (!currentUser) {
      setStatusMessage({
        type: "error",
        text: "You must be signed in to submit a comment. Please register or sign in.",
      });
      return;
    }

    // AC-10: Email verification check
    if (!currentUser.is_verified) {
      setStatusMessage({
        type: "error",
        text: "Email verification required before commenting. Please verify your account link sent to your inbox.",
      });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episode_id: episodeId,
          author_profile_id: currentUser.id,
          author_name: currentUser.display_name,
          is_email_verified: currentUser.is_verified,
          body: commentText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit comment.");
      }

      setCommentText("");

      // AC-11: First-time user moderation feedback
      if (data.status === "pending") {
        setStatusMessage({
          type: "pending",
          text: "Thank you! As a new commenter, your first submission has been received and will appear publicly once approved by our moderator.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "Your comment has been posted successfully.",
        });
        fetchComments();
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card" aria-labelledby="discussion-heading">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-800">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-brand-sky" />
          <h2 id="discussion-heading" className="text-lg font-bold text-white">
            Community Discussion ({comments.length})
          </h2>
        </div>

        {/* Demo Auth Toggle for Review & Testing */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Simulate:</span>
          <button
            type="button"
            onClick={() => setCurrentUser(currentUser ? null : { id: "user-1", display_name: "Rahul Verma", is_verified: true })}
            className={`px-2 py-1 rounded text-[11px] border ${
              currentUser ? "bg-navy-800 text-teal-400 border-teal-800/40" : "bg-red-950/40 text-red-400 border-red-800/40"
            }`}
          >
            {currentUser ? "Logged In" : "Signed Out"}
          </button>
        </div>
      </div>

      {/* Submission Form or Auth Gate (AC-09) */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center space-x-2 mb-2 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-brand-sky" />
            <span>Commenting as <strong className="text-white">{currentUser.display_name}</strong></span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your perspective, question, or lesson from this episode..."
              className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky resize-none"
              required
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              Constructive contributions only. All comments respect our <a href="/community-guidelines" className="text-brand-sky hover:underline">Guidelines</a>.
            </p>
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-sky hover:bg-sky-500 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-xs shadow-subtle transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Posting..." : "Post Comment"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* AC-09 Signed-Out Prompt */
        <div className="mb-8 bg-navy-950/80 border border-navy-800 rounded-xl p-5 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-navy-800 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-brand-gold" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            Sign In to Join the Discussion
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            To prevent spam and foster high-quality founder conversations, comments require an authenticated account.
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <a
              href="/sign-in"
              className="px-4 py-2 bg-brand-sky text-slate-950 font-semibold rounded-lg hover:bg-sky-400 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-navy-800 text-slate-200 hover:text-white rounded-lg border border-navy-700 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      )}

      {/* Feedback Messages */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs flex items-start space-x-3 ${
            statusMessage.type === "success"
              ? "bg-teal-950/60 border border-teal-800 text-teal-200"
              : statusMessage.type === "pending"
              ? "bg-amber-950/60 border border-amber-800 text-amber-200"
              : "bg-red-950/60 border border-red-800 text-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <p className="leading-relaxed">{statusMessage.text}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Loading discussion...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No approved comments yet. Be the first to share your thoughts on this episode.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-navy-950/60 border border-navy-800/80 rounded-xl p-4 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-bold text-brand-sky">
                    {comment.author?.display_name.charAt(0) || "U"}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {comment.author?.display_name || "Community Member"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sanitized body - AC-12 */}
              <p className="text-xs text-slate-300 leading-relaxed pl-9">
                {comment.body}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

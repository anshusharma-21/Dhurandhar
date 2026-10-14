"use client";

import React, { useState, useEffect } from "react";
import { Comment } from "@/lib/types/comment";
import { formatDate } from "@/lib/utils/formatters";
import { MessageSquare, Send, CheckCircle2, User, Lock, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface CommentsSectionProps {
  episodeId: string;
}

export function CommentsSection({ episodeId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "pending"; text: string } | null>(null);

  // Real authenticated Supabase session state
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string;
    display_name: string;
    is_verified: boolean;
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

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

  useEffect(() => {
    let isMounted = true;
    const client = supabase;

    if (!isSupabaseConfigured || !client) {
      setAuthLoading(false);
      return;
    }

    const syncUserSession = async () => {
      try {
        const { data: { user } } = await client.auth.getUser();
        if (!isMounted) return;

        if (user) {
          let displayName =
            user.user_metadata?.display_name ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Community Member";
          let isVerified = true;

          try {
            const { data: profile } = await client
              .from("profiles")
              .select("display_name, email_verified_at")
              .eq("id", user.id)
              .maybeSingle();

            if (profile && isMounted) {
              if (profile.display_name) displayName = profile.display_name;
              if (profile.email_verified_at) isVerified = true;
            }
          } catch {
            // Fallback to user metadata
          }

          if (isMounted) {
            setCurrentUser({
              id: user.id,
              email: user.email,
              display_name: displayName,
              is_verified: isVerified,
            });
          }
        } else {
          if (isMounted) {
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error("Auth session check error:", err);
        if (isMounted) setCurrentUser(null);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    syncUserSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        syncUserSession();
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendingVerification) return;
    setResendingVerification(true);
    setResendFeedback(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser?.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend verification email.");
      }
      setResendFeedback(
        data.message || "Verification email sent! Please check your inbox and spam folder."
      );
      setResendCooldown(60);
    } catch (err: any) {
      setResendFeedback(err.message || "Failed to send verification link.");
    } finally {
      setResendingVerification(false);
    }
  };

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
          author_name: currentUser.display_name,
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
    <section className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-card transition-colors" aria-labelledby="discussion-heading">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          <h2 id="discussion-heading" className="text-lg font-black text-slate-900 dark:text-white">
            Community Discussion ({comments.length})
          </h2>
        </div>

        {/* Real Supabase Auth State Badge */}
        <div className="flex items-center space-x-2 text-xs">
          {authLoading ? (
            <span className="text-slate-400 text-[11px] animate-pulse">Checking auth...</span>
          ) : currentUser ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{currentUser.display_name}</span>
            </span>
          ) : (
            <a
              href="/sign-in"
              className="text-amber-700 dark:text-amber-400 hover:underline text-[11px] font-semibold"
            >
              Sign in to discuss →
            </a>
          )}
        </div>
      </div>

      {/* Submission Form or Auth Gate (AC-09, AC-10) */}
      {authLoading ? (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400 animate-pulse">
          Checking account privileges...
        </div>
      ) : currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center justify-between mb-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Commenting as <strong className="text-slate-900 dark:text-white">{currentUser.display_name}</strong></span>
            </div>
            {currentUser.is_verified ? (
              <span className="inline-flex items-center space-x-1 text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                <CheckCircle2 className="w-3 h-3 text-teal-500" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>Unverified</span>
              </span>
            )}
          </div>

          {!currentUser.is_verified && (
            <div className="mb-3.5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-200 space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <p className="font-semibold text-amber-800 dark:text-amber-300">Email Verification Required</p>
                  <p className="text-amber-800/90 dark:text-amber-200/90 text-[11px] leading-relaxed">
                    Your email has not been verified yet. Check your inbox for the confirmation link to activate commenting privileges.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-amber-700 dark:text-amber-300">
                  Didn&apos;t receive the confirmation email?
                </span>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingVerification || resendCooldown > 0}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg text-[11px] transition-colors shadow-sm"
                >
                  {resendingVerification
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Verification Email"}
                </button>
              </div>

              {resendFeedback && (
                <div className="p-2 bg-amber-500/15 border border-amber-500/25 rounded-lg text-[11px] text-amber-900 dark:text-amber-100 font-medium">
                  {resendFeedback}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                currentUser.is_verified
                  ? "Share your perspective, question, or lesson from this episode..."
                  : "Please verify your email address to enable commenting..."
              }
              disabled={!currentUser.is_verified}
              className="w-full bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl p-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none transition-colors"
              required
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Constructive contributions only. All comments respect our <a href="/community-guidelines" className="text-amber-700 dark:text-amber-400 hover:underline">Guidelines</a>.
            </p>
            <button
              type="submit"
              disabled={submitting || !commentText.trim() || !currentUser.is_verified}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {!currentUser.is_verified
                  ? "Verification Required"
                  : submitting
                  ? "Posting..."
                  : "Post Comment"}
              </span>
            </button>
          </div>
        </form>
      ) : (
        /* AC-09 Signed-Out Prompt */
        <div className="mb-8 bg-slate-50 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 text-center transition-colors">
          <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
            Sign In to Join the Discussion
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
            To prevent spam and foster high-quality founder conversations, comments require an authenticated account.
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <a
              href="/sign-in"
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-sm"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white rounded-xl border border-slate-300 dark:border-white/10 transition-colors"
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
              ? "bg-teal-500/10 border border-teal-500/30 text-teal-800 dark:text-teal-200"
              : statusMessage.type === "pending"
              ? "bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200"
              : "bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
              className="bg-slate-50/80 dark:bg-[#131824] border border-slate-200/90 dark:border-white/10 rounded-xl p-4 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400">
                    {comment.author?.display_name.charAt(0) || "U"}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {comment.author?.display_name || "Community Member"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sanitized body - AC-12 */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                {comment.body}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

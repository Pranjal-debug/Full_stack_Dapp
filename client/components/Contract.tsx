"use client";

import { useState, useCallback, useEffect } from "react";
import {
  createPost,
  getPosts,
  getPostCount,
  Post,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <textarea
          {...props}
          rows={5}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none resize-none"
        />
      </div>
    </div>
  );
}

// ── Post Card ────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  
  const formatTimestamp = (ts: bigint) => {
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up group hover:border-white/[0.1] transition-all">
      <div className="px-5 py-4 border-b border-white/[0.04]">
        <h3 className="text-base font-semibold text-white/90 leading-tight mb-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-4 text-[11px] text-white/35">
          <span className="flex items-center gap-1.5">
            <UserIcon />
            {truncate(post.author)}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon />
            {formatTimestamp(post.timestamp)}
          </span>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>
      <div className="px-5 py-3 border-t border-white/[0.04] flex items-center gap-2">
        <Badge variant="info" className="text-[9px]">Post #{post.id}</Badge>
        <span className="text-[9px] text-white/15">Permissionless · Soroban</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

type Tab = "feed" | "write";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postCount, setPostCount] = useState<number>(0);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const [allPosts, count] = await Promise.all([getPosts(), getPostCount()]);
      setPosts(allPosts.reverse()); // Newest first
      setPostCount(count);
    } catch (err: unknown) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "feed") {
      loadPosts();
    }
  }, [activeTab, loadPosts]);

  const handleCreatePost = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!title.trim()) return setError("Enter a title");
    if (!content.trim()) return setError("Write some content");

    setError(null);
    setIsPosting(true);
    setTxStatus("Awaiting signature...");

    try {
      await createPost(walletAddress, title.trim(), content.trim());
      setTxStatus("Post published on-chain!");
      setTitle("");
      setContent("");
      setActiveTab("feed");
      setTimeout(() => setTxStatus(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsPosting(false);
    }
  }, [walletAddress, title, content]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "feed", label: "Feed", icon: <BookOpenIcon />, color: "#4fc3f7" },
    { key: "write", label: "Write", icon: <PencilIcon />, color: "#7c6cf0" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("on-chain") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <span className="text-[#7c6cf0]"><GlobeIcon /></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Decentralized Blog</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{postCount} posts · Permissionless</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Feed Tab */}
            {activeTab === "feed" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/25">Latest Posts</span>
                    <Badge variant="info" className="text-[9px]">{postCount}</Badge>
                  </div>
                  <button
                    onClick={loadPosts}
                    disabled={isLoadingPosts}
                    className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/60 transition-colors disabled:opacity-50"
                  >
                    <RefreshIcon />
                    Refresh
                  </button>
                </div>

                {isLoadingPosts ? (
                  <div className="flex items-center justify-center py-12">
                    <SpinnerIcon />
                    <span className="ml-2 text-sm text-white/40">Loading posts...</span>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/[0.06] rounded-xl">
                    <span className="text-[#7c6cf0]/50"><GlobeIcon /></span>
                    <p className="mt-3 text-sm text-white/35">No posts yet</p>
                    <p className="text-[11px] text-white/20 mt-1">Be the first to write something!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Write Tab */}
            {activeTab === "write" && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[11px] text-white/25">
                  <span className="flex items-center gap-1.5">
                    <GlobeIcon />
                    Permissionless — anyone can post
                  </span>
                </div>

                <div className="rounded-xl border border-[#7c6cf0]/10 bg-[#7c6cf0]/[0.02] px-4 py-3 text-[11px] text-white/40">
                  Your wallet: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected"}
                </div>

                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your post a title..."
                  maxLength={100}
                />

                <TextArea
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts... (this is permanent on-chain)"
                  maxLength={2000}
                />

                <div className="flex items-center justify-between text-[10px] text-white/20">
                  <span>{content.length}/2000 characters</span>
                </div>

                {walletAddress ? (
                  <ShimmerButton onClick={handleCreatePost} disabled={isPosting} shimmerColor="#7c6cf0" className="w-full">
                    {isPosting ? <><SpinnerIcon /> Publishing...</> : <><PencilIcon /> Publish Post</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to publish
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Decentralized Blog &middot; Soroban &middot; No Censorship</p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
              <span className="font-mono text-[9px] text-white/15">Permissionless</span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}

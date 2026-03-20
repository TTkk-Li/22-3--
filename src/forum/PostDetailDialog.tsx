import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useForum } from './ForumProvider';
import type { ForumComment } from './types';
import { formatTimeAgo } from './forumStorage';
import { categories } from './mockData';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string | null;
  onRequestLogin: () => void;
};

export function PostDetailDialog({ open, onOpenChange, postId, onRequestLogin }: Props) {
  const { currentUserId, getPostById, getUserById, getCommentsByPostId, actions } = useForum();
  const post = useMemo(() => (postId ? getPostById(postId) : undefined), [postId, getPostById]);

  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const categoryName = useMemo(() => {
    if (!post) return '';
    return categories.find((c) => c.id === post.categoryId)?.name ?? '';
  }, [post]);

  const comments = useMemo(() => {
    if (!post) return [];
    return getCommentsByPostId(post.id).sort((a, b) => (a.createdAtISO > b.createdAtISO ? 1 : -1));
  }, [post, getCommentsByPostId]);

  const author = post ? getUserById(post.authorId) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {post ? post.title : '帖子详情'}
          </DialogTitle>
          <DialogDescription>
            {post ? (
              <>
                {categoryName} · {post.game} · {author ? author.username : '未知'} · {formatTimeAgo(post.createdAtISO)}
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        {!post ? (
          <div className="py-6 text-sm text-muted-foreground">未找到帖子</div>
        ) : (
          <div className="space-y-5 pt-2">
            {post.coverImage ? (
              <div className="rounded-2xl overflow-hidden border border-border">
                <img src={post.coverImage} alt={post.title} className="w-full h-56 object-cover" />
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                作者：{author ? author.username : '未知'}
                {author?.level ? ` · Lv.${author.level}` : ''}
              </div>
              <div className="whitespace-pre-wrap text-sm leading-7">{post.content}</div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">评论区（{comments.length}）</h3>
              </div>

              {!currentUserId ? (
                <div className="mt-3 rounded-xl bg-muted/50 p-4 text-sm">
                  发表评论需要登录。
                  <button className="ml-2 underline" onClick={onRequestLogin}>
                    现在登录
                  </button>
                </div>
              ) : (
                <form
                  className="mt-4 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError(null);
                    const res = actions.addComment(post.id, commentText);
                    if (!res.ok) setError(res.error ?? '评论失败');
                    else setCommentText('');
                  }}
                >
                  {error ? <div className="text-sm text-destructive">{error}</div> : null}
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20 min-h-[90px]"
                    placeholder="写下你的想法..."
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="pill-button-filled" style={{ borderRadius: 9999 }} disabled={!commentText.trim()}>
                      发表评论
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-5 space-y-3">
                {comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">还没有评论，来当第一个吧。</div>
                ) : (
                  comments.map((c) => (
                    <CommentBlock
                      key={c.id}
                      comment={c}
                      getUserById={getUserById}
                      postId={post.id}
                      currentUserId={currentUserId}
                      replyTo={replyTo}
                      setReplyTo={setReplyTo}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      onReply={(text) => {
                        if (!postId) return;
                        const res = actions.addReply(postId, c.id, text);
                        if (!res.ok) {
                          setError(res.error ?? '回复失败');
                          return;
                        }
                        setError(null);
                        setReplyText('');
                        setReplyTo(null);
                      }}
                      onRequestLogin={onRequestLogin}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CommentBlock({
  comment,
  getUserById,
  postId,
  currentUserId,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  onReply,
  onRequestLogin,
}: {
  comment: ForumComment;
  getUserById: (id: string) => any;
  postId: string;
  currentUserId: string | null;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (v: string) => void;
  onReply: (text: string) => void;
  onRequestLogin: () => void;
}) {
  const author = getUserById(comment.authorId);
  const isReplying = replyTo === comment.id;
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">
            {author?.username ?? '未知'}
            <span className="ml-2 text-xs text-muted-foreground">{formatTimeAgo(comment.createdAtISO)}</span>
          </div>
          <div className="mt-1 text-sm whitespace-pre-wrap leading-6">{comment.content}</div>
        </div>

        <button
          className="text-xs text-muted-foreground hover:text-foreground underline"
          onClick={() => {
            if (!currentUserId) return onRequestLogin();
            setReplyTo(comment.id);
            setReplyText('');
          }}
        >
          回复
        </button>
      </div>

      {isReplying ? (
        <form
          className="mt-3 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const text = replyText.trim();
            if (!text) return;
            onReply(text);
          }}
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20 min-h-[70px]"
            placeholder="写下你的回复..."
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="pill-button" style={{ borderRadius: 9999 }} onClick={() => setReplyTo(null)}>
              取消
            </button>
            <button
              type="submit"
              className="pill-button-filled"
              style={{ borderRadius: 9999 }}
              disabled={!replyText.trim()}
            >
              发送回复
            </button>
          </div>
        </form>
      ) : null}

      {comment.replies?.length ? (
        <div className="mt-3 space-y-2 pl-2 border-l border-border/60">
          {comment.replies.map((r) => {
            const ra = getUserById(r.authorId);
            return (
              <div key={r.id} className="rounded-xl bg-background/50 p-3 border border-border/60">
                <div className="text-xs text-muted-foreground">
                  {ra?.username ?? '未知'} · {formatTimeAgo(r.createdAtISO)}
                </div>
                <div className="mt-1 text-sm whitespace-pre-wrap leading-6">{r.content}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default PostDetailDialog;


import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useForum } from './ForumProvider';
import { categories } from './mockData';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreatePostDialog({ open, onOpenChange }: Props) {
  const { actions } = useForum();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && game.trim().length >= 1 && content.trim().length >= 10 && Boolean(categoryId);
  }, [title, game, content, categoryId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-2xl">
        <DialogHeader>
          <DialogTitle>发表帖子</DialogTitle>
          <DialogDescription>选择板块，填写标题与内容，保存后即可在详情页进行评论/回复。</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const res = actions.createPost({
              categoryId,
              title: title.trim(),
              game: game.trim(),
              content: content.trim(),
              coverImage: coverImage.trim() ? coverImage.trim() : undefined,
            });
            if (!res.ok) setError(res.error ?? '发布失败');
            else onOpenChange(false);
          }}
        >
          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-category">
              板块
            </label>
            <select
              id="post-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-title">
              标题
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="输入一个清晰的标题（至少 3 字）"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-game">
              游戏
            </label>
            <input
              id="post-game"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="例如：原神 / 王者荣耀 / 博德之门3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-cover">
              封面图（可选，填图片 URL）
            </label>
            <input
              id="post-cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="https://... （可留空）"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="post-content">
              内容
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="写下你的观点、攻略、心得或问题（至少 10 字）"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="pill-button flex-1"
              onClick={() => onOpenChange(false)}
            >
              取消
            </button>
            <button type="submit" className="pill-button-filled flex-1" disabled={!canSubmit} style={{ borderRadius: 9999 }}>
              发布
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePostDialog;


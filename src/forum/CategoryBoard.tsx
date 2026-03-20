import { useMemo } from 'react';
import { useForum } from './ForumProvider';
import { categories } from './mockData';

type Props = {
  categoryId: string;
  onBack: () => void;
  onOpenPost: (postId: string) => void;
  onRequestLogin: () => void;
  onRequestCreatePost: () => void;
};

export function CategoryBoard({
  categoryId,
  onBack,
  onOpenPost,
  onRequestLogin,
  onRequestCreatePost,
}: Props) {
  const { posts, getUserById, currentUserId } = useForum();

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categoryId]
  );

  const list = useMemo(() => {
    return posts
      .filter((p) => p.categoryId === categoryId)
      .sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1));
  }, [posts, categoryId]);

  return (
    <section className="relative py-10 bg-[#F9F8F7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">{category?.description ?? ''}</div>
            <h2 className="text-3xl font-bold tracking-tight mt-2">{category?.name ?? '板块'}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="pill-button" style={{ borderRadius: 9999 }} onClick={onBack}>
              返回首页
            </button>
            {currentUserId ? (
              <button className="pill-button-filled" style={{ borderRadius: 9999 }} onClick={onRequestCreatePost}>
                发表帖子
              </button>
            ) : (
              <button className="pill-button-filled" style={{ borderRadius: 9999 }} onClick={onRequestLogin}>
                登录后发帖
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {list.length === 0 ? (
            <div className="text-sm text-muted-foreground p-8 rounded-2xl bg-white border border-border/60">
              该板块暂时没有帖子。
            </div>
          ) : (
            list.map((p) => {
              const author = getUserById(p.authorId);
              return (
                <button
                  key={p.id}
                  type="button"
                  className="w-full text-left rounded-2xl bg-white border border-border/60 p-5 hover:shadow-lg hover:shadow-black/5 transition-all"
                  onClick={() => onOpenPost(p.id)}
                >
                  <div className="flex items-start gap-4">
                    {p.coverImage ? (
                      <div className="w-28 h-20 rounded-xl overflow-hidden img-hover-zoom bg-gray-100 flex-shrink-0">
                        <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-28 h-20 rounded-xl bg-gray-50 border border-border/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{p.game}</span>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                        {p.tag ? (
                          <span className="text-xs rounded-full px-3 py-1 bg-foreground/5 text-foreground/70 border border-foreground/10">
                            {p.tag}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <img
                            src={author?.avatarUrl}
                            alt={author?.username ?? 'author'}
                            className="w-5 h-5 rounded-full bg-gray-100 img-grayscale"
                          />
                          {author?.username ?? '未知'}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span>{new Date(p.createdAtISO).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default CategoryBoard;


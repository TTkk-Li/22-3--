import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useForum } from './ForumProvider';
import { formatTimeAgo } from './forumStorage';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestLogin: () => void;
};

export function UserCenterDialog({ open, onOpenChange, onRequestLogin }: Props) {
  const {
    currentUserId,
    getUserById,
    posts,
    notifications,
    actions,
  } = useForum();

  const user = useMemo(() => (currentUserId ? getUserById(currentUserId) : undefined), [currentUserId, getUserById]);
  const [tab, setTab] = useState<'home' | 'messages' | 'posts'>('home');

  const myPosts = useMemo(() => {
    if (!currentUserId) return [];
    return posts
      .filter((p) => p.authorId === currentUserId)
      .sort((a, b) => (b.createdAtISO > a.createdAtISO ? 1 : -1));
  }, [posts, currentUserId]);

  const myNotifications = useMemo(() => {
    if (!currentUserId) return [];
    return notifications
      .filter((n) => n.toUserId === currentUserId)
      .sort((a, b) => (b.createdAtISO > a.createdAtISO ? 1 : -1));
  }, [notifications, currentUserId]);

  const unreadCount = useMemo(() => myNotifications.filter((n) => !n.isRead).length, [myNotifications]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>个人中心</span>
            {unreadCount > 0 ? (
              <span className="text-xs px-3 py-1 rounded-full border border-foreground/20 text-foreground/80">
                未读：{unreadCount}
              </span>
            ) : null}
          </DialogTitle>
          <DialogDescription>
            查看我的帖子与消息（评论/点赞/系统通知）。
          </DialogDescription>
        </DialogHeader>

        {!currentUserId ? (
          <div className="py-6 text-sm text-muted-foreground">
            请先登录后再使用个人中心。
            <button className="ml-3 underline" onClick={onRequestLogin}>现在登录</button>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="home">主页</TabsTrigger>
              <TabsTrigger value="messages">消息</TabsTrigger>
              <TabsTrigger value="posts">我的帖子</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/10 p-4 flex items-center gap-3">
                <img
                  src={user?.avatarUrl}
                  alt={user?.username}
                  className="w-12 h-12 rounded-full img-grayscale"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-lg truncate">{user?.username}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Lv.{user?.level ?? 1} · 我的帖子：{myPosts.length}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-white p-4">
                <div className="text-sm font-medium mb-2">最新消息</div>
                {myNotifications.length === 0 ? (
                  <div className="text-sm text-muted-foreground">暂无消息。</div>
                ) : (
                  <div className="space-y-2">
                    {myNotifications.slice(0, 5).map((n) => (
                      <div key={n.id} className="rounded-xl border border-border/60 bg-background/60 p-3">
                        <div className="text-xs text-muted-foreground">
                          {n.type === 'like' ? '点赞' : n.type === 'reply' ? '回复' : n.type === 'comment' ? '评论' : '系统'} · {formatTimeAgo(n.createdAtISO)}
                          {!n.isRead ? <span className="ml-2 text-foreground/80">未读</span> : null}
                        </div>
                        <div className="text-sm mt-1 whitespace-pre-wrap">{n.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">消息列表</div>
                <div className="flex gap-2">
                  <button
                    className="pill-button"
                    style={{ borderRadius: 9999 }}
                    onClick={() => actions.markNotificationsRead(myNotifications.filter((n) => !n.isRead).map((n) => n.id))}
                    disabled={unreadCount === 0}
                  >
                    标记已读
                  </button>
                  <button
                    className="pill-button"
                    style={{ borderRadius: 9999 }}
                    onClick={() => actions.clearReadNotifications()}
                    disabled={myNotifications.filter((n) => n.isRead).length === 0}
                  >
                    清空已读
                  </button>
                </div>
              </div>

              {myNotifications.length === 0 ? (
                <div className="text-sm text-muted-foreground rounded-2xl border border-border/60 bg-muted/10 p-6">
                  暂无消息。你可以先发布帖子/评论，让别人互动后就会收到通知。
                </div>
              ) : (
                <div className="space-y-3">
                  {myNotifications.map((n) => (
                    <div key={n.id} className="rounded-2xl border border-border/60 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {n.type === 'like' ? '点赞' : n.type === 'reply' ? '回复' : n.type === 'comment' ? '评论' : '系统'} · {formatTimeAgo(n.createdAtISO)}
                            {!n.isRead ? <span className="ml-2 text-foreground/80">未读</span> : null}
                          </div>
                          <div className="text-sm mt-1 whitespace-pre-wrap">{n.content}</div>
                        </div>
                        {!n.isRead ? (
                          <button
                            className="text-xs underline"
                            onClick={() => actions.markNotificationsRead([n.id])}
                          >
                            标记
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="posts" className="mt-4 space-y-3">
              {myPosts.length === 0 ? (
                <div className="text-sm text-muted-foreground rounded-2xl border border-border/60 bg-muted/10 p-6">
                  你还没有发帖。
                </div>
              ) : (
                <div className="space-y-3">
                  {myPosts.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-border/60 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{p.title}</div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.excerpt}</div>
                        </div>
                        <button
                          className="pill-button"
                          style={{ borderRadius: 9999 }}
                          onClick={async () => {
                            if (!window.confirm('确定删除该帖子吗？')) return;
                            const res = await actions.deletePost(p.id);
                            if (!res.ok) alert(res.error ?? '删除失败');
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserCenterDialog;


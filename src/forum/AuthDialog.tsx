import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useForum } from './ForumProvider';

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { actions } = useForum();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      setUsername('');
      setPassword('');
      setTab('login');
    }
  }, [open]);

  const helperText = useMemo(() => {
    return '注册后即可发帖、评论、点赞';
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-xl">
        <DialogHeader>
          <DialogTitle>登录 / 注册</DialogTitle>
          <DialogDescription className="mt-1">{helperText}</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'register')} className="mt-4">
          <TabsList>
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                const res = await actions.login(username.trim(), password);
                if (!res.ok) setError(res.error ?? '登录失败');
                else onOpenChange(false);
              }}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="login-username">
                  用户名
                </label>
                <input
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="输入用户名"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="login-password">
                  密码
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="输入密码"
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="pill-button-filled flex-1"
                  style={{ borderRadius: 9999 }}
                >
                  登录
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                const res = await actions.register(username.trim(), password);
                if (!res.ok) setError(res.error ?? '注册失败');
                else onOpenChange(false);
              }}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="register-username">
                  用户名
                </label>
                <input
                  id="register-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="输入新用户名"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="register-password">
                  密码
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="设置密码"
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="pill-button-filled flex-1" style={{ borderRadius: 9999 }}>
                  注册完成
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;

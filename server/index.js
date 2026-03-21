const express = require('express');
const cors = require('cors');
const { pool, initDb } = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: '参数不完整' });

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: '用户不存在' });
  if (user.password !== password) return res.status(400).json({ error: '密码错误' });

  return res.json({ user });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: '参数不完整' });

  const [existsRows] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
  if (existsRows.length) return res.status(400).json({ error: '用户名已存在' });

  const id = `u-${username}`;
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
  const createdAtISO = new Date().toISOString();

  await pool.query(
    'INSERT INTO users (id, username, password, avatarUrl, level, createdAtISO) VALUES (?, ?, ?, ?, ?, ?)',
    [id, username, password, avatarUrl, 1, createdAtISO]
  );

  return res.json({
    user: { id, username, password, avatarUrl, level: 1, createdAtISO },
  });
});

app.get('/api/posts', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts ORDER BY createdAtISO DESC');
  const posts = rows.map((r) => ({
    id: r.id,
    categoryId: r.categoryId,
    title: r.title,
    content: r.content,
    excerpt: r.excerpt,
    game: r.game,
    coverImage: r.coverImage || undefined,
    tag: r.tag || undefined,
    audioDataUrl: r.audioDataUrl || undefined,
    audioFileName: r.audioFileName || undefined,
    authorId: r.authorId,
    createdAtISO: r.createdAtISO,
    stats: {
      views: r.views || 0,
      likes: r.likes || 0,
      comments: r.comments || 0,
    },
  }));
  return res.json({ posts });
});

app.post('/api/posts', async (req, res) => {
  const { categoryId, title, game, content, coverImage, tag, audioDataUrl, audioFileName, authorId } = req.body || {};
  if (!categoryId || !title || !game || !content || !authorId) {
    return res.status(400).json({ error: '参数不完整' });
  }

  const id = nextId('post');
  const createdAtISO = new Date().toISOString();
  const excerpt = content.length > 120 ? `${content.slice(0, 120)}...` : content;

  await pool.query(
    `INSERT INTO posts (id, categoryId, title, content, excerpt, game, coverImage, tag, audioDataUrl, audioFileName, authorId, createdAtISO, views, likes, comments)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
    [id, categoryId, title, content, excerpt, game, coverImage || null, tag || null, audioDataUrl || null, audioFileName || null, authorId, createdAtISO]
  );

  return res.json({
    post: {
      id,
      categoryId,
      title,
      content,
      excerpt,
      game,
      coverImage: coverImage || undefined,
      tag: tag || undefined,
      audioDataUrl: audioDataUrl || undefined,
      audioFileName: audioFileName || undefined,
      authorId,
      createdAtISO,
      stats: { views: 0, likes: 0, comments: 0 },
    },
  });
});

app.delete('/api/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body || {};
  const [rows] = await pool.query('SELECT authorId FROM posts WHERE id = ? LIMIT 1', [postId]);
  const post = rows[0];
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  if (post.authorId !== userId) return res.status(403).json({ error: '没有权限删除该帖子' });

  const [commentRows] = await pool.query('SELECT id FROM comments WHERE postId = ?', [postId]);
  const commentIds = commentRows.map((c) => c.id);
  if (commentIds.length) {
    await pool.query(`DELETE FROM replies WHERE commentId IN (${commentIds.map(() => '?').join(',')})`, commentIds);
  }
  await pool.query('DELETE FROM comments WHERE postId = ?', [postId]);
  await pool.query('DELETE FROM likes WHERE postId = ?', [postId]);
  await pool.query('DELETE FROM posts WHERE id = ?', [postId]);

  return res.json({ success: true });
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const [commentRows] = await pool.query('SELECT * FROM comments WHERE postId = ? ORDER BY createdAtISO ASC', [postId]);

  const comments = [];
  for (const c of commentRows) {
    const [replyRows] = await pool.query('SELECT * FROM replies WHERE commentId = ? ORDER BY createdAtISO ASC', [c.id]);
    comments.push({
      id: c.id,
      postId: c.postId,
      authorId: c.authorId,
      content: c.content,
      createdAtISO: c.createdAtISO,
      replies: replyRows.map((r) => ({
        id: r.id,
        commentId: r.commentId,
        authorId: r.authorId,
        content: r.content,
        createdAtISO: r.createdAtISO,
      })),
    });
  }

  return res.json({ comments });
});

app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { content, authorId } = req.body || {};
  if (!content || !authorId) return res.status(400).json({ error: '参数不完整' });

  const [postRows] = await pool.query('SELECT id, comments FROM posts WHERE id = ? LIMIT 1', [postId]);
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  const id = nextId('c');
  const createdAtISO = new Date().toISOString();
  await pool.query('INSERT INTO comments (id, postId, authorId, content, createdAtISO) VALUES (?, ?, ?, ?, ?)', [
    id,
    postId,
    authorId,
    content,
    createdAtISO,
  ]);

  await pool.query('UPDATE posts SET comments = ? WHERE id = ?', [Number(post.comments || 0) + 1, postId]);

  return res.json({
    comment: { id, postId, authorId, content, createdAtISO, replies: [] },
  });
});

app.post('/api/posts/:postId/comments/:commentId/replies', async (req, res) => {
  const { postId, commentId } = req.params;
  const { content, authorId } = req.body || {};
  if (!content || !authorId) return res.status(400).json({ error: '参数不完整' });

  const [commentRows] = await pool.query('SELECT id FROM comments WHERE id = ? AND postId = ? LIMIT 1', [commentId, postId]);
  const comment = commentRows[0];
  if (!comment) return res.status(404).json({ error: '评论不存在' });

  const id = nextId('r');
  const createdAtISO = new Date().toISOString();
  await pool.query('INSERT INTO replies (id, commentId, authorId, content, createdAtISO) VALUES (?, ?, ?, ?, ?)', [
    id,
    commentId,
    authorId,
    content,
    createdAtISO,
  ]);

  return res.json({
    comment: { id: commentId },
  });
});

app.post('/api/posts/:postId/like', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: '参数不完整' });

  const [existsRows] = await pool.query('SELECT postId FROM likes WHERE postId = ? AND userId = ? LIMIT 1', [postId, userId]);
  const exists = !!existsRows.length;

  const [postRows] = await pool.query('SELECT likes FROM posts WHERE id = ? LIMIT 1', [postId]);
  const post = postRows[0];
  if (!post) return res.status(404).json({ error: '帖子不存在' });

  if (exists) {
    await pool.query('DELETE FROM likes WHERE postId = ? AND userId = ?', [postId, userId]);
    await pool.query('UPDATE posts SET likes = ? WHERE id = ?', [Math.max(0, Number(post.likes || 0) - 1), postId]);
    return res.json({ liked: false });
  }

  await pool.query('INSERT INTO likes (postId, userId, createdAtISO) VALUES (?, ?, ?)', [
    postId,
    userId,
    new Date().toISOString(),
  ]);
  await pool.query('UPDATE posts SET likes = ? WHERE id = ?', [Number(post.likes || 0) + 1, postId]);
  return res.json({ liked: true });
});

app.get('/api/likes', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM likes');
  return res.json({ likes: rows });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: '服务器内部错误' });
});

(async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`API 服务已启动: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('数据库初始化失败，请先填写 server/db.js 里的数据库配置', error);
    process.exit(1);
  }
})();

const mysql = require('mysql2/promise');

/**
 * ========================= 线上部署请填写这里 =========================
 * DB_HOST: MySQL 主机地址
 * DB_PORT: MySQL 端口
 * DB_USER: MySQL 用户名
 * DB_PASSWORD: MySQL 密码
 * DB_NAME: MySQL 库名
 * ====================================================================
 */
const DB_CONFIG = {
  host: process.env.DB_HOST || '请填写你的MySQL主机',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || '请填写你的MySQL用户名',
  password: process.env.DB_PASSWORD || '请填写你的MySQL密码',
  database: process.env.DB_NAME || '请填写你的MySQL库名',
  connectionLimit: 10,
};

const pool = mysql.createPool(DB_CONFIG);

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      username VARCHAR(64) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      avatarUrl VARCHAR(512) NOT NULL,
      level INT DEFAULT 1,
      createdAtISO VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(64) PRIMARY KEY,
      categoryId VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      excerpt VARCHAR(512) NOT NULL,
      game VARCHAR(128) NOT NULL,
      coverImage VARCHAR(1024) NULL,
      tag VARCHAR(64) NULL,
      audioDataUrl LONGTEXT NULL,
      audioFileName VARCHAR(255) NULL,
      authorId VARCHAR(64) NOT NULL,
      createdAtISO VARCHAR(64) NOT NULL,
      views INT DEFAULT 0,
      likes INT DEFAULT 0,
      comments INT DEFAULT 0,
      INDEX idx_posts_createdAtISO (createdAtISO)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id VARCHAR(64) PRIMARY KEY,
      postId VARCHAR(64) NOT NULL,
      authorId VARCHAR(64) NOT NULL,
      content TEXT NOT NULL,
      createdAtISO VARCHAR(64) NOT NULL,
      INDEX idx_comments_postId (postId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS replies (
      id VARCHAR(64) PRIMARY KEY,
      commentId VARCHAR(64) NOT NULL,
      authorId VARCHAR(64) NOT NULL,
      content TEXT NOT NULL,
      createdAtISO VARCHAR(64) NOT NULL,
      INDEX idx_replies_commentId (commentId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS likes (
      postId VARCHAR(64) NOT NULL,
      userId VARCHAR(64) NOT NULL,
      createdAtISO VARCHAR(64) NOT NULL,
      PRIMARY KEY (postId, userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

module.exports = {
  pool,
  initDb,
};

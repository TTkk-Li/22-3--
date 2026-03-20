// 模拟数据库 - 使用localStorage持久化数据
class ForumData {
  constructor() {
    // 初始化数据结构
    this.initData();
  }

  // 初始化默认数据
  initData() {
    // 用户数据
    if (!localStorage.getItem('forumUsers')) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: '123456', avatar: 'images/default-avatar.png', role: 'admin' },
        { id: 2, username: 'testuser', password: '123456', avatar: 'images/default-avatar.png', role: 'user' }
      ];
      localStorage.setItem('forumUsers', JSON.stringify(defaultUsers));
    }

    // 版块数据
    if (!localStorage.getItem('forumCategories')) {
      const defaultCategories = [
        { id: 1, name: '热门网游', icon: 'fas fa-gamepad', postCount: 0 },
        { id: 2, name: '单机游戏', icon: 'fas fa-laptop', postCount: 0 },
        { id: 3, name: '手机游戏', icon: 'fas fa-mobile-alt', postCount: 0 },
        { id: 4, name: '电竞赛事', icon: 'fas fa-trophy', postCount: 0 },
        { id: 5, name: '游戏攻略', icon: 'fas fa-headset', postCount: 0 },
        { id: 6, name: '闲聊杂谈', icon: 'fas fa-comment-alt', postCount: 0 },
        { id: 7, name: '交易专区', icon: 'fas fa-shopping-cart', postCount: 0 },
        { id: 8, name: '问题求助', icon: 'fas fa-question-circle', postCount: 0 }
      ];
      localStorage.setItem('forumCategories', JSON.stringify(defaultCategories));
    }

    // 帖子数据
    if (!localStorage.getItem('forumPosts')) {
      localStorage.setItem('forumPosts', JSON.stringify([]));
    }

    // 评论数据
    if (!localStorage.getItem('forumComments')) {
      localStorage.setItem('forumComments', JSON.stringify([]));
    }

    // 当前登录用户
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(null));
    }
  }

  // ========== 用户相关方法 ==========
  // 用户登录
  login(username, password) {
    const users = JSON.parse(localStorage.getItem('forumUsers'));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  // 用户注册
  register(username, password) {
    const users = JSON.parse(localStorage.getItem('forumUsers'));
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }

    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      password,
      avatar: 'images/default-avatar.png',
      role: 'user'
    };
    
    users.push(newUser);
    localStorage.setItem('forumUsers', JSON.stringify(users));
    
    return { success: true, message: '注册成功' };
  }

  // 退出登录
  logout() {
    localStorage.setItem('currentUser', JSON.stringify(null));
  }

  // 获取当前登录用户
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  // ========== 版块相关方法 ==========
  // 获取所有版块
  getCategories() {
    return JSON.parse(localStorage.getItem('forumCategories'));
  }

  // 更新版块帖子数
  updateCategoryPostCount(categoryId, increment = 1) {
    const categories = JSON.parse(localStorage.getItem('forumCategories'));
    const category = categories.find(c => c.id === parseInt(categoryId));
    if (category) {
      category.postCount += increment;
      localStorage.setItem('forumCategories', JSON.stringify(categories));
    }
    return categories;
  }

  // ========== 帖子相关方法 ==========
  // 获取所有帖子
  getPosts() {
    return JSON.parse(localStorage.getItem('forumPosts'));
  }

  // 获取单个帖子
  getPostById(postId) {
    const posts = JSON.parse(localStorage.getItem('forumPosts'));
    return posts.find(p => p.id === parseInt(postId));
  }

  // 添加新帖子
  addPost(postData) {
    const posts = JSON.parse(localStorage.getItem('forumPosts'));
    
    const newPost = {
      id: posts.length + 1,
      title: postData.title,
      categoryId: parseInt(postData.categoryId),
      categoryName: postData.categoryName,
      content: postData.content,
      userId: postData.userId,
      username: postData.username,
      avatar: postData.avatar,
      createTime: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      files: postData.files || []
    };
    
    posts.push(newPost);
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    
    // 更新对应版块的帖子数
    this.updateCategoryPostCount(postData.categoryId, 1);
    
    return newPost;
  }

  // 更新帖子浏览量
  updatePostViewCount(postId) {
    const posts = JSON.parse(localStorage.getItem('forumPosts'));
    const postIndex = posts.findIndex(p => p.id === parseInt(postId));
    if (postIndex !== -1) {
      posts[postIndex].viewCount += 1;
      localStorage.setItem('forumPosts', JSON.stringify(posts));
      return posts[postIndex];
    }
    return null;
  }

  // 更新帖子点赞数
  updatePostLikeCount(postId, increment = 1) {
    const posts = JSON.parse(localStorage.getItem('forumPosts'));
    const postIndex = posts.findIndex(p => p.id === parseInt(postId));
    if (postIndex !== -1) {
      posts[postIndex].likeCount += increment;
      localStorage.setItem('forumPosts', JSON.stringify(posts));
      return posts[postIndex];
    }
    return null;
  }

  // ========== 评论相关方法 ==========
  // 添加评论
  addComment(commentData) {
    const comments = JSON.parse(localStorage.getItem('forumComments'));
    const posts = JSON.parse(localStorage.getItem('forumPosts'));
    
    const newComment = {
      id: comments.length + 1,
      postId: parseInt(commentData.postId),
      userId: commentData.userId,
      username: commentData.username,
      avatar: commentData.avatar,
      content: commentData.content,
      createTime: new Date().toISOString()
    };
    
    comments.push(newComment);
    localStorage.setItem('forumComments', JSON.stringify(comments));
    
    // 更新帖子评论数
    const postIndex = posts.findIndex(p => p.id === parseInt(commentData.postId));
    if (postIndex !== -1) {
      posts[postIndex].commentCount += 1;
      localStorage.setItem('forumPosts', JSON.stringify(posts));
    }
    
    return newComment;
  }

  // 获取帖子的所有评论
  getCommentsByPostId(postId) {
    const comments = JSON.parse(localStorage.getItem('forumComments'));
    return comments.filter(c => c.postId === parseInt(postId));
  }
}

// 实例化数据管理器
const forumData = new ForumData();
// 首页脚本
document.addEventListener('DOMContentLoaded', function() {
  // 初始化数据管理器
  // 渲染左侧版块侧边栏
  renderSidebarCategories();
  
  // 渲染精选内容（观看量最高的帖子）
  renderFeaturedContent();
  
  // 渲染帖子列表
  renderPostList();
  
  // 更新用户登录状态
  updateNavUserStatus();
  
  // 更新侧边栏用户卡片
  updateSidebarUserCard();
});

// 渲染左侧版块侧边栏 - 修复版
function renderSidebarCategories() {
  const categories = forumData.getCategories();
  const sidebarList = document.getElementById('sidebar-categories-list');
  
  if (!sidebarList) {
    console.error('侧边栏容器不存在');
    return;
  }
  
  sidebarList.innerHTML = '';
  
  categories.forEach(category => {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'sidebar-category-item';
    categoryItem.innerHTML = `
      <i class="${category.icon} icon"></i>
      <div class="info">
        <div class="name">${category.name}</div>
        <div class="count">帖子数：${category.postCount}</div>
      </div>
    `;
    sidebarList.appendChild(categoryItem);
    
    // 添加点击事件
    categoryItem.addEventListener('click', function() {
      alert(`查看【${category.name}】版块的帖子`);
    });
  });
}

// 渲染精选内容（观看量最高的帖子）
function renderFeaturedContent() {
  const posts = forumData.getPosts();
  const featuredList = document.getElementById('featured-list');
  
  if (!featuredList) return;
  
  featuredList.innerHTML = '';
  
  if (posts.length === 0) {
    // 无帖子时显示占位内容
    for (let i = 0; i < 3; i++) {
      const placeholderItem = document.createElement('div');
      placeholderItem.className = 'featured-item';
      placeholderItem.innerHTML = `
        <img src="https://picsum.photos/400/220?random=${i+1}" alt="精选内容">
        <div class="title">暂无热门帖子</div>
        <div class="view-count"><i class="fas fa-eye"></i> 0</div>
      `;
      featuredList.appendChild(placeholderItem);
    }
    return;
  }
  
  // 按观看量排序，取前3个
  const sortedPosts = [...posts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
  
  sortedPosts.forEach((post, index) => {
    const featuredItem = document.createElement('div');
    featuredItem.className = 'featured-item';
    featuredItem.innerHTML = `
      <img src="https://picsum.photos/400/220?random=${post.id}" alt="${post.title}">
      <div class="title">${post.title}</div>
      <div class="view-count"><i class="fas fa-eye"></i> ${post.viewCount}</div>
    `;
    
    // 添加点击事件，跳转到帖子详情
    featuredItem.addEventListener('click', function() {
      window.location.href = `post-detail.html?id=${post.id}`;
    });
    
    featuredList.appendChild(featuredItem);
  });
}

// 渲染帖子列表
function renderPostList() {
  const posts = forumData.getPosts();
  const postContainer = document.getElementById('post-list-container');
  const paginationContainer = document.getElementById('pagination-container');
  
  if (!postContainer || !paginationContainer) return;

  // 清空容器
  postContainer.innerHTML = '';
  paginationContainer.innerHTML = '';
  
  if (posts.length === 0) {
    // 无任何帖子时显示提示
    postContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-alt"></i>
        <p>暂无帖子</p>
        <p class="sub-text">快来发布第一个帖子吧！</p>
        <a href="login.html" class="btn btn-primary">登录发布</a>
      </div>
    `;
    return;
  }
  
  // 倒序显示（最新的在前）
  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
  
  // 渲染帖子
  sortedPosts.forEach(post => {
    // 格式化时间
    const createTime = new Date(post.createTime);
    const timeStr = `${createTime.getFullYear()}-${(createTime.getMonth()+1).toString().padStart(2, '0')}-${createTime.getDate().toString().padStart(2, '0')} ${createTime.getHours().toString().padStart(2, '0')}:${createTime.getMinutes().toString().padStart(2, '0')}`;
    
    const postItem = document.createElement('div');
    postItem.className = 'post-item';
    postItem.innerHTML = `
      <div class="post-avatar">
        <img src="${post.avatar}" alt="${post.username}">
      </div>
      <div class="post-content">
        <div class="post-title">
          <a href="post-detail.html?id=${post.id}">${post.title}</a>
        </div>
        <div class="post-desc">
          ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}
        </div>
        <div class="post-meta">
          <span><i class="fas fa-user"></i> ${post.username}</span>
          <span><i class="fas fa-clock"></i> ${timeStr}</span>
          <span><i class="fas fa-eye"></i> ${post.viewCount}</span>
          <span><i class="fas fa-thumbs-up"></i> ${post.likeCount}</span>
          <span><i class="fas fa-comment"></i> ${post.commentCount}</span>
        </div>
      </div>
    `;
    
    postContainer.appendChild(postItem);
  });
  
  // 渲染分页
  paginationContainer.innerHTML = `
    <li class="active"><a href="#">1</a></li>
  `;
}
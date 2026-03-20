// 首页脚本
document.addEventListener('DOMContentLoaded', function() {
  // 初始化数据管理器
  // 渲染左侧版块侧边栏
  renderSidebarCategories();
  
  // 渲染帖子列表（无僵尸帖）
  renderPostList();
  
  // 模拟精选内容轮播
  initFeaturedCarousel();
  
  // 更新用户登录状态
  updateNavUserStatus();
  
  // 更新侧边栏用户卡片
  updateSidebarUserCard();
});

// 渲染左侧版块侧边栏
function renderSidebarCategories() {
  const categories = forumData.getCategories();
  const sidebarList = document.getElementById('sidebar-categories-list');
  
  if (sidebarList) {
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
        // 可以在这里实现按版块筛选帖子
        alert(`查看【${category.name}】版块的帖子`);
      });
    });
  }
}

// 渲染帖子列表（仅显示用户创建的真实帖子）
function renderPostList() {
  const posts = forumData.getPosts();
  const postContainer = document.getElementById('post-list-container');
  const paginationContainer = document.getElementById('pagination-container');
  
  if (postContainer) {
    // 清空容器
    postContainer.innerHTML = '';
    paginationContainer.innerHTML = '';
    
    if (posts.length === 0) {
      // 无任何帖子时显示提示
      postContainer.innerHTML = `
        <div style="text-align:center;padding:50px;color:#999;">
          <i class="fas fa-file-alt" style="font-size:60px;margin-bottom:20px;"></i>
          <p style="font-size:18px;margin-bottom:10px;">暂无帖子</p>
          <p style="font-size:14px;margin-bottom:20px;">快来发布第一个帖子吧！</p>
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
    
    // 渲染分页（简单实现）
    paginationContainer.innerHTML = `
      <li class="active"><a href="#">1</a></li>
    `;
  }
}

// 初始化精选内容轮播
function initFeaturedCarousel() {
  const featuredItems = document.querySelectorAll('.featured-item');
  let currentIndex = 0;

  if (featuredItems.length > 0) {
    // 自动切换精选内容高亮
    setInterval(() => {
      featuredItems[currentIndex].style.opacity = '0.7';
      currentIndex = (currentIndex + 1) % featuredItems.length;
      featuredItems[currentIndex].style.opacity = '1';
    }, 3000);

    // 初始化设置第一个精选内容高亮
    featuredItems.forEach((item, index) => {
      item.style.opacity = index === 0 ? '1' : '0.7';
      item.style.transition = 'opacity 0.5s';
    });
  }
}
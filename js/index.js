// 首页脚本
document.addEventListener('DOMContentLoaded', function() {
  // 初始化数据管理器
  // 渲染版块分类（带动态帖子数）
  renderCategories();
  
  // 渲染帖子列表
  renderPostList();
  
  // 模拟精选内容轮播
  initFeaturedCarousel();
  
  // 更新用户登录状态
  updateNavUserStatus();
});

// 渲染版块分类
function renderCategories() {
  const categories = forumData.getCategories();
  const categoriesList = document.querySelector('.categories-list');
  
  if (categoriesList) {
    categoriesList.innerHTML = '';
    
    categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item card';
      categoryItem.innerHTML = `
        <div class="icon"><i class="${category.icon}"></i></div>
        <div class="name">${category.name}</div>
        <div class="count">帖子数：${category.postCount}</div>
      `;
      categoriesList.appendChild(categoryItem);
      
      // 添加点击事件
      categoryItem.addEventListener('click', function() {
        // 可以跳转到对应版块的帖子列表页
        alert(`进入【${category.name}】版块`);
      });
    });
  }
}

// 渲染帖子列表
function renderPostList() {
  const posts = forumData.getPosts();
  const postListContainer = document.querySelector('.post-main .card .card-body');
  
  if (postListContainer) {
    // 清空原有静态内容
    postListContainer.innerHTML = '';
    
    if (posts.length === 0) {
      // 无帖子时显示提示
      postListContainer.innerHTML = `
        <div style="text-align:center;padding:20px;color:#999;">
          <i class="fas fa-file-alt" style="font-size:40px;margin-bottom:10px;"></i>
          <p>暂无帖子，快来发布第一个帖子吧！</p>
        </div>
      `;
      return;
    }
    
    // 倒序显示（最新的在前）
    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
    
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
      
      postListContainer.appendChild(postItem);
    });
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
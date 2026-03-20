// 首页脚本
document.addEventListener('DOMContentLoaded', function() {
  // 模拟精选内容轮播（简单实现）
  const featuredItems = document.querySelectorAll('.featured-item');
  let currentIndex = 0;

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

  // 版块分类点击效果
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
  });
});
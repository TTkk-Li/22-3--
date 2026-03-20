// 通用功能脚本
document.addEventListener('DOMContentLoaded', function() {
  // 搜索功能
  const searchBtn = document.querySelector('.search-btn');
  const searchInput = document.querySelector('.search-input');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      const keyword = searchInput.value.trim();
      if (keyword) {
        alert(`正在搜索：${keyword}`);
        // 实际项目中这里会跳转到搜索结果页
      } else {
        alert('请输入搜索关键词');
      }
    });

    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  }

  // 导航栏滚动效果
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.style.backgroundColor = '#1a2530';
      nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    } else {
      nav.style.backgroundColor = '#2c3e50';
      nav.style.boxShadow = 'none';
    }
  });
});
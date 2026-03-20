// 帖子详情页脚本
document.addEventListener('DOMContentLoaded', function() {
  const commentBtn = document.getElementById('comment-btn');
  const commentContent = document.getElementById('comment-content');
  const commentList = document.getElementById('comment-list');

  // 发表评论
  commentBtn.addEventListener('click', function() {
    const content = commentContent.value.trim();
    
    if (!content) {
      alert('请输入评论内容');
      commentContent.focus();
      return;
    }

    // 创建新评论
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    
    const now = new Date();
    const timeStr = formatTime(now);
    
    commentItem.innerHTML = `
      <div class="comment-avatar">
        <img src="images/default-avatar.png" alt="用户头像">
      </div>
      <div class="comment-content">
        <div class="comment-user">游客</div>
        <div class="comment-text">${content}</div>
        <div class="comment-time">${timeStr}</div>
      </div>
    `;

    // 添加到评论列表顶部
    commentList.insertBefore(commentItem, commentList.firstChild);
    
    // 清空评论框
    commentContent.value = '';
    
    // 提示成功
    alert('评论发表成功！');
  });

  // 回车发表评论
  commentContent.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commentBtn.click();
    }
  });
});
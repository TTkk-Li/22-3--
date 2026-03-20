// 帖子详情页脚本
document.addEventListener('DOMContentLoaded', function() {
  // 更新用户登录状态
  updateNavUserStatus();
  
  // 获取URL中的帖子ID
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (!postId) {
    alert('无效的帖子ID');
    window.location.href = 'index.html';
    return;
  }
  
  // 获取帖子详情
  const post = forumData.getPostById(postId);
  if (!post) {
    alert('帖子不存在');
    window.location.href = 'index.html';
    return;
  }
  
  // 更新帖子浏览量
  const updatedPost = forumData.updatePostViewCount(postId);
  
  // 渲染帖子详情
  renderPostDetail(updatedPost);
  
  // 渲染评论列表
  renderComments(postId);
  
  const commentBtn = document.getElementById('comment-btn');
  const commentContent = document.getElementById('comment-content');
  const commentList = document.getElementById('comment-list');

  // 发表评论
  commentBtn.addEventListener('click', function() {
    // 检查登录状态
    if (!checkLogin()) return;
    
    const content = commentContent.value.trim();
    const currentUser = forumData.getCurrentUser();
    
    if (!content) {
      alert('请输入评论内容');
      commentContent.focus();
      return;
    }

    // 构建评论数据
    const commentData = {
      postId: postId,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: content
    };
    
    // 添加评论
    forumData.addComment(commentData);
    
    // 重新渲染评论列表
    renderComments(postId);
    
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
  
  // 点赞功能
  initLikeFunction(postId);
});

// 渲染帖子详情
function renderPostDetail(post) {
  // 格式化时间
  const createTime = new Date(post.createTime);
  const timeStr = `${createTime.getFullYear()}-${(createTime.getMonth()+1).toString().padStart(2, '0')}-${createTime.getDate().toString().padStart(2, '0')} ${createTime.getHours().toString().padStart(2, '0')}:${createTime.getMinutes().toString().padStart(2, '0')}`;
  
  // 更新标题
  document.title = `${post.title} - GameForum`;
  
  // 更新帖子标题
  const postTitle = document.querySelector('.post-detail-title');
  if (postTitle) {
    postTitle.textContent = post.title;
  }
  
  // 更新帖子元信息
  const postMeta = document.querySelector('.post-detail-meta');
  if (postMeta) {
    postMeta.innerHTML = `
      <span><i class="fas fa-user"></i> ${post.username}</span>
      <span><i class="fas fa-clock"></i> ${timeStr}</span>
      <span><i class="fas fa-eye"></i> <span id="view-count">${post.viewCount}</span></span>
      <span><i class="fas fa-thumbs-up"></i> <span id="like-count">${post.likeCount}</span> <button id="like-btn" class="btn btn-primary" style="padding:4px 8px;margin-left:5px;">点赞</button></span>
      <span><i class="fas fa-comment"></i> ${post.commentCount}</span>
      <span><i class="fas fa-folder"></i> ${post.categoryName}</span>
    `;
  }
  
  // 更新帖子内容
  const postBody = document.querySelector('.post-detail-body');
  if (postBody) {
    // 简单的换行处理
    const contentWithBr = post.content.replace(/\n/g, '<br>');
    postBody.innerHTML = contentWithBr;
    
    // 如果有上传的文件，可以在这里添加文件预览
    if (post.files && post.files.length > 0) {
      let filesHtml = '<div style="margin-top:20px;"><h4>附件：</h4><div style="display:flex;flex-wrap:wrap;gap:10px;">';
      
      post.files.forEach(file => {
        if (file.type === 'image') {
          filesHtml += `<img src="images/default-file.png" alt="${file.name}" style="max-width:200px;max-height:200px;">`;
        } else if (file.type === 'video') {
          filesHtml += `<video controls style="max-width:200px;max-height:200px;">您的浏览器不支持视频播放</video>`;
        } else {
          filesHtml += `
            <div style="width:100px;height:100px;border:1px solid #eee;display:flex;align-items:center;justify-content:center;flex-direction:column;">
              <i class="fas fa-file"></i>
              <span style="font-size:12px;">${file.name}</span>
            </div>
          `;
        }
      });
      
      filesHtml += '</div></div>';
      postBody.innerHTML += filesHtml;
    }
  }
}

// 渲染评论列表
function renderComments(postId) {
  const comments = forumData.getCommentsByPostId(postId);
  const commentList = document.getElementById('comment-list');
  
  if (commentList) {
    commentList.innerHTML = '';
    
    if (comments.length === 0) {
      commentList.innerHTML = `
        <div style="text-align:center;padding:20px;color:#999;">
          暂无评论，快来发表第一条评论吧！
        </div>
      `;
      return;
    }
    
    // 倒序显示评论
    const sortedComments = [...comments].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    
    sortedComments.forEach(comment => {
      // 格式化时间
      const createTime = new Date(comment.createTime);
      const timeStr = `${createTime.getFullYear()}-${(createTime.getMonth()+1).toString().padStart(2, '0')}-${createTime.getDate().toString().padStart(2, '0')} ${createTime.getHours().toString().padStart(2, '0')}:${createTime.getMinutes().toString().padStart(2, '0')}`;
      
      const commentItem = document.createElement('div');
      commentItem.className = 'comment-item';
      commentItem.innerHTML = `
        <div class="comment-avatar">
          <img src="${comment.avatar}" alt="${comment.username}">
        </div>
        <div class="comment-content">
          <div class="comment-user">${comment.username}</div>
          <div class="comment-text">${comment.content}</div>
          <div class="comment-time">${timeStr}</div>
        </div>
      `;
      
      commentList.appendChild(commentItem);
    });
  }
}

// 初始化点赞功能
function initLikeFunction(postId) {
  setTimeout(() => {
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    
    if (likeBtn) {
      likeBtn.addEventListener('click', function() {
        // 更新点赞数
        const updatedPost = forumData.updatePostLikeCount(postId, 1);
        
        // 更新显示
        likeCount.textContent = updatedPost.likeCount;
        
        // 禁用点赞按钮（防止重复点赞）
        likeBtn.disabled = true;
        likeBtn.textContent = '已点赞';
        likeBtn.style.backgroundColor = '#999';
        
        alert('点赞成功！');
      });
    }
  }, 100);
}
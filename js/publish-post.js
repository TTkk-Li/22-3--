// 发帖页面脚本
document.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态
  if (!checkLogin()) return;
  
  const currentUser = forumData.getCurrentUser();
  
  // 初始化版块下拉框
  initCategorySelect();
  
  const fileInput = document.getElementById('file-input');
  const uploadArea = document.getElementById('upload-area');
  const previewList = document.getElementById('preview-list');
  const publishBtn = document.getElementById('publish-btn');
  const postTitle = document.getElementById('post-title');
  const postCategory = document.getElementById('post-category');
  const postContent = document.getElementById('post-content');

  // 存储上传的文件
  let uploadedFiles = [];

  // 点击上传区域触发文件选择
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });

  // 拖拽上传
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#3498db';
  });

  uploadArea.addEventListener('dragleave', function() {
    uploadArea.style.borderColor = '#ddd';
  });

  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  // 文件选择后处理
  fileInput.addEventListener('change', function() {
    const files = this.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  /**
   * 初始化版块下拉框
   */
  function initCategorySelect() {
    const categories = forumData.getCategories();
    postCategory.innerHTML = '<option value="">请选择版块</option>';
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      postCategory.appendChild(option);
    });
  }

  /**
   * 处理上传的文件
   * @param {FileList} files - 文件列表
   */
  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 验证文件大小
      if (!validateFileSize(file)) {
        alert(`文件${file.name}超过10MB，请选择更小的文件`);
        continue;
      }

      // 生成预览
      const fileType = getFileType(file);
      const previewUrl = createPreviewUrl(file);
      
      // 创建预览项
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      previewItem.dataset.index = uploadedFiles.length;
      
      if (fileType === 'image') {
        previewItem.innerHTML = `
          <img src="${previewUrl}" alt="${file.name}">
          <span class="delete-btn" data-index="${uploadedFiles.length}">×</span>
        `;
      } else if (fileType === 'video') {
        previewItem.innerHTML = `
          <video src="${previewUrl}" controls></video>
          <span class="delete-btn" data-index="${uploadedFiles.length}">×</span>
        `;
      } else {
        previewItem.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;">
            <i class="fas fa-file" style="font-size:30px;margin-bottom:10px;"></i>
            <span style="font-size:12px;word-break:break-all;">${file.name}</span>
          </div>
          <span class="delete-btn" data-index="${uploadedFiles.length}">×</span>
        `;
      }

      // 添加到预览列表
      previewList.appendChild(previewItem);
      
      // 存储文件信息
      uploadedFiles.push({
        file: file,
        previewUrl: previewUrl,
        type: fileType
      });

      // 删除按钮事件
      previewItem.querySelector('.delete-btn').addEventListener('click', function() {
        const index = this.dataset.index;
        // 移除预览项
        previewItem.remove();
        // 释放URL
        URL.revokeObjectURL(uploadedFiles[index].previewUrl);
        // 从数组中移除
        uploadedFiles.splice(index, 1);
        // 更新所有预览项的索引
        updatePreviewIndexes();
      });
    }
  }

  /**
   * 更新预览项索引
   */
  function updatePreviewIndexes() {
    const previewItems = previewList.querySelectorAll('.preview-item');
    previewItems.forEach((item, index) => {
      item.dataset.index = index;
      item.querySelector('.delete-btn').dataset.index = index;
    });
  }

  // 发布按钮点击事件
  publishBtn.addEventListener('click', function() {
    // 表单验证
    if (postTitle.value.trim().length < 5) {
      alert('帖子标题不少于5个字');
      postTitle.focus();
      return;
    }

    if (!postCategory.value) {
      alert('请选择帖子版块');
      postCategory.focus();
      return;
    }

    if (postContent.value.trim().length < 10) {
      alert('帖子内容不少于10个字');
      postContent.focus();
      return;
    }

    // 获取版块名称
    const categories = forumData.getCategories();
    const category = categories.find(c => c.id === parseInt(postCategory.value));
    
    // 构建帖子数据
    const postData = {
      title: postTitle.value.trim(),
      categoryId: postCategory.value,
      categoryName: category.name,
      content: postContent.value.trim(),
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      files: uploadedFiles.map(file => ({
        name: file.file.name,
        type: file.type,
        size: file.file.size
      }))
    };
    
    // 添加帖子到数据存储
    forumData.addPost(postData);
    
    // 提示成功
    alert('帖子发布成功！');
    
    // 跳转到首页
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });
});
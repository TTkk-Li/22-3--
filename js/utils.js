// 工具函数
/**
 * 格式化时间
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 文件类型判断
 * @param {File} file - 文件对象
 * @returns {string} 文件类型（image/video/file）
 */
function getFileType(file) {
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type.startsWith('video/')) {
    return 'video';
  } else {
    return 'file';
  }
}

/**
 * 生成文件预览URL
 * @param {File} file - 文件对象
 * @returns {string} 预览URL
 */
function createPreviewUrl(file) {
  return URL.createObjectURL(file);
}

/**
 * 验证文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSize - 最大大小（MB）
 * @returns {boolean} 是否符合大小要求
 */
function validateFileSize(file, maxSize = 10) {
  const fileSize = file.size / 1024 / 1024; // 转换为MB
  return fileSize <= maxSize;
}
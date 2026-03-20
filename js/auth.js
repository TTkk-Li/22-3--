// 登录注册功能
document.addEventListener('DOMContentLoaded', function() {
  // 登录表单处理
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const errorTip = document.getElementById('login-error');
      
      // 验证输入
      if (!username || !password) {
        errorTip.textContent = '请输入用户名和密码';
        errorTip.style.display = 'block';
        return;
      }
      
      // 调用登录方法
      const user = forumData.login(username, password);
      
      if (user) {
        // 登录成功
        errorTip.style.display = 'none';
        alert('登录成功！');
        window.location.href = 'index.html';
      } else {
        // 登录失败
        errorTip.textContent = '用户名或密码错误';
        errorTip.style.display = 'block';
      }
    });
  }

  // 注册表单处理
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value.trim();
      const confirmPwd = document.getElementById('reg-confirm-pwd').value.trim();
      const errorTip = document.getElementById('register-error');
      const successTip = document.getElementById('register-success');
      
      // 验证输入
      errorTip.style.display = 'none';
      successTip.style.display = 'none';
      
      if (!username || !password) {
        errorTip.textContent = '请输入用户名和密码';
        errorTip.style.display = 'block';
        return;
      }
      
      if (password.length < 6) {
        errorTip.textContent = '密码长度不能少于6位';
        errorTip.style.display = 'block';
        return;
      }
      
      if (password !== confirmPwd) {
        errorTip.textContent = '两次输入的密码不一致';
        errorTip.style.display = 'block';
        return;
      }
      
      // 调用注册方法
      const result = forumData.register(username, password);
      
      if (result.success) {
        successTip.textContent = result.message;
        successTip.style.display = 'block';
        // 3秒后跳转到登录页
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3000);
      } else {
        errorTip.textContent = result.message;
        errorTip.style.display = 'block';
      }
    });
  }

  // 导航栏用户状态更新
  updateNavUserStatus();
});

// 更新导航栏用户状态
function updateNavUserStatus() {
  const currentUser = forumData.getCurrentUser();
  const navList = document.querySelector('.nav-list');
  
  if (navList) {
    const userItem = navList.querySelector('li:last-child');
    
    if (currentUser) {
      // 已登录状态
      userItem.innerHTML = `
        <a href="#"><i class="fas fa-user-circle"></i> ${currentUser.username}</a>
        <ul class="user-dropdown" style="display:none;position:absolute;background:#2c3e50;padding:10px;border-radius:4px;">
          <li style="margin:5px 0;"><a href="#" onclick="logout()">退出登录</a></li>
        </ul>
      `;
      
      // 下拉菜单效果
      userItem.addEventListener('mouseenter', function() {
        this.querySelector('.user-dropdown').style.display = 'block';
      });
      
      userItem.addEventListener('mouseleave', function() {
        this.querySelector('.user-dropdown').style.display = 'none';
      });
      
      // 更新侧边栏用户信息
      updateSidebarUserInfo(currentUser);
    } else {
      // 未登录状态
      userItem.innerHTML = `
        <a href="login.html"><i class="fas fa-user-circle"></i> 登录/注册</a>
      `;
    }
  }
}

// 更新侧边栏用户信息
function updateSidebarUserInfo(user) {
  const sidebarUser = document.querySelector('.sidebar-user');
  if (sidebarUser) {
    sidebarUser.innerHTML = `
      <img src="${user.avatar}" alt="${user.username}" class="avatar">
      <div class="name">${user.username}</div>
      <div class="desc">${user.role === 'admin' ? '管理员' : '游戏爱好者'}</div>
      <a href="publish-post.html" class="btn btn-primary publish-btn">发布帖子</a>
    `;
  }
}

// 退出登录
function logout() {
  forumData.logout();
  alert('退出登录成功！');
  window.location.href = 'index.html';
}

// 检查用户是否登录
function checkLogin() {
  const currentUser = forumData.getCurrentUser();
  if (!currentUser) {
    alert('请先登录！');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
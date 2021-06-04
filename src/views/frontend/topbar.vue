<template>
  <div class="nav">
    <div class="project-icon">
      <i class=" el-icon-school" />
    </div>
    <h3>
      房屋租赁信息网站
    </h3>
    <div class="login-btn">
      <template v-if="name">
          <span class="welcome">欢迎你，
          <router-link to="/user/profile">
            <span class="username">{{ name }}</span>
          </router-link>
        </span>
        <a href="/backend/dashboard">
          <el-button>管理页面</el-button>
        </a>
      </template>
      <template v-else>
        <div class="welcome" style="line-height: 35px;">
          你还未登录。
          <router-link to="/backend/dashboard">
            <span class="username">请登录</span>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Topbar',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style scoped>
  .nav {
    position: relative;
    width: 100%;
    height: 50px;
    background-color: #7773a0;
  }
  .nav h3 {
    padding: 0;
    margin: 0;
    color: #fff;
    font-size: 20px;
    padding-top: 15px;
    padding-left: 100px;
  }
  .nav .project-icon {
    position: absolute;
    font-size: 26px;
    top: 5px;
    left: 35px;
    background: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding-left: 7px;
    padding-top: 2px;
    line-height: 40px;
    color: #7773a0;

  }
  .login-btn {
    position: absolute;
    top: 8px;
    right: 20px;
  }
  .welcome {
    display: inline-block;
    margin-right: 25px;
    color: #fff
  }
  .username {
    text-decoration: underline;
  }
  .username:hover {
    color: #0db7ff;
  }
</style>

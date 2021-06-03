<template>
  <div>
    <div class="app-container">
      <div v-if="user">
        <el-row :gutter="20">
          <el-col :span="6" :xs="24">
            <user-card :user="user" @changeUserAvator="changeUserAvator" />
          </el-col>
          <el-col :span="18" :xs="24">
            <el-card>
              <h3>管理用户信息</h3>
              <account :user="user" @submitUpdateUser="submitUpdateUser"/>
            </el-card>
          </el-col>

        </el-row>
      </div>
    </div>
    <el-dialog
      title="选择新的头像"
      :visible.sync="changeAvatarDialog"
      width="30%">
      <div>
        <el-image
          v-for="(i, index) in Array(50).fill().map((_,i)=>i+1)"
          :key="index"
          style="width: 50px; height: 50px; margin: 3px"
          :src="`/avatar/${i}.jpg`"
          @click="selectAvatar(i)"
          :class="{'active': selectedAvatar === `/avatar/${i}.jpg`}"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { mapGetters } from 'vuex'
import {
  updateUserById
} from '@/api/user'
export default {
  name: 'profile',
  components: { UserCard, Activity, Timeline, Account },
  directives: { permission },
  data () {
    return {
      selectedAvatar: 0,
      user: {},
      changeAvatarDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'name',
      'avatar',
      'introduction',
      'userId'
    ])
  },
  mounted() {
    this.selectedAvatar = this.avatar
  },
  created() {
    this.getUser()
  },
  methods: {
    checkPermission,
    selectAvatar (i) {
      const imgName = `/avatar/${i}.jpg`
      this.selectedAvatar = imgName
      let data = {
        avatar: imgName,
        id: this.userId
      }
      updateUserById(data)
        .then((res) => {
          if (res.success) {
            this.$store.commit('user/SET_AVATAR', imgName)
            this.getUser()
          }
        })
    },
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar,
        introduction: this.introduction
      }
    },
    changeUserAvator () {
      this.changeAvatarDialog = true
    },
    submitUpdateUser (user) {
      let data = JSON.parse(JSON.stringify(user))
      console.log(user)
      data.id = this.userId
      data.username = user.name

      updateUserById(data)
        .then((res) => {
          if (res.success) {
            // this.$store.commit('user/SET_AVATAR', imgName)
            this.getUser()
          }
        })
    }
  }
}
</script>

<style scoped>
.active {
  border-radius: 15px;
  box-sizing: border-box;
  border: 5px solid rgba(255, 40, 37, 0.67);
}
</style>

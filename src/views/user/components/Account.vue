<template>
  <div>
    <el-form>
      <el-form-item label="用户名">
        <el-input v-model.trim="user.name" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model.trim="user.introduction" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitForm">提交</el-button>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    }
  },
  methods: {
    submitForm() {
      console.log(123)
      let userForm = this.user
      this.$emit('submitUpdateUser', userForm)
    }
  }
}
</script>

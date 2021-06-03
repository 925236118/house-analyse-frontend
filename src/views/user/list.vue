<template>
  <div>
    <el-row>
      <el-col :span="16" :offset="4">
        <h2>
          用户列表
          <el-tooltip class="item" effect="dark" content="新建" placement="top">
            <el-button type='success' circle size="mini" style="margin-left: 20px" @click="showAddDialog" v-permission="['admin']">
              <i class="el-icon-plus" />
            </el-button>
          </el-tooltip>
        </h2>
        <el-table
          class="houseTable"
          height="750"
          v-loading="listLoading"
          :data="userList"
          border
          stripe
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
          <el-table-column label="用户名" prop="name" sortable="custom" align="center">
            <template slot-scope="{row}">
              <template v-if="row.id === editId">
                <el-input v-model="editTableForm.username" class="edit-input" size="small" clearable />
              </template>
              <span v-else>{{ row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机" prop="name" sortable="custom" align="center">
            <template slot-scope="{row}">
              <template v-if="row.id === editId">
                <el-input v-model="editTableForm.phone" class="edit-input" size="small" clearable />
              </template>
              <span v-else>{{ row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="昵称" prop="name" sortable="custom" align="center">
            <template slot-scope="{row}">
              <template v-if="row.id === editId">
                <el-input v-model="editTableForm.nickname" class="edit-input" size="small" clearable />
              </template>
              <span v-else>{{ row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="简介" prop="name" sortable="custom" align="center">
            <template slot-scope="{row}">
              <template v-if="row.id === editId">
                <el-input v-model="editTableForm.introduction" class="edit-input" size="small" clearable />
              </template>
              <span v-else>{{ row.introduction }}</span>
            </template>
          </el-table-column>
          <el-table-column label="头像" prop="name" sortable="custom" align="center">
            <template slot-scope="{row}">
              <template v-if="row.id === editId">
                <el-input v-model="editTableForm.avatar" class="edit-input" size="small" clearable />
              </template>
              <span v-else>{{ row.avatar }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" sortable="custom" align="center" width="180" v-if="checkPermission(['admin'])">
            <template slot-scope="{row}">
              <el-tooltip class="item" v-if="row.id === editId" effect="dark" content="提交" placement="top">
                <el-button type="primary" size="mini" circle class="button"
                           @click="submitEditSource(row)">
                  <i class="el-icon-check" />
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" v-if="row.id === editId" effect="dark" content="取消" placement="top">
                <el-button type="danger" size="mini" circle class="button"
                           @click="cancelEditSource(row)">
                  <i class="el-icon-close" />
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" v-else effect="dark" content="编辑" placement="top">
                <el-button type="primary" size="mini" circle class="button" @click="editSource(row)">
                  <i class="el-icon-edit" />
                </el-button>
              </el-tooltip>
              <el-button slot="reference" type="danger" size="mini" circle class="button" style="margin-right: 5px"
                         @click="deleteUser(row.id)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-minus" />
                </el-tooltip>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogFormVisible"
      width="750px"
      @close="closeDialog"
    >
      <el-form ref="addForm" :rules="rules" :model="addDialogForm" label-width="80px" size="mini" class="dialogForm">
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addDialogForm.name" clearable />
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="submitAdd">提交</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, deleteUserById, updateUserById, addUser } from '@/api/user'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'UserList',
  directives: { permission },
  data () {
    return {
      listLoading: false,
      userList: [],
      editId: null,
      editTableForm: {},
      formLabelWidth: '120px',
      addDialogFormVisible: false,
      addDialogForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    fetchUserList()
      .then((res) => {
        this.userList = res.results
      })
  },
  methods: {
    checkPermission,
    submitEditSource () {
      updateUserById(this.editTableForm)
        .then((res) => {
          if (res.success) {
            const index = this.userList.findIndex((item) => item.id === this.editTableForm.id)
            this.userList.splice(index, 1, this.editTableForm)
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '更新失败',
              type: 'error'
            })
          }
        })
        .then(() => {
          this.editId = null
        })
    },
    cancelEditSource (item) {
      this.editId = null
    },
    editSource (item) {
      this.editTableForm = JSON.parse(JSON.stringify(item))
      this.editId = item.id
    },
    deleteUser(attrId) {
      const params = {
        id: attrId
      }
      deleteUserById(params)
        .then((res) => {
          if (res.success) {
            const index = this.userList.findIndex((item) => item.id === attrId)
            this.userList.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
    },
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    submitAdd () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          addUser(this.addDialogForm)
            .then((res) => {
              if (res.results) {
                this.userList.push(res.results)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '添加失败',
                  type: 'error'
                })
              }
              this.addDialogFormVisible = false
            })
        }
      })
    },
    closeDialog () {
      this.addDialogFormVisible = false
      this.addDialogForm = {
        name: ''
      }
    }
  }
}
</script>

<style scoped>

</style>

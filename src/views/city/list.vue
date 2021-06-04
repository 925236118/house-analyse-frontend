<template>
  <div>
    <el-row>
      <el-col :span="16" :offset="4">
        <h2>
          城市列表
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
          :data="cityList"
          border
          stripe
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
          <el-table-column label="名称" prop="name" sortable="custom" align="center">
            <template slot-scope="{row}">
              <template v-if="row.id === editId">
                <el-input v-model="editTableForm.name" class="edit-input" size="small" clearable />
              </template>
              <span v-else>{{ row.name }}</span>
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
                         @click="deleteCity(row.id)">
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
      title="添加城市"
      :visible.sync="addDialogFormVisible"
      width="750px"
      @close="closeDialog"
    >
      <el-form ref="addForm" :rules="rules" :model="addDialogForm" label-width="80px" size="mini" class="dialogForm">
        <el-form-item label="城市名称" :label-width="formLabelWidth" prop="name">
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
import { fetchCityList, deleteCityById, updateCityById, addCity } from '@/api/city'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'CityList',
  directives: { permission },
  data () {
    return {
      listLoading: false,
      cityList: [],
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
    fetchCityList()
      .then((res) => {
        this.cityList = res.results
      })
  },
  methods: {
    checkPermission,
    submitEditSource () {
      updateCityById(this.editTableForm)
        .then((res) => {
          if (res.success) {
            const index = this.cityList.findIndex((item) => item.id === this.editTableForm.id)
            this.cityList.splice(index, 1, this.editTableForm)
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
    deleteCity(attrId) {
      const params = {
        id: attrId
      }
      deleteCityById(params)
        .then((res) => {
          if (res.success) {
            const index = this.cityList.findIndex((item) => item.id === attrId)
            this.cityList.splice(index, 1)
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
          addCity(this.addDialogForm)
            .then((res) => {
              if (res.results) {
                this.cityList.push(res.results)
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

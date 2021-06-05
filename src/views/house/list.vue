<template>
  <div>
    <el-row style="margin-top: 20px;">
      <el-col :span="18" :offset="3">
        <div style="float: left; height: 36px;line-height: 36px;font-weight: 900;margin-right: 20px;color: #606266">搜索</div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="float: left">
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" placeholder="请填写要搜索的标题" clearable @input="changeSearchParams" />
          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="searchForm.source" placeholder="请选择来源" clearable @change="changeSearchParams">
              <el-option
                v-for="(source, index) in allSourceList"
                :key="index"
                :label="source.name"
                :value="source.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="城市">
            <el-select v-model="searchForm.city" placeholder="请选择城市" clearable @change="changeSearchParams">
              <el-option
                v-for="(city, index) in allCityList"
                :key="index"
                :label="city.name"
                :value="city.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="showAddHouseDialog" circle style="margin-left:40px" v-permission="['admin']">
          <i class="el-icon-plus" />
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" :offset="3">
        <el-table
          class="houseTable"
          height="750"
          v-loading="listLoading"
          :data="houseList"
          border
          stripe
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
          <el-table-column label="标题" prop="title" sortable="custom" align="center" />
          <el-table-column label="房屋code" prop="house_code" sortable="custom" align="center" width="175" />
          <el-table-column label="来源" sortable="custom" align="center" width="100">
            <template slot-scope="{row}">
              <span>{{ sourceMap[row.source] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="城市" sortable="custom" align="center" width="100">
            <template slot-scope="{row}">
              <span>{{ cityMap[row.city] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="custom" align="center" width="180">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" circle class="button" @click="editHouse(row)" v-permission="['admin']">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" />
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="mini" circle class="button" @click="showHouseDetail(row)">
                <el-tooltip class="item" effect="dark" content="显示房屋详情信息" placement="top">
                  <i class="el-icon-more" />
                </el-tooltip>
              </el-button>
              <el-button type="success" size="mini" circle class="button" style="margin-right: 5px"
                         @click="jumpHouseSourceUrl(row.url)">
                <el-tooltip class="item" effect="dark" content="跳转房屋源网站" placement="top">
                  <i class="el-icon-top-right" />
                </el-tooltip>
              </el-button>
              <el-button slot="reference" type="danger" size="mini" circle class="button" style="margin-right: 5px"
                         @click="removeHouse(row.id)" v-permission="['admin']">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-minus" />
                </el-tooltip>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          hide-on-single-page
          :page-size="pageSize"
          :page-sizes="pageSizes"
          layout="prev, pager, next, sizes"
          :total="total"
          @current-change="changePage"
          @size-change="handleSizeChange"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="isEdit ? '编辑' : '添加'"
      :visible.sync="dialogFormVisible"
      width="750px"
      @close="closeDialog"
    >
      <el-form ref="form" :rules="rules" :model="dialogForm" label-width="80px" size="mini" class="dialogForm">
        <el-form-item v-if="isEdit" label="ID" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.id" disabled />
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="dialogForm.title" clearable />
        </el-form-item>
        <el-form-item label="房屋code" :label-width="formLabelWidth" prop="house_code">
          <el-input v-model="dialogForm.house_code" clearable />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="dialogForm.price" clearable />
        </el-form-item>
        <el-form-item label="房屋链接" :label-width="formLabelWidth" prop="url">
          <el-input v-model="dialogForm.url" clearable />
        </el-form-item>
        <el-form-item label="来源" :label-width="formLabelWidth" prop="source">
          <el-select v-model="dialogForm.source" placeholder="请选择来源">
            <el-option
              v-for="(source, index) in allSourceList"
              :key="index"
              :label="source.name"
              :value="source.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="city">
          <el-select v-model="dialogForm.city" placeholder="请选择城市">
            <el-option
              v-for="(city, index) in allCityList"
              :key="index"
              :label="city.name"
              :value="city.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="isEdit ? submitEditForm() : submitAddForm()">提交</el-button>
          <el-button @click="hiddenDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchHouseList, removeHouseById, updateHouse, addHouse } from '@/api/house'
import { fetchSourceList } from '@/api/source'
import { fetchCityList } from '@/api/city'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'HouseList',
  directives: { permission },
  data() {
    return {
      listLoading: false,
      allHouseList: [],
      searchedHouseList: [],
      allSourceList: [],
      allCityList: [],
      houseList: [],
      total: 0,
      pageSize: 30,
      currentPage: 1,
      pageSizes: [10, 20, 30, 50],
      isEdit: true,
      dialogFormVisible: false,
      dialogForm: {
        id: null,
        title: '',
        source: null,
        city: null,
        url: '',
        house_code: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        house_code: [
          { required: true, message: '请输入房屋code', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入来源链接', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择房源信息来源网站', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择房源来源城市', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      deleteConfirmVisible: false,
      searchForm: {
        title: '',
        source: '',
        city: ''
      },
      searchRules: {
        title: 'reg',
        source: 'match',
        city: 'match'
      }
    }
  },
  computed: {
    sourceMap() {
      let result = {}
      this.allSourceList.forEach(item => {
        result[item.id] = item.name
      })
      return result
    },
    cityMap() {
      let result = {}
      this.allCityList.forEach(item => {
        result[item.id] = item.name
      })
      return result
    }
  },
  mounted() {
    fetchHouseList()
      .then((res) => {
        this.allHouseList = res.results
        this.searchedHouseList = this.allHouseList
        this.houseList = this.searchedHouseList.slice(0, this.pageSize)
        this.total = res.count
      })
    fetchSourceList()
      .then((res) => {
        this.allSourceList = res.results
      })
    fetchCityList()
      .then((res) => {
        this.allCityList = res.results
      })
  },
  methods: {
    checkPermission,
    sortChange(data) {
      const { prop, order } = data
      console.log(prop)
      console.log(order)
    },
    editHouse(item) {
      this.isEdit = true
      this.dialogForm = JSON.parse(JSON.stringify(item))
      this.dialogFormVisible = true
    },
    showAddHouseDialog() {
      this.isEdit = false
      this.dialogForm = {
        id: null,
        title: '',
        source: null,
        city: null,
        url: '',
        house_code: ''
      }
      this.dialogFormVisible = true
    },
    showHouseDetail(item) {
      this.$router.push({ name: 'HouseDetail', params: { id: item.id } })
    },
    hiddenDialog() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
    },
    closeDialog() {
      this.$refs['form'].resetFields()
    },
    submitEditForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let houseId = this.dialogForm.id
          updateHouse(this.dialogForm)
            .then((res) => {
              if (res.success) {
                const index = this.allHouseList.findIndex((item) => item.id === houseId)
                this.allHouseList.splice(index, 1, this.dialogForm)
                this.changePage(this.currentPage)
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
              this.dialogFormVisible = false
            })
        }
      })
    },
    submitAddForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addHouse(this.dialogForm)
            .then((res) => {
              if (res.results) {
                this.allHouseList.push(res.results)
                this.changePage(this.currentPage)
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
              this.dialogFormVisible = false
            })
        }
      })
    },
    jumpHouseSourceUrl(url) {
      let oA = document.createElement('a')
      oA.href = url
      oA.target = '_blank'
      oA.click()
    },
    removeHouse(houseId) {
      const params = {
        id: houseId
      }
      removeHouseById(params)
        .then((res) => {
          if (res.success) {
            const index = this.allHouseList.findIndex((item) => item.id === houseId)
            this.allHouseList.splice(index, 1)
            const searchedIndex = this.searchedHouseList.findIndex((item) => item.id === houseId)
            this.searchedHouseList.splice(searchedIndex, 1)
            this.changePage(this.currentPage)
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
    changePage(page) {
      this.houseList = this.searchedHouseList.slice((page - 1) * this.pageSize, page * this.pageSize)
      this.currentPage = page
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.houseList = this.searchedHouseList.slice(0, val)
    },
    changeSearchParams () {
      this.houseList = []
      this.searchedHouseList = []
      this.allHouseList.forEach(house => {
        let result = true
        Object.keys(this.searchForm).forEach(key => {
          if (!this.searchForm[key]) {
            return
          }
          switch (this.searchRules[key]) {
            case 'reg':
              let reg = new RegExp(this.searchForm[key])
              result = result && reg.test(house[key])
              break
            case 'match':
              result = result && house[key] === this.searchForm[key]
              break
          }
        })
        if (result) {
          this.searchedHouseList.push(house)
        }
      })
      this.houseList = this.searchedHouseList.slice(0, this.pageSize)
      this.total = this.searchedHouseList.length
    }
  }
}
</script>

<style scoped>
  .houseTable {
    margin-bottom: 10px
  }

  .dialogForm {
    margin-right: 100px;
  }

  .pagination {
    text-align: center;
  }
</style>

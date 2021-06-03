<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-row>
          <el-col :span="16">
            <el-row style="margin-bottom: 60px">
              <el-col :span="4" :offset="4">
                <div class="houseLogo">
                  <i class="el-icon-house" />
                </div>
              </el-col>
              <el-col :span="16">
                <el-card class="attrCard">
                  <div slot="header" class="clearfix">
                    <span style="font-weight: 900;color: #757575">房屋信息</span>
                    <el-button v-permission="['admin']" style="float: right; padding: 3px 0" type="text" @click="editHouse(houseInfo)">编辑
                    </el-button>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">房屋ID</div>
                    <div class="attrContent">{{ houseInfo.id }}</div>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">标题</div>
                    <el-tooltip class="item" effect="dark" :content="houseInfo.title" placement="top">
                      <div class="attrContent">{{ houseInfo.title }}</div>
                    </el-tooltip>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">房屋code</div>
                    <div class="attrContent">{{ houseInfo.house_code }}</div>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">房屋价格</div>
                    <div class="attrContent">{{ houseInfo.price }}</div>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">房屋来源</div>
                    <div class="attrContent">{{ sourceMap[houseInfo.source] }}</div>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">房屋所在城市</div>
                    <div class="attrContent">{{ cityMap[houseInfo.city] }}</div>
                  </div>
                  <div class="attrItem">
                    <div class="attrTitle">房屋来源链接</div>
                    <div class="attrContent">
                      <el-tooltip class="item" effect="dark" :content="houseInfo.url" placement="top">
                        <el-button type="text" style="margin: 0; padding: 0" @click="jumpHouseSourceUrl(houseInfo.url)">
                          房源链接
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <el-row style="margin-bottom: 60px">
              <h3>
                房屋属性详情列表
                <el-tooltip class="item" effect="dark" content="新建" placement="top">
                  <el-button v-permission="['admin']" type='success' circle size="mini" style="margin-left: 20px" @click="showAddAttrDialog">
                    <i class="el-icon-plus" />
                  </el-button>
                </el-tooltip>
              </h3>
              <el-table
                class="houseTable"
                height="750"
                v-loading="listLoading"
                :data="attrList"
                border
                stripe
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
                <el-table-column label="属性名称" prop="attr_name" sortable="custom" align="center">
                  <template slot-scope="{row}">
                    <template v-if="row.id === editId">
                      <el-input v-model="editTableForm.attr_name" class="edit-input" size="small" clearable />
                    </template>
                    <span v-else>{{ row.attr_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="属性值" prop="attr_value" sortable="custom" align="center">
                  <template slot-scope="{row}">
                    <template v-if="row.id === editId">
                      <el-input v-model="editTableForm.attr_value" class="edit-input" size="small" clearable />
                    </template>
                    <span v-else>{{ row.attr_value }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" sortable="custom" align="center" width="180" v-if="checkPermission(['admin'])">
                  <template slot-scope="{row}">
                    <el-tooltip class="item" v-if="row.id === editId" effect="dark" content="提交" placement="top">
                      <el-button type="primary" size="mini" circle class="button"
                               @click="submitEditAttr(row)">
                        <i class="el-icon-check" />
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" v-if="row.id === editId" effect="dark" content="取消" placement="top">
                      <el-button type="danger" size="mini" circle class="button"
                               @click="cancelEditAttr(row)">
                        <i class="el-icon-close" />
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" v-else effect="dark" content="编辑" placement="top">
                      <el-button type="primary" size="mini" circle class="button" @click="editAttr(row)">
                        <i class="el-icon-edit" />
                      </el-button>
                    </el-tooltip>
                    <el-button slot="reference" type="danger" size="mini" circle class="button"
                               style="margin-right: 5px" @click="deleteAttr(row.id)">
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="el-icon-minus" />
                      </el-tooltip>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
          <el-col :span="8" style="padding-left: 125px;padding-top: 50px">

            <h3>
              房屋图片表
              <el-tooltip class="item" effect="dark" content="新建" placement="top">
                <el-button type='success' circle size="mini" style="margin-left: 20px" @click="showAddImageDialog" v-permission="['admin']">
                  <i class="el-icon-plus" />
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="!isEditing" v-permission="['admin']" class="item" effect="dark" content="编辑" placement="top">
                <el-button type='primary' circle size="mini" style="margin-left: 20px" @click="editImages">
                  <i class="el-icon-edit" />
                </el-button>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="dark" content="结束编辑" placement="top">
                <el-button v-permission="['admin']" type='danger' circle size="mini" style="margin-left: 20px" @click="cancleEditImages">
                  <i class="el-icon-close" />
                </el-button>
              </el-tooltip>
            </h3>
            <div style="height: 1200px; width: 300px; overflow-y: scroll">
              <div
                v-for="(image, index) in imageList"
                :key="index"
                class="houseImageItem"
              >
                <el-image
                  class="houseImage"
                  style="width: 250px; height: 200px"
                  :src="image.img_url"
                  fit="fill"
                  :preview-src-list="[image.img_url]"
                >
                </el-image>
                <div class="deleteImageIcon" v-show="isEditing" @click="deleteImage(image.id, index)">
                  <div class="deleteIcon">
                    <i class="el-icon-delete" />
                  </div>
                </div>
              </div>
            </div>

          </el-col>
        </el-row>
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
          <el-button type="primary" @click="isEdit ? submitEditForm() : null">提交</el-button>
          <el-button @click="hiddenDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加房屋属性"
      :visible.sync="addAttrDialogFormVisible"
      width="750px"
      @close="closeAttrDialog"
    >
      <el-form ref="addAttrForm" :rules="rules" :model="addAttrDialogForm" label-width="80px" size="mini" class="dialogForm">
        <el-form-item label="房屋ID" :label-width="formLabelWidth">
          <el-input v-model="addAttrDialogForm.house" disabled />
        </el-form-item>
        <el-form-item label="房屋属性名称" :label-width="formLabelWidth" prop="attr_name">
          <el-input v-model="addAttrDialogForm.attr_name" clearable />
        </el-form-item>
        <el-form-item label="房屋属性值" :label-width="formLabelWidth" prop="attr_value">
          <el-input v-model="addAttrDialogForm.attr_value" clearable />
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="submitAddAttr">提交</el-button>
          <el-button @click="closeAttrDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="添加房屋图片"
      :visible.sync="addImageDialogFormVisible"
      width="750px"
      @close="closeImageDialog"
    >
      <el-form ref="addImageForm" :rules="rules" :model="addImageDialogForm" label-width="80px" size="mini" class="dialogForm">
        <el-form-item label="房屋ID" :label-width="formLabelWidth">
          <el-input v-model="addImageDialogForm.house" disabled />
        </el-form-item>
        <el-form-item label="房屋图片url" :label-width="formLabelWidth" prop="img_url">
          <el-input v-model="addImageDialogForm.img_url" clearable />
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="submitAddImage">提交</el-button>
          <el-button @click="closeImageDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchHouseById, updateHouse } from '@/api/house'
import { updateHouseAttrById, deleteHouseAttrById, addHouseAttr } from '@/api/houseAttrs'
import { addHouseImage, deleteHouseImageById } from '@/api/houseImage'
import { fetchSourceList } from '@/api/source'
import { fetchCityList } from '@/api/city'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'HouseDetail',
  props: ['id'],
  directives: { permission },
  computed: {
    houseId() {
      return this.$route.params.id
    },
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
    },
    ...mapGetters([
      'roles'
    ])
  },
  data() {
    return {
      houseInfo: {},
      allSourceList: [],
      allCityList: [],
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
        ],
        attr_name: [
          { required: true, message: '请输入属性名', trigger: 'blur' }
        ],
        attr_value: [
          { required: true, message: '请输入属性值', trigger: 'blur' }
        ],
        img_url: [
          { required: true, message: '请输入图片链接', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      listLoading: false,
      attrList: [],
      imageList: [],
      editId: null,
      editTableForm: {
        attr_name: '',
        attr_value: ''
      },
      isEditing: false,
      addAttrDialogFormVisible: false,
      addAttrDialogForm: {
        house: null,
        attr_name: '',
        attr_value: ''
      },
      addImageDialogFormVisible: false,
      addImageDialogForm: {
        house: null,
        img_url: ''
      }
    }
  },
  mounted() {
    const params = {
      id: this.houseId
    }
    fetchHouseById(params)
      .then((res) => {
        console.log(res)
        this.houseInfo = res.results
        this.attrList = res.results.attrs
        this.imageList = res.results.imgs
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
    jumpHouseSourceUrl(url) {
      let oA = document.createElement('a')
      oA.href = url
      oA.target = '_blank'
      oA.click()
    },
    editHouse(item) {
      this.isEdit = true
      this.dialogForm = JSON.parse(JSON.stringify(item))
      this.dialogFormVisible = true
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
          updateHouse(this.dialogForm)
            .then((res) => {
              if (res.success) {
                // this.houseInfo = this.dialogForm
                Object.keys(this.houseInfo).forEach(key => {
                  if (!Array.isArray(this.houseInfo[key])) {
                    this.houseInfo[key] = this.dialogForm[key]
                  }
                })
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
    editAttr(item) {
      this.editTableForm = JSON.parse(JSON.stringify(item))
      this.editId = item.id
    },
    submitEditAttr() {
      updateHouseAttrById(this.editTableForm)
        .then((res) => {
          if (res.success) {
            const index = this.attrList.findIndex((item) => item.id === this.editTableForm.id)
            this.attrList.splice(index, 1, this.editTableForm)
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
    cancelEditAttr () {
      this.editId = null
    },
    deleteAttr(attrId) {
      const params = {
        id: attrId
      }
      deleteHouseAttrById(params)
        .then((res) => {
          if (res.success) {
            const index = this.attrList.findIndex((item) => item.id === attrId)
            this.attrList.splice(index, 1)
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
    editImages() {
      this.isEditing = true
    },
    cancleEditImages() {
      this.isEditing = false
    },
    showAddAttrDialog () {
      this.addAttrDialogFormVisible = true
      this.addAttrDialogForm.house = this.houseId
    },
    submitAddAttr() {
      this.$refs['addAttrForm'].validate((valid) => {
        if (valid) {
          addHouseAttr(this.addAttrDialogForm)
            .then((res) => {
              if (res.results) {
                this.attrList.push(res.results)
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
              this.addAttrDialogFormVisible = false
            })
        }
      })
    },
    closeAttrDialog () {
      this.addAttrDialogFormVisible = false
      this.addAttrDialogForm = {
        house: null,
        attr_name: '',
        attr_value: ''
      }
    },
    deleteImage (imageId, deleteIndex) {
      const params = {
        id: imageId
      }
      deleteHouseImageById(params)
      .then((res) => {
        if (res.success) {
          this.imageList.splice(deleteIndex, 1)
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
    },
    showAddImageDialog () {
      this.addImageDialogForm.house = this.houseId
      this.addImageDialogFormVisible = true
    },
    closeImageDialog () {
      this.addImageDialogFormVisible = false
      this.addImageDialogForm = {
        house: null,
        img_url: ''
      }
    },
    submitAddImage () {
      this.$refs['addImageForm'].validate((valid) => {
        if (valid) {
          addHouseImage(this.addImageDialogForm)
            .then((res) => {
              if (res.results) {
                this.imageList.push(res.results)
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
              this.addImageDialogFormVisible = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
  .houseLogo {
    color: #525252;
    font-size: 60px;
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
    text-align: center;
    line-height: 100px;
    box-shadow: 3px 3px 15px #dddddd;
    margin: 140px auto 0 auto;

  }

  .attrCard {
    width: 480px;
    height: 380px;
    margin: 60px auto 0 auto;
  }

  .attrItem {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    display: grid;
    grid-template-columns: 130px 275px;
  }

  .attrTitle {
    color: #6e6e6e;
    width: 130px;
  }

  .attrContent {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .houseImageItem {
    position: relative;
  }

  .houseImage {
    border-radius: 20px;

  }

  .deleteImageIcon {
    cursor: pointer;
    width: 0;
    height: 0;
    border: 25px solid #ff4949;
    border-bottom-color: transparent;
    border-left-color: transparent;
    position: absolute;
    top: 0;
    right: 33px;
    transition: all 0.5s;
    line-height: 20px
  }
  .deleteIcon {
    color: white;
    position: absolute;
    top: -20px;
    font-size: 16px;
  }
</style>

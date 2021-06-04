<template>
  <div>
    <div class="nav">
      <div class="project-icon">
        <i class=" el-icon-school" />
      </div>
      <h3>
        房屋租赁信息网站
      </h3>
      <div class="login-btn">
        <a href="/backend/dashboard">
          <el-button>管理</el-button>
        </a>
      </div>
    </div>
    <el-row style="margin: 30px 0;">
      <el-col :offset="8" :span="8">
        <el-input placeholder="请输入搜索内容" v-model="filterForm.searchValue" class="input-with-select" @change="changeSearchValue">
          <el-button slot="append" type="primary" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" :offset="3" class="house-list">
        <el-row v-for="(houseRow, rowIndex) in formatShowHouseList" :key="rowIndex">
          <el-col v-for="(house, index) in houseRow" :key="index" :span="4" :offset="index % 5 === 0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px' }" class="house-card">
              <el-image
                v-if="house.imgs[0]"
                :src="house.imgs[0].img_url"
                fit="fill"
                :preview-src-list="house.imgs.map(img => img.img_url)"
              />
              <div style="padding: 14px;">
                <el-tooltip class="item" effect="dark" :content="house.title" placement="top">
                  <div class="hosue-title">{{ house.title }}</div>
                </el-tooltip>
                <div class="house-price">{{ house.price }}</div>
                <div>
                  <el-tag
                    v-for="(tag, houseIndex) in house.tags"
                    :key="houseIndex"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="bottom clearfix">
                  <el-button type="text" class="button" @click="showHouseDetail(house.id)">
                    <el-tooltip class="item" effect="dark" content="显示房屋详情信息" placement="top">
                      <i class="el-icon-plus" />
                    </el-tooltip>
                  </el-button>
                  <el-button type="text" class="button" style="margin-right: 5px" @click="jumpHouseSourceUrl(house.url)">
                    <el-tooltip class="item" effect="dark" content="跳转房屋源网站" placement="top">
                      <i class="el-icon-top-right" />
                    </el-tooltip>
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
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
      <!--<el-col :span="6">
        123456
      </el-col>-->
    </el-row>

  </div>
</template>

<script>
import { fetchHouseList } from '@/api/house'
export default {
  name: 'Index',
  data() {
    return {
      originHouseList: [],
      allHouseList: [],
      houseList: [],
      total: 0,
      currentPage: 1,
      pageSize: 30,
      pageSizes: [10, 20, 30, 50],
      filterForm: {
        searchValue: ''
      }
    }
  },
  computed: {
    formatShowHouseList () {
      const colCount = 5
      let tempHouseList = this.houseList
      let result = []
      if (this.houseList.length === 0) {
        return []
      }
      while (true) {
        if (tempHouseList.length < colCount) {
          result.push(tempHouseList)
          break
        } else {
          result.push(tempHouseList.slice(0, colCount))
          tempHouseList = tempHouseList.slice(colCount, tempHouseList.length)
        }
      }
      return result
    }
  },
  mounted() {
    fetchHouseList()
      .then((res) => {
        this.originHouseList = res.results
        this.allHouseList = res.results
        this.houseList = this.allHouseList.slice(0, this.pageSize)
        this.total = res.count
      })
  },
  methods: {
    showHouseDetail(houseId) {
      alert(houseId)
    },
    jumpHouseSourceUrl(url) {
      let oA = document.createElement('a')
      oA.href = url
      oA.target = '_blank'
      oA.click()
    },
    changePage(page) {
      this.houseList = this.allHouseList.slice((page - 1) * this.pageSize, page * this.pageSize)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = page
      this.houseList = this.allHouseList.slice(0, val)
    },
    changeSearchValue () {
      this.filterHouseList()
    },
    filterHouseList () {
      this.allHouseList = this.originHouseList.filter((dataItem) => {
        let result = false
        Object.keys(this.filterForm).forEach(filterKey => {
          let filterValue = this.filterForm[filterKey]
          if (!filterValue) return
          let filterReg = new RegExp(filterValue)
          Object.keys(dataItem).forEach(dataKey => {
            if (typeof dataItem[dataKey] !== 'string') return
            result = result || filterReg.test(dataItem[dataKey])
          })
          dataItem.attrs.forEach(attrItem => {
            result = result || filterReg.test(attrItem.value)
          })
        })
        return result
      })
      this.total = this.allHouseList.length
      this.changePage(1)
    }
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
  /**
  house list
   */
  .house-list {
    padding: 0 20px
  }
  .house-card {
    margin-bottom: 20px;
  }
  .hosue-title {
    font-weight: 900;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .house-price {
    color: #ff696e;
    margin-bottom: 8px
  }
  .house-content {
    font-size: 0.9em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  /**
  house card
   */
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .pagination {
    text-align: center;
    margin: 20px 0 60px 0;
  }
</style>

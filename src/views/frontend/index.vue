<template>
  <div>
    <Topbar />
    <el-row style="margin: 30px 0;">
      <el-col :offset="4" :span="16">
<!--        <el-input placeholder="请输入搜索内容" v-model="filterForm.searchValue" class="input-with-select" @change="changeSearchValue">-->
<!--          <el-button slot="append" type="primary" icon="el-icon-search"></el-button>-->
<!--        </el-input>-->
        <el-form :inline="true" :model="searchForm" class="form-inline" style="text-align: center">
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
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" :offset="3" class="house-list">
        <el-row v-for="(houseRow, rowIndex) in formatShowHouseList" :key="rowIndex">
          <el-col v-for="(house, index) in houseRow" :key="index" :span="4" :offset="index % 5 === 0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px' }" class="house-card">
              <el-image
                style="height: 250px;"
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
                    style="margin-right: 10px"
                  >
                    {{ tag.name }}
                  </el-tag>
                </div>
                <div class="bottom clearfix">
                  <el-tooltip class="item" effect="dark" content="显示房屋详情信息" placement="top">
                    <el-button icon="el-icon-plus" type="primary" round class="button" @click="showHouseDetail(house.id)">
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="跳转房屋源网站" placement="top">
                    <el-button icon="el-icon-top-right" type="success" round class="button" style="margin-right: 5px" @click="jumpHouseSourceUrl(house.url)">
                    </el-button>
                  </el-tooltip>
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
import { mapGetters } from 'vuex'
import Topbar from './topbar.vue'
import { fetchSourceList } from '@/api/source'
import { fetchCityList } from '@/api/city'

export default {
  name: 'Index',
  components: { Topbar },
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
      },
      searchForm: {

      },
      allSourceList: [],
      allCityList: [],

      searchRules: {
        title: 'reg',
        source: 'match',
        city: 'match'
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
    },
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    Promise.all([fetchHouseList(), fetchSourceList(), fetchCityList()])
      .then(res => {
        let [houseResult, sourceResult, cityResult] = res
        this.originHouseList = houseResult.results
        this.allSourceList = sourceResult.results
        this.allCityList = cityResult.results
        this.originHouseList.forEach(houseData => {
          let source = this.allSourceList.find(item => item.id === houseData.source)
          let city = this.allCityList.find(item => item.id === houseData.city)
          houseData.tags = [source, city]
        })
        this.allHouseList = this.originHouseList
        this.total = this.originHouseList.length

        this.houseList = this.allHouseList.slice(0, this.pageSize)
      })
  },
  methods: {
    showHouseDetail(houseId) {
      this.$router.push({name: 'frontHouseDetail', params: { id: houseId }})
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
    /*changeSearchValue () {
      this.filterHouseList()
    },
    filterHouseList () {
      if (!this.filterForm.searchValue) {
        this.allHouseList = this.originHouseList
      } else {
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
            dataItem.tags.forEach(attrItem => {
              result = result || filterReg.test(attrItem.value)
            })
          })
          return result
        })
      }
      this.total = this.allHouseList.length
      this.changePage(1)
    },*/
    changeSearchParams () {
      this.houseList = []
      this.allHouseList = []
      this.originHouseList.forEach(house => {
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
          this.allHouseList.push(house)
        }
      })
      this.houseList = this.allHouseList.slice(0, this.pageSize)
      this.total = this.allHouseList.length
    }
  }
}
</script>

<style scoped>
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
    padding: 5px;
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

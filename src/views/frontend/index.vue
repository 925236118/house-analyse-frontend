<template>
  <div>
    <a href="/backend/dashboard">
      <el-button>管理</el-button>
    </a>
    <el-row>
      <el-col :span="18" class="house-list">
        <el-row>
          <el-col v-for="(house, index) in houseList" :key="index" :span="4" :offset="index % 5 === 0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px' }" class="house-card">
              <img v-if="house.imgs[0]" :src="house.imgs[0]" class="image">

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
      <el-col :span="6">
        123456
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { fetchHouseList } from '@/api/house'
export default {
  name: 'Index',
  data() {
    return {
      allHouseList: [],
      houseList: [],
      total: 0,
      currentPage: 1,
      pageSize: 30,
      pageSizes: [10, 20, 30, 50]
    }
  },
  mounted() {
    fetchHouseList()
      .then((res) => {
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
  }
</style>

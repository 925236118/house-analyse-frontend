<template>
  <div>
    <Topbar />
    <el-row>
      <el-col :span="18" :offset="3" style="margin-top: 50px">
        <router-link to="/">
          <div class="back-wapper">
            <span class="back-icon">
              <i class="el-icon-back"/>
            </span>
            <span class="back-text">返回首页</span>
          </div>
        </router-link>
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="(item, index) in imageList" :key="index">
            <el-image :src="item.img_url" />
          </el-carousel-item>
        </el-carousel>

        <h2 class="house-title">
          {{houseData.title}}
          <a target="_blank" :href="houseData.url"><i class="el-icon-link" /></a>
        </h2>
        <h3 class="house-price">{{houseData.price}}</h3>
        <el-card style="margin-bottom: 100px">
          <div style="width: 50%;float: left;padding-left: 30px">
            <div class="house-attrs">
              <span class="attr-name">数据来源：</span>
              <span class="attr-value"><a :href="currentSource.url">{{currentSource.name}}</a></span>
            </div>
            <div class="house-attrs" v-for="(attr, index) in leftAttrList" :key="index">
              <span class="attr-name">{{attr.attr_name}}：</span>
              <span class="attr-value">{{attr.attr_value}}</span>
            </div>
          </div>
          <div style="width: 50%;float: left;padding-left: 30px">
            <div class="house-attrs">
              <span class="attr-name">所属城市：</span>
              <span class="attr-value">{{currentCity.name}}</span>
            </div>
            <div class="house-attrs" v-for="(attr, index) in rightAttrList" :key="index">
              <span class="attr-name">{{attr.attr_name}}：</span>
              <span class="attr-value">{{attr.attr_value}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Topbar from './topbar.vue'
import { fetchHouseById } from '@/api/house'
import { fetchSourceList } from '@/api/source'
import { fetchCityList } from '@/api/city'

export default {
  name: 'detail',
  components: { Topbar },
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
    leftAttrList () {
      return this.attrList.filter((_, index) => index % 2 === 0)
    },
    rightAttrList () {
      return this.attrList.filter((_, index) => index % 2 === 1)
    }
  },
  data () {
    return {
      houseData: {},
      attrList: [],
      imageList: [],
      allSourceList: [],
      allCityList: [],
      currentSource: {},
      currentCity: {}
    }
  },
  mounted() {
    this.getHouseData ()
  },
  methods: {
    getHouseData () {
      let params = {
        id: this.houseId
      }
      Promise.all([fetchHouseById(params), fetchSourceList(), fetchCityList()])
        .then(res => {
          let [houseResult, sourceResult, cityResult] = res
          this.houseData = houseResult.results
          this.attrList = houseResult.results.attrs
          this.imageList = houseResult.results.imgs
          this.allSourceList = sourceResult.results
          this.allCityList = cityResult.results
          this.currentSource = this.allSourceList.find(item => item.id === this.houseData.source)
          this.currentCity = this.allCityList.find(item => item.id === this.houseData.city)
        })
    }
  }
}
</script>

<style scoped>
.back-wapper {
  margin-bottom: 30px;
  font-size: 18px;
}
.back-icon {
  margin-right: 15px;
}
.back-text {

}

.house-title {
  color: #606060;
}
.house-price {
  color: #992221;
}
.house-attrs {
  font-size: 20px;
  margin-bottom: 12px;
}
</style>

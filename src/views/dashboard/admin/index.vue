<template>
  <div class="dashboard-editor-container">
    <h1 style="color: #636363">数据看板</h1>
<!--    <panel-group @handleSetLineChartData="handleSetLineChartData" :show-data="lineChartData"/>-->
    <el-row :gutter="25">

      <el-col :span="6">
        <el-card class="dataCard" id="houseCount">
          <div class="card-icon"><i class="el-icon-house" /></div>
          <div class="card-info">
            <div class="card-name">房屋数量</div>
            <count-to  :start-val="0" :end-val="houseNum" :duration="1000" class="card-panel-num card-count" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="dataCard" id="sourceCount">
          <div class="card-icon"><i class="el-icon-house" /></div>
          <div class="card-info">
            <div class="card-name">来源数量</div>
            <count-to  :start-val="0" :end-val="sourceNum" :duration="1000" class="card-panel-num card-count" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="dataCard" id="cityCount">
          <div class="card-icon"><i class="el-icon-house" /></div>
          <div class="card-info">
            <div class="card-name">城市数量</div>
            <count-to  :start-val="0" :end-val="cityNum" :duration="1000" class="card-panel-num card-count" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="dataCard" id="userCount">
          <div class="card-icon"><i class="el-icon-house" /></div>
          <div class="card-info">
            <div class="card-name">用户数量</div>
            <count-to  :start-val="0" :end-val="userNum" :duration="1000" class="card-panel-num card-count" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="32" style="margin-top:50px;">
      <el-col :xs="24" :sm="24" :lg="8">
        <h2 style="color: #636363">使用来源统计</h2>
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" selection-type="source"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <h2 style="color: #636363">使用城市统计</h2>
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" selection-type="city"/>
        </div>
      </el-col>
    </el-row>

    <!--<el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->

    <!--<el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { fetchHouseList, houseCount } from '@/api/house'
import { fetchSourceList } from '@/api/source'
import { fetchCityList } from '@/api/city'
import { fetchUserList } from '@/api/user'

import CountTo from 'vue-count-to'

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    CountTo
  },
  data() {
    return {
      lineChartData: [],
      selectionType: '',
      houseNum: 0,
      sourceNum: 0,
      cityNum: 0,
      userNum: 0
    }
  },
  mounted() {
    this.getPageCouontData()
  },
  methods: {
    getPageCouontData () {
      houseCount()
        .then((res) => {
          this.lineChartData = res.results
          this.selectionType = 'source'
        })
      fetchHouseList()
        .then((res) => {
          this.houseNum = res.count
        })
      fetchSourceList()
        .then((res) => {
          this.sourceNum = res.count
        })
      fetchCityList()
        .then((res) => {
          this.cityNum = res.count
        })
      fetchUserList()
        .then((res) => {
          this.userNum = res.count
        })
    },
    handleSetLineChartData(type) {
      this.selectionType = type
    }
  }
}
</script>

<style lang="scss" scoped>
  #houseCount {
    --color: #7773a0
  }
  #sourceCount {
    --color: #2c972b
  }
  #cityCount {
    --color: #d85743
  }
  #userCount {
    --color: #6e7cff
  }
  .dataCard {
    height: 100px;
    position: relative;
  }
  .card-icon {
    font-size: 40px;
    line-height: 60px;
    padding-left: 10px;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    background-color: var(--color);
    color: #fff;
    position: absolute;
    left: 50px;
  }
  .card-info {
    position:absolute;
    left: 150px;
  }
  .card-name {
    font-size: 20px;
    font-weight: 900;
    color: #7a7a7a;
  }
  .card-count {
    font-size: 20px;
    display: inline-block;
    color: var(--color);
    margin-top: 15px;
    font-weight: 900;
  }
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

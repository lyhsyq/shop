<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table
      :data="goodsData"
      style="width: 100%"
      stripe>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template v-slot="{row}">
          {{row.add_time | momentTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain  size="mini" icon="el-icon-delete"></el-button>
        </template>>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totals"
      :page-size="pagesize"
      @current-change="currentChange">
    </el-pagination>
  </div>
</template>
<script>
import moment from "moment"
  export default {
    filters: {
      momentTime(value){
        return moment.unix(value).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    data(){
      return {
        goodsData: [],
        pagenum: 1,
        pagesize: 5,
        totals: 0
      }
    },
    methods: {
      // 获取所有的商品
      async getAllGoods(){
        let res = await this.$http({
          url: `goods`,
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        console.log(res)
        this.goodsData = res.data.data.goods
        this.totals = res.data.data.total
      },
      currentChange(value){
        this.pagenum = value
        this.getAllGoods()
      }
    },
    created(){
      this.getAllGoods()
    }
  }
</script>
<style>
  .breadcrumb {
    margin-bottom: 10px;
  }
</style>
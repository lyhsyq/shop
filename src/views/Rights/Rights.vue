<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="rightsData"
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        label="层级">
        <template v-slot="{row}">
          <span>{{row.level | getLevel}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        rightsData: [],
      }
    },
    methods: {
      
    },
    async created(){
      let res = await this.$http({
        url: `rights/list`
      })
      // console.log(res)
      this.rightsData = res.data.data
    },
    filters: {
      getLevel(level){
        switch(level){
          case "0":
            return "一级"
          case "1":
            return "二级"
          case "2":
            return "三级"
        }
      }
    }
  };
</script>
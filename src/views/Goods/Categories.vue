<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addCateBtn">添加分类</el-button>
    <el-table
      :data="categoryList"
      stripe
      style="width: 100%">
      <!-- file-icon指的就是叶子节点的图标
            folder-icon指的就是可展开的项的图标
            prop 指的就是当前列要显示的数据的属性名称
            label 指的就是表头 
            treeKey 节点的唯一表示
            parentKey 数据的父节点id
            childKey 当前节点的所有子节点存放的属性的名字 默认是children

            indent-size是用来设置每个层级之间的缩进距离的
            设置indent-size 需要同时制定 层级属性

            level-key:    设置为数据中标识层级的属性名即可
            -->
      <el-table-tree-column 
          file-icon="el-icon-document" 
          folder-icon="el-icon-folder" 
          prop="cat_name" 
          label="分类名称" 
          width="220"
          tree-key="cat_id"
          parent-key="cat_pid"
          child-key="children"
          level-key="cat_level"
          :indent-size="50">

      </el-table-tree-column>
      <el-table-column
        label="是否有效"
        width="180">
        <template v-slot="{row}">
          <span>{{row.cat_deleted ? '否' : '是'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="层级">
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pagesize"
      :current-page="pagenum"
      :total="categoryTotal"
      @current-change="currentChange">
    </el-pagination>


    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="isShowAddCateDialog">
      <el-form ref="addCateForm" :model="addCateFormData" label-width="80px">
        <el-form-item prop="cat_name" label="分类名称">
          <el-input v-model="addCateFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="parentArr" label="父级名称">
          <el-cascader
          v-model="addCateFormData.parentArr"
          :options="cateOptions"
          :props="cateProps"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let ElTreeGrid = require('element-tree-grid');
  export default {
    components: {
      [ElTreeGrid.name]: ElTreeGrid
    },
    data(){
      return {
        categoryList: [],
        pagenum: 1,
        pagesize: 5,
        categoryTotal: 0,
        addCateFormData: {},
        isShowAddCateDialog: false,
        addCateFormData: {
          parentArr: [],
          cat_name: ''
        },
        cateOptions: [],
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          checkStrictly: true
        }
      }
    },
    created(){
      this.getCategoryList()
    },
    methods: {
      async getCategoryList(){
        let res = await this.$http({
          url: 'categories',
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        // console.log(res)
        this.categoryList = res.data.data.result
        this.categoryTotal = res.data.data.total
      },
      currentChange(value){
        this.pagenum = value
        this.getCategoryList()
      },
      async addCateBtn(){
        let res = await this.$http({
          url: 'categories',
          params: {
            type: 2
          }
        })
        // console.log(res)
        this.cateOptions = res.data.data
        this.isShowAddCateDialog = true
      },
      async addCategories(){
        let cat_name = this.addCateFormData.cat_name
        let cat_level = this.addCateFormData.parentArr.length
        let cat_pid = this.addCateFormData.parentArr.pop() || 0
        // console.log(cat_level, cat_pid)
        let res = await this.$http({
          url: 'categories',
          method: 'post',
          data: {
            cat_name,
            cat_level,
            cat_pid
          }
        })
        // console.log(res)
        if(res.data.meta.status == 201){
            this.$message({
                type: "success",
                message: res.data.meta.msg,
                duration: 1000
            })

            // 模态框关闭
            this.isShowAddCateDialog = false;
            // 重置表单
            this.$refs['addCateForm'].resetFields();
            console.log(this.$refs,1111111111);
            
            // 重新获取数据
            this.getCategoryList();
        }
      }
    }
  }
</script>
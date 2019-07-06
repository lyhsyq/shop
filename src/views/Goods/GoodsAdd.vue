<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <el-tabs v-model="selectName" @tab-click="tabClick" tab-position="left" style="margin-top: 20px">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="form" :model="basicGoodsForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="basicGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="basicGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="basicGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="basicGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="basicGoodsForm.catArr"
              :options="basicOptions"
              :props="basicProps">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio-group v-model="basicGoodsForm.is_promote">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          multiple
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileUploadSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="basicGoodsForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        active: 0,
        selectName: 'basic',
        basicGoodsForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          catArr: [],
          is_promote: 0,
          pics: [],
          goods_introduce: ''
        },
        basicOptions: [],
        basicProps: {
          label: "cat_name",
          value: "cat_id"
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      };
    },
    async created(){
      let res = await this.$http({
        url: 'categories'
      })
      console.log(res)
      this.basicOptions = res.data.data
    },

    methods: {
      //el-tabs的点击事件
      tabClick(tab){
       this.active = +tab.index
      },
      // 按钮 下一步 的点击事件
      next(index, name){
        this.active = index
        this.selectName = name
      },
      onFileUploadSuccess(res){
        // console.log(res)
        this.basicGoodsForm.pics.push({
          pic: res.data.tmp_path
        })
      },
      async addGoods(){
        this.basicGoodsForm.goods_cat = this.basicGoodsForm.catArr.join()
        let res = await this.$http({
          url: `goods`,
          method: 'post',
          data: this.basicGoodsForm
        })
        console.log(res)
        if(res.data.meta.status === 201){
          this.$router.push('/goods')
        }
      }
    }
  }
</script>
<style scoped>
  
</style>
<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6" class="col-img">
          <img src="../../assets/img/logo.png" alt="">
        </el-col>
        <el-col>
          <div class="span1">电商后台管理系统</div>
        </el-col>
        <el-col :span="7" class="grid-content">
            <div>
              <span>欢迎上海前端31期星曜会员</span>
              <a href="#" @click.prevent="login">退出</a>
            </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-col :span="12">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :router="true">
            <el-submenu 
            v-for="item1 in menusList"
            :index="'' + item1.id"
            :key="item1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item 
                v-for="item2 in item1.children"
                :index="'/' + item2.path"
                :key="item2.id">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{item2.authName}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data(){
      return {
        menusList: []
      }
    },
    async created(){
      let res = await this.$http({
        url: `menus`
      })
      console.log(res)
      this.menusList = res.data.data
    },
    methods: {
      login(){
        localStorage.removeItem('token')
        this.$router.push("/login")
      }
    }
  }
</script>

<style>
  .el-container .el-header {
    height: 60px;
    padding: 0;
    background-color: #b3c1cd;
  }
  .span1 {
    text-align: center;
    font-weight: bolder;
    font-size: 30px;
    color: #fff;
  }
  .grid-content {
    font-weight: bolder;
  }
  .grid-content a {
    color: orange;
  }
  .col-img img {
    width: 200px;
  }
  .el-aside {
    width: 200px;
    height: 100%;
    background-color: #545c64;
  }
  .el-aside .el-col {
    width: 100%;
  }
  .el-container {
    height: 100%;
  }
</style>

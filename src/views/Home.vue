<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6" class="col-img">
          <img src="../assets/img/logo.png" alt="">
        </el-col>
        <el-col>
          <div class="span1">电商后台管理系统</div>
        </el-col>
        <el-col :span="7" class="grid-content">
            <div>
              <span>欢迎上海前端31期星曜会员</span>
              <a href="#">退出</a>
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
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/user">
                  <i class="el-icon-menu"></i>
                  <span slot="title">用户列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">角色列表</span>
                </el-menu-item>
                 <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">权限列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">商品列表</span>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">分类参数</span>
                </el-menu-item>
                <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">商品分类</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">订单列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">数据报表表</span>
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

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchUserInfo"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="addUserBtn">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editOpenUser(row.id)"></el-button>
          <el-button type="danger" plain  size="mini" icon="el-icon-delete" @click="deletUser(row.id)"></el-button>
          <el-button type="success" plain  size="mini" icon="el-icon-check" @click="rolesBtn(row.id)">分配角色</el-button>
        </template>>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="currentchange">
    </el-pagination>

    <!-- 添加用户模态框 -->
    <el-dialog 
    title="添加用户" 
    :visible.sync="dialogFormVisible"
    @close="$refs.addUserForm.resetFields()"
    >
      <el-form :model="addUserForm" :rules="rules" ref="addUserForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息模态框 -->
    <el-dialog 
    title="修改用户信息" 
    :visible.sync="editdialogFormVisible"
    >
      <el-form :model="editUserForm" :rules="rules" ref="editUserForm" label-width="100px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editUserForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色模态框 -->
    <el-dialog title="分配角色" :visible.sync="isRoleListDialoshow">
      <el-form :model="RoleListData">
        <el-form-item label="用户名">
          <el-tag type="info">{{RoleListData.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="RoleListData.rid" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRoleListDialoshow = false">取 消</el-button>
        <el-button type="primary" @click="roles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import axios from "axios"
  export default {
    data() {
      return {
        tableData: [],
        total: 0,
        pagesize: 3,
        currentpage: 1,
        search: '',
        addUserForm: {},
        dialogFormVisible: false,
        editdialogFormVisible: false,
        editUserForm: {},
        isRoleListDialoshow: false,
        RoleListData: {},
        roleList: [],
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'change' }
          ],
          email: [
                    {
                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                        message: "邮箱格式不正确",
                        trigger: "change"
                    }
                ],
          mobile: [
            {
              pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
              message: "邮箱格式不正确",
              trigger: "change"
            }
          ]
        }
      }
    },
    methods: {
      // 分页
      currentchange(val){
        this.currentpage = val
        this.getUsers()
      },
      // 获取用户信息
      async getUsers(){
        try {
          let {data: {data, meta}} = await  this.$http({
            url: "users",
            params: {
              query: this.search,
              pagenum: this.currentpage,
              pagesize: this.pagesize
            }
          })
          this.tableData = data.users
          // console.log(data)
          this.total = data.total
        } catch(err) {
          console.log("数据请求失败")
        }
      },
      // 查询用户信息
      searchUserInfo(){
        this.getUsers()
      },
      // 删除用户
      async deletUser(id){
        try {
          await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          let res = await this.$http({
            url: `users/${id}`,
            method: 'delete'
          })
          // console.log(res)
          if(res.data.meta.status === 200){
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            });
            this.currentpage = 1
            this.getUsers()
          }
        } catch {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });  
        }
      },
      // 添加用户按钮
      addUserBtn(){
        this.dialogFormVisible = true
      },
      // 添加用户
      async addUser(){
        try {
           await this.$refs.addUserForm.validate()
          let res = await this.$http({
            url: 'users',
            method: 'post',
            data: this.addUserForm
          })
          console.log(res)
          if(res.data.meta.status === 201){
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            });
            this.dialogFormVisible = false
          } else {
             this.$message({
              message: res.data.meta.msg,
              type: 'error'
            });
          }
        }catch(err) {

        }
      },
      // 编辑用户信息按钮
      async editOpenUser(id){
        try {
          let res = await this.$http({
            url: `users/${id}`,
            method: 'get'
          })
          // console.log(res)
          if(res.data.meta.status === 200){
            this.editUserForm = res.data.data
            this.isRoleListDialoshow = true
          }
        } catch(err) {
          console.log(err)
        }
      },
      //编辑用户信息提交
      async editUser(){
        try{
          await this.$refs.editUserForm.validate()
          let res = await this.$http({
            url: `users/${this.editUserForm.id}`,
            method: 'put',
            data: {
              email: this.editUserForm.email,
              mobile: this.editUserForm.mobile
            }
          })
          console.log(res)
          if(res.data.meta.status === 200){
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            });
            this.editdialogFormVisible = false
            this.getUsers()
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: 'error'
            });
          }
        } catch(err) {

        }
      },
      // 分配角色按钮
      async rolesBtn(id){
        try {
          let res = await this.$http({
            url: `users/${id}`,
            method: 'get'
          })
          // 查询所有的用户角色
        let res2 = await this.$http({
          url: `roles`
        })
        console.log(res2)
          // console.log(res)
          if(res.data.meta.status === 200){
            this.RoleListData = res.data.data
            this.isRoleListDialoshow = true
          }
          this.roleList = res2.data.data
        } catch(err) {
          console.log(err)
        }
      },
      async roles(){
        let res = await this.$http({
          url: `users/${this.RoleListData.id}/role`,
          method: 'put',
          data: {
            rid: this.RoleListData.rid
          }
        })
        console.log(res)
        if(res.data.meta.status === 200){
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.isRoleListDialoshow = false
        }
      }
    },
    created(){
      // axios({
      //   url: "http://localhost:8888/api/private/v1/users",
      //   params: {
      //     pagenum: 1,
      //     pagesize: 5
      //   },
      //   headers: {
      //           Authorization: localStorage.getItem("token")
      //       }
      // }).then(({data: {data, meta}}) => {
      //   this.tableData = data.users
      // })
      this.getUsers()
    }
  }
</script>

<style>
  .el-breadcrumb.breadcrumb {
    background-color: #d4dae0;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    padding-left: 10px;
}
</style>
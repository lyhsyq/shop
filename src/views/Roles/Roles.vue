<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
      :data="rightsData"
      style="width: 100%"
      stripe
      ref="roleTable">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row class="level1" v-for="level1 in row.children" :key="level1.id" type="flex">
            <el-col :span="6">
              <el-tag
                closable
                @close="deleteRight(row, level1.id)">
                {{level1.authName}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id" type="flex">
                <el-col :span="6">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(row, level2.id)">
                    {{level2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    closable
                    type="warning"
                    class="level3"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    @close="deleteRight(row, level3.id)">
                    {{level3.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
        width="180">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editRoleBtn(row)"></el-button>
          <el-button type="danger" plain  size="mini" icon="el-icon-delete" @click="deleteRole(row)"></el-button>
          <el-button type="success" plain  size="mini" icon="el-icon-check" @click="showAssainRightsDialog(row)">分配权限</el-button>
        </template>>
      </el-table-column>
    </el-table>


    <el-dialog title="角色授权" :visible.sync="isRoleRightsDialogsShow">
      <el-tree
        :data="rightsTreeData"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        node-key="id"
        :props="defaultProps"
        ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRoleRightsDialogsShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改角色信息" :visible.sync="isShowEditRoleDialog">
      <el-form :model="rolesData">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="rolesData.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="rolesData.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        rightsData: [],
        rightsTreeData: [],
        isRoleRightsDialogsShow: false,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        defaultCheckedKeys: [],
        currentEditRoleId: -1,
        isShowEditRoleDialog: false,
        rolesData: {}
      }
    },
    methods: {
      // 获得所有的角色列表
      async getRoleList(callback){
        let res = await this.$http({
          url: "roles"
        })
        console.log(res)
        this.rightsData = res.data.data
        callback && callback()
      },
      // 删除角色权限
      async deleteRight(row, id){
        // console.log(row, id)
        // 接口信息
        //  roles/:id/rights/:rightID
        // method: delete

        // let level1Ids = []
        // let level2Ids = []
        // let level3Ids = []
        // row.children.forEach(level1 => {
        //   level1Ids.push(level1.id)
        //   level1.children.forEach(level2 => {
        //     level2Ids.push(level2.id)
        //     level2.children.forEach(level3 => {
        //       level3Ids.push(level3.id)
        //     })
        //   })
        // })
        // let result = [...level1Ids, ...level2Ids, ...level3Ids]
        // let ids = result.filter(v => v !== id).join()

        let res = await this.$http({
          url: `roles/${row.id}/rights/${id}`,
          method: 'delete'
        })
        if (res.data.meta.status == 200) {
            this.$message({
                type: "success",
                message: res.data.meta.msg,
                duration: 1000
            });
        }
        this.getRoleList(() => {
          this.$nextTick(() => {
            this.$refs.roleTable.toggleRowExpansion(
                  this.rightsData.find(v => v.id == row.id),
                  true
              );
          })
        })
      },

      // 分配权限
      async updateRoleRights(){
        let rids = [...this.$refs.tree.getCheckedKeys(), 
        ...this.$refs.tree.getHalfCheckedKeys()].join()
        // console.log(this.$refs.tree.getCheckedKeys());
        // console.log(this.$refs.tree.getHalfCheckedKeys());
        let res = await this.$http({
          url: `roles/${this.currentEditRoleId}/rights`,
          method: 'post',
          data: {
            rids
          }
        })
        // console.log(res)
        if(res.data.meta.status === 200){
           this.$message({
              type: "success",
              message: res.data.meta.msg,
              duration: 1000
          });
          this.getRoleList()
          this.isRoleRightsDialogsShow = false
        }
      },
      // 展示分配权限模态框
      async showAssainRightsDialog(row){
        this.currentEditRoleId = row.id
        this.isRoleRightsDialogsShow = true
        let res = await this.$http({
          url: `rights/tree`
        })

        // console.log(res)
        this.rightsTreeData = res.data.data
        // let level1Ids = []
        // let level2Ids = []
        let level3Ids = []
        row.children.forEach(level1 => {
          // level1Ids.push(level1.id)
          level1.children.forEach(level2 => {
            // level2Ids.push(level2.id)
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id)
            })
          })
        })
        this.defaultCheckedKeys = [...level3Ids]
      },

      //删除角色
      async deleteRole(row){
        // console.log(row)
        try {
          await this.$confirm('此操作将永久删除该该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          let res = await this.$http({
            url: `roles/${row.id}`,
            method: 'delete'
          })
          // console.log(res)
          if(res.data.meta.status === 200){
            this.$message({
                type: "success",
                message: res.data.meta.msg,
                duration: 1000
            });
            this.getRoleList()
          }
        } catch(err) {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }
      },

      // 展示编辑角色模态框
      editRoleBtn(row){
        this.rolesData = row
        // console.log(this.rolesData)
        this.isShowEditRoleDialog = true
      },
      // 编辑提交角色
      async editRole(){
        let res = await this.$http({
          url: `roles/${this.rolesData.id}`,
          method: 'put',
          data: this.rolesData
        })
        // console.log(res)
        if(res.data.meta.status === 200){
            this.$message({
                type: "success",
                message: "修改成功",
                duration: 1000
            });
            this.isShowEditRoleDialog = false
            this.getRoleList()
          }
      }
    },
    created(){
      this.getRoleList()
    }
  }
</script>

<style scoped>
.level1 {
  border-bottom: 1px dashed #ccc;
  padding: 10px 0;
}
.level1:last-child {
  border-bottom: none;
}
.level2 {
  margin-bottom: 15px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
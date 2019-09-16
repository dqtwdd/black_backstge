<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card class="box-card">
      <el-button type="primary"
                 @click="addRolDiaVisible = true">添加角色</el-button>
      <el-table :data="rolesForm"
                border
                style="width: 100%">
        <!-- 拓展栏 -->
        <el-table-column type="expand">
          <template v-slot='scoped'>
            <el-row v-for="(item1,l1) in scoped.row.children"
                    :key=item1.id
                    :index=l1
                    :class="['botBor',l1==0? 'topBor':'']">
              <el-col :span="5">
                <el-tag @close='rightDel(scoped.row,item1.id)'
                        closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,l2) in item1.children"
                        :key=item2.id
                        :index=l2
                        :class="[l2==0? '':'topBor']">
                  <el-col :span="8">
                    <el-tag type='success'
                            @close='rightDel(scoped.row,item2.id)'
                            closable>
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='16'>
                    <el-tag type='warning'
                            v-for="(item3,l3) in item2.children"
                            :key=item3.id
                            :index=l3
                            closable
                            @close='rightDel(scoped.row,item3.id)'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
                <el-row>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 导航栏 -->
        <el-table-column type="index">
        </el-table-column>
        <!-- 角色名 -->
        <el-table-column prop="roleName"
                         label="角色名称"
                         width="230">
        </el-table-column>
        <!-- 角色描述 -->
        <el-table-column prop="roleDesc"
                         label="角色描述"
                         width="230">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template v-slot='rolId'>
            <el-button type="primary"
                       icon="el-icon-edit"
                       size='mini'
                       @click="acRol(rolId.row.id)">
              编辑
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size='mini'
                       @click='rolDel(rolId.row.id)'>
              删除
            </el-button>
            <el-button type="warning"
                       icon="el-icon-set-up"
                       @click="disRol(rolId.row)"
                       size='mini'>
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="addRolDiaVisible"
               width="50%"
               @close='reAddRolForm'>
      <el-form ref="rolAddForm"
               :model="rolAddForm"
               label-width="80px"
               :rules="rolAddFormRul">
        <el-form-item label="角色名"
                      prop='roleName'>
          <el-input v-model="rolAddForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop='roleDesc'>
          <el-input v-model="rolAddForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addRolDiaVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色"
               :visible.sync="ediRolDiaVisible"
               width="50%"
               @close='reEdiRolForm'>
      <el-form ref="rolEdiForm"
               :model="rolEdiForm"
               label-width="80px"
               :rules="rolEdiFormRul">
        <el-form-item label="角色名"
                      prop='roleName'>
          <el-input v-model="rolEdiForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop='roleDesc'>
          <el-input v-model="rolEdiForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="ediRolDiaVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="ediRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限树状图对话框 -->
    <el-dialog title="提示"
               :visible.sync="disRolVisible"
               width="50%"
               @close='reDefaultArr'>
      <el-tree :data="rightsList"
               :props="defaultProps"
               node-key="id"
               show-checkbox
               ref="rightId"
               :default-checked-keys="defaultArr"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="disRolVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesForm: [], // 角色列表
      addRolDiaVisible: false, // 添加角色对话框可见
      ediRolDiaVisible: false, // 编辑角色对话框可见
      disRolVisible: false, // 分配角色对话框可见
      rightsList: [], // 权限列表
      defaultProps: {
        children: 'children',
        label: 'authName'
      }, // 树状图
      rolAddForm: {
        roleName: '',
        roleDesc: ''
      }, // 添加角色内容绑定
      rolAddFormRul: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }, // 添加角色验证描述
      rolEdiForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      }, // 编辑角色内容绑定
      rolEdiFormRul: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }, // 编辑角色内容验证
      defaultArr: [], // 权限树状图默认选中arr
      disRightId: ''
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    // 获取角色方法
    async getRoles () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status === 200) {
        this.rolesForm = res.data
      } else {
        this.$message.error('获取角色列表失败')
      }
      // console.log(res)
    },
    // 添加角色方法
    addRole () {
      this.$refs.rolAddForm.validate(valid => {
        if (valid) {
          this.$http.post('roles', this.rolAddForm).then(res => {
            if (res.data.meta.status === 201) {
              this.$message.success('添加角色成功！')
              this.addRolDiaVisible = false
              this.getRoles()
            } else {
              this.$message.error('添加角色失败！')
            }
          })
        } else {
          this.$message.error('请检查格式')
        }
      })
    },
    // 添加角色对话框关闭清空
    reAddRolForm () {
      this.$refs.rolAddForm.resetFields()
    },
    // 编辑角色对话框关闭清空
    reEdiRolForm () {
      this.$refs.rolEdiForm.resetFields()
    },
    // 根据ID获取角色信息
    async acRol (rolId) {
      this.ediRolDiaVisible = true
      const { data: res } = await this.$http.get(`roles/${rolId}`)
      if (res.meta.status === 200) {
        this.rolEdiForm = res.data
      } else {
        this.$message.error('获取信息失败！')
      }
    },
    // 修改角色方法
    ediRole () {
      this.$refs.rolEdiForm.validate(valid => {
        if (valid) {
          this.$http.put(`roles/${this.rolEdiForm.roleId}`, this.rolEdiForm).then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success('修改成功！')
              this.getRoles()
              this.ediRolDiaVisible = false
            } else {
              this.$message.error('修改失败！')
            }
          })
        } else {
          this.$message.error('请检查格式！')
        }
      })
    },
    // 删除角色方法
    async rolDel (userId) {
      this.$confirm('是否确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${userId}`)
        if (res.meta.status === 200) {
          this.$message.success('删除成功！')
          this.getRoles()
        } else {
          this.$message.error('删除失败！')
        }
        // console.log(res)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除用户权限方法
    rightDel (role, rightid) {
      this.$confirm('是否确定删除该用户的该项权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${role.id}/rights/${rightid}`).then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success('删除成功！')
            // console.log(this.rolesForm)
            role.children = res.data.data
          } else {
            this.$message.error('修改失败！')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取权限树方法
    async disRol (role) {
      this.disRolVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限信息失败！')
      }
      this.disRightId = role.id
      this.rightsList = res.data
      this.getOwnedRightId(role)
      // console.log(this.disRightId)
    },
    // 获取某个角色已选中的权限ID
    getOwnedRightId (node) {
      if (!node.children) {
        return this.defaultArr.push(node.id)
      }
      node.children.forEach(node => {
        this.getOwnedRightId(node)
      })
    },
    // 关闭树状图对话框重置默认勾选数组
    reDefaultArr () {
      this.defaultArr = []
    },
    async addRights () {
      const keys = [
        ...this.$refs.rightId.getCheckedKeys(),
        ...this.$refs.rightId.getHalfCheckedKeys()
      ]
      const rightId = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.disRightId}/rights`, { rids: rightId })
      if (res.meta.status !== 200) {
        return this.$message.error('修改权限失败！')
      }
      this.$message.success('修改权限成功！')
      this.getRoles()
      // console.log(res)
      this.disRolVisible = false
    }
  }
}
</script>
<style scoped>
.topBor {
  border-top: 1px solid #ccc;
}
.botBor {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>

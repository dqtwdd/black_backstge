<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 底部卡片 -->
    <el-card class="box-card">
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容"
                    v-model="userParams.query"
                    clearable
                    @change=getUserList>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 显示表格 -->
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="username"
                         label="用户名"
                         width="100">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         width="130">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话"
                         width="130">
        </el-table-column>
        <el-table-column prop="role_name"
                         label="角色"
                         width="120">
        </el-table-column>
        <el-table-column prop="mg_state"
                         label="状态">
          <template v-slot="userState">
            <div>{{userState.row.mg_state}}</div>
            <el-switch v-model="userState.row.mg_state"
                       active-color="#13ce66"
                       inactive-color="#ccc"
                       @change='userStateChange(userState.row)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="190">
          <template v-slot='user'>
            <el-button type="primary"
                       icon="el-icon-edit"
                       size='mini'
                       @click="userAlt(user.row.id)">
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size='mini'
                       @click='userDel(user.row.id)'>
            </el-button>
            <el-tooltip class="item"
                        effect="dark"
                        :enterable=false
                        content="修改用户角色"
                        placement="top">
              <el-button type="warning"
                         icon="el-icon-set-up"
                         size='mini'
                         @click='getRol(user.row)'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination layout="total, sizes, prev, pager, next, jumper"
                     :page-size="userParams.pagesize"
                     :current-page="userParams.pagenum"
                     :total='this.total'
                     :page-sizes="[1, 2, 3, 5]"
                     @current-change='pageChange'
                     @size-change="handleSizeChange">
      </el-pagination>
    </el-card>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息"
               :visible.sync="altDialogVisible"
               width="50%">
      <el-form ref="userAltForm"
               :model="userAltForm"
               label-width="80px"
               :rules="userAltFormrules"
               @close='reAltForm'>
        <el-form-item label="用户名"
                      prop='username'>
          <el-input v-model="userAltForm.username"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop='email'>
          <el-input v-model="userAltForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop='mobile'>
          <el-input v-model="userAltForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="altDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="altUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               @close='reAddForm'>
      <el-form ref="userAddForm"
               :model="userAddForm"
               label-width="80px"
               :rules="userAddFormrules">
        <el-form-item label="用户名"
                      prop='username'>
          <el-input v-model="userAddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop='password'>
          <el-input v-model="userAddForm.password"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop='email'>
          <el-input v-model="userAddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop='mobile'>
          <el-input v-model="userAddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="disDialogVisible"
               width="50%"
               @close='reDisRolInfo'>
      <div>
        <p class='disRolSty'>
          当前用户名：{{disRolInfo.userName}}
        </p>
        <p class='disRolSty'>
          当前用户角色：{{disRolInfo.userRole}}
        </p>
        <p class='disRolSty'>
          分配新角色:
          <el-select v-model="disRolInfo.roleId"
                     placeholder="请选择">
            <el-option v-for="item in rolList"
                       :label="item.roleName"
                       :key="item.id"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="disDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="disRol">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 检查邮件地址
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^\w+@[a-z0-9]+\.[a-z]+$/i
      if (!(emailReg.test(value))) {
        callback(new Error('请输入正确的邮箱地址'))
      }
      callback()
    }
    // 检查电话号
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!(phoneReg.test(value))) {
        callback(new Error('请输入正确的电话号码'))
      }
      callback()
    }
    return {
      // 请求用户信息
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      tableData: [], // 表格数据
      total: 1,
      addDialogVisible: false, // 添加用户信息对话框可见
      disDialogVisible: false, // 分配角色对话框是否显示
      altDialogVisible: false, // 修改用户信息对话框可见
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }, // 添加用户表格内容
      userAltForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }, // 修改用户表格内容
      // 添加用户信息校验规则
      userAddFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ], //
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 修改用户信息校验规则
      userAltFormrules: {
        username: [],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }]
      },
      // 分配角色对话框显示的信息
      disRolInfo: {
        userId: '',
        userName: '',
        userRole: '',
        roleId: ''
      },
      // 请求角色列表
      rolList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.userParams })
      if (res.meta.status === 200) {
        this.tableData = res.data.users
        this.total = res.data.total
        this.pageNum = res.data.pagenum
        // console.log(res.data)
      } else {
        alert('请求错误')
      }
    },
    // 页码改变
    pageChange (num) {
      this.userParams.pagenum = num
      this.getUserList()
    },
    // 每页容量改变
    handleSizeChange (num) {
      this.userParams.pagesize = num
      this.getUserList()
    },
    // 修改用户状态
    async userStateChange (user) {
      const { data: res } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.meta.status !== 200) {
        this.$message('修改失败！')
      }
    },
    // 添加用户
    addUser () {
      this.$refs.userAddForm.validate(
        async valid => {
          if (!valid) {
            this.$message.error('请检查格式')
          } else {
            const { data: res } = await this.$http.post('users', this.userAddForm)
            if (res.meta.status === 201) {
              this.$message.success('创建成功！')
              this.addDialogVisible = false
              this.getUserList()
            } else {
              this.$message.error('创建失败！')
              // console.log(res.meta.status)
              this.addDialogVisible = false
            }
          }
        }
      )
    },
    // 修改用户
    userAlt (userId) {
      this.altDialogVisible = true
      this.$http.get(`users/${userId}`).then(res => {
        if (res.data.meta.status === 200) {
          this.userAltForm = res.data.data
        } else {
          this.message.error('请求失败!')
        }
        // console.log(userId, this.userAltForm)
      })
    },
    // 删除用户
    async userDel (userId) {
      this.$confirm('是否确定删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${userId}`)
        if (res.meta.status === 200) {
          this.$message.success('删除成功！')
          this.getUserList()
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
    // 添加表格关闭清空
    reAddForm () {
      this.$refs.userAddForm.resetFields()
    },
    // 修改表格关闭清空
    reAltForm () {
      this.$refs.userAltForm.resetFields()
    },
    // 修改用户信息
    altUser () {
      this.$refs.userAltForm.validate(valid => {
        if (!valid) {
          this.$message.error('请检查格式')
        } else {
          this.$http.put(`users/${this.userAltForm.id}`, this.userAltForm).then(res => {
            if (res.data.meta.status === 200) {
              // console.log(res)
              this.getUserList()
              this.altDialogVisible = false
              this.$message.success('修改成功！')
            } else { this.$message.error('修改失败！') }
          })
        }
      })
    },
    // 获取用户角色列表
    async getRol (userInfo) {
      this.disDialogVisible = true
      this.disRolInfo.userName = userInfo.username
      this.disRolInfo.userRole = userInfo.role_name
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败！')
      }
      this.rolList = res.data
      this.disRolInfo.userId = userInfo.id
      // console.log(userInfo.id)
    },
    // 分配角色
    async disRol () {
      const { data: res } = await this.$http.put(`users/${this.disRolInfo.userId}/role`, { rid: this.disRolInfo.roleId })
      // console.log(res, this.disRolInfo.userId, this.disRolInfo.roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败！')
      }
      this.$message.success('修改成功！')
      this.disDialogVisible = false
      this.getUserList()
      // console.log(this.disRolInfo)
    },
    reDisRolInfo () {
      this.disRolInfo = {}
    }
  }
}
</script>
<style scoped lang="scss">
.disRolSty {
  margin-bottom: 10px;
}
</style>

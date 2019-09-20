<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 底部卡片 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button @click="addCate"
                     type="primary">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="categories"
                border
                row-key="cat_id"
                style="width: 100%">
        <!-- index列 -->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="cat_name"
                         label="分类名称"
                         width="180">
        </el-table-column>
        <el-table-column label="是否有效"
                         prop=cat_deleted
                         width="180">
          <template v-slot='ifok'>
            <i v-if="!ifok.row.cat_deleted"
               style="color: lightgreen"
               class="el-icon-success"></i>
            <i v-if="ifok.row.cat_deleted"
               style="color: red"
               class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level"
                         label="排序">
          <template v-slot='rank'>
            <el-tag v-if="rank.row.cat_level === 0">一级</el-tag>
            <el-tag type='success'
                    v-else-if="rank.row.cat_level ===1 ">二级</el-tag>
            <el-tag type='warning'
                    v-else>三级</el-tag>
          </template>
        </el-table-column>
        <!-- 按钮列 -->
        <el-table-column label="操作">
          <template v-slot='good'>
            <el-button @click='displayEdiCateForm(good.row)'
                       type="primary"
                       icon="el-icon-edit"
                       size='mini'>
              编辑
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size='mini'>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination layout="total, sizes, prev, pager, next, jumper"
                     :page-size="requestClassificationParameter.pagesize"
                     :current-page="requestClassificationParameter.pagenum"
                     :total='this.total'
                     :page-sizes="[1, 2, 3, 5]"
                     @current-change='pageChange'
                     @size-change="handleSizeChange">
      </el-pagination>
      <!-- 分页 -->
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close='reAddCateForm'>
      <el-form ref="addCateForm"
               :rules="addCateFormRules"
               :model="addCateForm"
               label-width="100px">
        <el-form-item prop='cat_name'
                      label="分类名称:">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item prop='cateSelected'
                      label="父级分类:">
          <el-cascader v-model="addCateSelected"
                       :options="addCateSelect"
                       clearable
                       :props="optionProps"
                       @change='selectValChange'></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureAddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类名称对话框 -->
    <el-dialog title="修改分类名称"
               :visible.sync="ediCateDialogVisible"
               width="50%">
      <el-form ref="ediCateForm"
               :rules="ediCateFormRules"
               :model="ediCateForm"
               label-width="100px">
        <el-form-item prop='cat_name'
                      label="分类名称:">
          <el-input v-model="ediCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="ediCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="ediCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 请求分类参数
      requestClassificationParameter: {
        pagenum: 1,
        pagesize: 5
      },
      total: 1,
      // 请求分类列表存放在这里
      categories: [],
      // 添加分类对话框显示
      addCateDialogVisible: false,
      // 修改分类名称对话框显示
      ediCateDialogVisible: false,
      // 添加分类表格内容
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0

      },
      addCateSelected: [], // 父级分类选择框选择完成后存放在这
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 添加商品分类的父级分类选择框请求后渲染在这里
      addCateSelect: [],
      // el-cascade props配置选项
      optionProps: { checkStrictly: true, expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' },
      // 编辑产品名称
      ediCateForm: {
        cat_name: '',
        cat_id: 0
      },
      // 编辑产品名称验证规则
      ediCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getCategories()
  },
  methods: {
    // 获取商品分类列表
    async getCategories () {
      const { data: res } = await this.$http.get('categories', { params: this.requestClassificationParameter })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.categories = res.data.result
      this.total = res.data.total
      // console.log(res.data.result)
    },
    pageChange (num) {
      this.requestClassificationParameter.pagenum = num
      this.getCategories()
    },
    handleSizeChange (num) {
      this.requestClassificationParameter.pagesize = num
      this.getCategories()
    },
    // 添加分类
    async addCate () {
      this.addCateDialogVisible = true
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.addCateSelect = res.data
      // console.log(this.addCateSelect)
    },
    // 添加分类对话框关闭后重置form
    reAddCateForm () {
      this.$refs.addCateForm.resetFields()
      this.addCateSelected = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      // console.log(this.addCateForm)
    },
    // 选择菜单变化后触发的时间
    selectValChange () {
      const arrLength = this.addCateSelected.length
      if (arrLength === 0) {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
        // console.log(this.addCateForm)
        return
      }
      this.addCateForm.cat_level = arrLength
      this.addCateForm.cat_pid = this.addCateSelected[arrLength - 1]
      // console.log(this.addCateForm)
    },
    // 提交添加商品信息
    sureAddCate () {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) {
          this.$message.error('请检查格式')
        } else {
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status === 201) {
            this.$message.success('创建成功！')
            this.addCateDialogVisible = false
            this.getCategories()
          } else {
            this.$message.error('创建失败！')
            this.addDialogVisible = false
          }
        }
      })
    },
    // 显示编辑表格
    displayEdiCateForm (goodInfo) {
      this.ediCateDialogVisible = true
      this.ediCateForm.cat_id = goodInfo.cat_id
      this.ediCateForm.cat_name = goodInfo.cat_name
      console.log(this.ediCateForm)
    },
    // 提交编辑信息
    ediCate () {
      this.$refs.ediCateForm.validate(async val => {
        if (!val) {
          return this.$message.error('请检查格式')
        }
        const { data: res } = await this.$http.put(`categories/${this.ediCateForm.cat_id}`, { cat_name: this.ediCateForm.cat_name })
        if (res.meta.status !== 200) {
          console.log(res, this.ediCateForm.cat_name)
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功！')
        this.ediCateDialogVisible = false
        this.getCategories()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-cascader {
  width: 100%;
}
</style>

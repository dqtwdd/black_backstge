<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsForm"
                border
                style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="authName"
                         label="权限名称"
                         width="250">
        </el-table-column>
        <el-table-column prop="path"
                         label="路径"
                         width="250">
        </el-table-column>
        <el-table-column prop="level"
                         label="权限等级">
          <template v-slot='rightsLev'>
            <el-tag v-if="rightsLev.row.level ==='0'">一级</el-tag>
            <el-tag type='success'
                    v-else-if="rightsLev.row.level ==='1'">二级</el-tag>
            <el-tag type='warning'
                    v-else>二级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightsForm: []
    }
  },
  created () {
    this.getRights()
  },
  methods: {
    async getRights () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status === 200) {
        this.rightsForm = res.data
      } else {
        this.$message.error('获取权限列表失败')
      }
      // console.log(res)
    }
  }
}
</script>
<style scoped>
</style>

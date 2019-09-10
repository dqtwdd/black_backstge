<template>
  <el-container>
    <el-header>
      <div>
        <img src='@/assets/logo.png'>
        后台管理系统
      </div>
      <el-button @click='logout'>
        退出登录
      </el-button>
    </el-header>
    <el-container>
      <el-aside :width="ifCollapse ? '65px':'200px'">
        <span class='collapse'
              @click='collapse'>|||</span>
        <el-menu :default-active="acItem"
                 class="el-menu-vertical-demo"
                 background-color="#333744"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 unique-opened
                 :collapse='ifCollapse'
                 :collapse-transition='false'
                 router>
          <el-submenu v-for='item in menuList'
                      :key='item.id'
                      :index="item.id+''">
            <template slot="title">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="iconFont[item.id]"></use>
              </svg>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for='itemInside in item.children'
                          :key='itemInside.id'
                          :index="'/'+itemInside.path"
                          @click="activeItem('/'+itemInside.path)">
              <template slot="title">
                <svg class="icon"
                     aria-hidden="true">
                  <use xlink:href="#icon-lunkuodasan-1"></use>
                </svg>
                <span>{{itemInside.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '@/assets/font/iconfont.js'
export default {
  data () {
    return {
      menuList: [],
      iconFont: {
        '125': '#icon-lunkuodasan-2',
        '103': '#icon-lunkuodasan-',
        '101': '#icon-lunkuodasan-4',
        '102': '#icon-lunkuodasan-3',
        '145': '#icon-lunkuodasan-6'
      },
      ifCollapse: false,
      acItem: ''
    }
  },
  created () {
    this.$http.get('menus').then(res => {
      this.menuList = res.data.data
      // console.log(this.menuList)
    })
    this.acItem = window.sessionStorage.getItem('activeItem')
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    collapse () {
      this.ifCollapse = !this.ifCollapse
    },
    activeItem (acItem) {
      window.sessionStorage.setItem('activeItem', acItem)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #373d41;
  font-size: 20px;
  color: white;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      margin: 20px;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background-color: white;
    }
  }
}
.el-aside {
  display: flex;
  flex-direction: column;
  background-color: #333744;
  .el-menu {
    border: none;
  }
  .collapse {
    background-color: #394253;
    cursor: pointer;
    color: white;
    letter-spacing: 5px;
    text-align: center;
  }
}
</style>

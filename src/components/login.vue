<template>
  <div class='login_continer'>
    <div class='profile'>
      <img src='../assets/logo.png'>
    </div>
    <el-form ref='form'
             :model='form'
             class='inputbox'
             :rules="rules">
      <el-form-item prop='username'>
        <el-input prefix-icon='iconfont icon-yonghu'
                  placeholder='请输入用户名'
                  v-model='form.username'>
        </el-input>
      </el-form-item>
      <el-form-item prop='password'>
        <el-input prefix-icon="iconfont icon-mima"
                  placeholder='请输入密码'
                  v-model='form.password'
                  show-password>
        </el-input>
      </el-form-item>
      <el-form-item class='btn'>
        <el-button type='primary'
                   @click='signin'>登录</el-button>
        <el-button type='info'
                   @click='reform'>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reform () {
      this.$refs.form.resetFields()
    },
    signin () {
      this.$refs.form.validate(
        valid => {
          if (!valid) {
            this.$message.error('请检查格式')
          } else {
            this.getinfo()
          }
        }
      )
    },
    getinfo () {
      this.$http.post('login', { ...this.form }).then(loginRes => {
        // console.log(loginRes.data)
        if (loginRes.data.meta.status === 200) {
          this.$message.success('登录成功！')
          window.sessionStorage.setItem('token', loginRes.data.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('请检查用户名密码！')
        }
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$gary: #2b4b6b;
.login_continer {
  height: 100%;
  background-color: $gary;
  color: aquamarine;
}
.inputbox {
  box-sizing: border-box;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 450px;
  height: 300px;
  border-radius: 2px;
  background-color: white;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  padding: 0 40px;
  .btn {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
  }
}
.profile {
  position: absolute;
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: solid 2px #ccc;
  background-color: white;
  box-shadow: 0px 0px 10px #ccc;
  transform: translate(-50%, -50%);
  top: 30%;
  left: 50%;
  z-index: 10;
  padding: 10px;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #ccc;
  }
}
</style>

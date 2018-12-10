<template>
  <div class="register" ref="register">
    <div class="register-box">
      <div class="ta-c">
        <h1 class="f-size-32 register-title">Uni-Switch</h1>
        <p class="f-size-14 register-sub-title mt20">可信数据交换平台</p>
      </div>
      <el-form class="loing-form" ref="form" :rules="rules" :model="form" label-width="0px">
        <el-form-item prop="UserName" label="用户名">
          <el-input @keyup.native.enter="login" class="w360 mt40 bd-radius-4 dis-block login-input" v-model="form.UserName" placeholder="账户">
            <i slot="prefix" class="user-icon"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="PassWord" label="密码">
          <el-input type="password" @keyup.native.enter="login" class="w360 mt24 bd-radius-4 dis-block login-input" v-model="form.PassWord" placeholder="密码">
            <i slot="prefix" class="password-icon"></i>
          </el-input>
        </el-form-item>
        <div class="ta-c">
          <el-button class="w360 mt24 login-btn" type="primary" @click="login">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import Head from '../common/header.vue'
  import ServerAddress from '../../api/serverAddress.js'
  import http from '../../api/http.js'
  import api from '../../api/api.js'
  export default {
    name: 'register',
    data() {
      return {
        form: {
          UserName: '',
          PassWord: ''
        },
        rules: {
          UserName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          PassWord: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
      login() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            try {
              http(ServerAddress.login, this.form, 'post').then(response => {
                let { data } = response
                const { result } = data = JSON.parse(data);
                if (data.code === 0) {
                  api.setLS('userInfo', JSON.stringify(result));
                  const params = {
                    Token: result.token,
                    UserId: result.userId,
                  }
                  http(ServerAddress.userDetail, params, 'post').then(userResponse => {
                    let userDetailData = userResponse.data.data;
                    if (userResponse.data.code ===0) {
                      result.address = userDetailData.publicKey;
                      result.password = this.form.PassWord;
                      result.linkaddress = JSON.stringify({
                        Code: userDetailData.organization,
                        Title: userDetailData.organName,
                      });
                      api.setLS('userInfo', JSON.stringify(result));
                      this.$router.push('/home');
                    } else {
                      this.$message.error('查询用户信息失败')
                    }
                    // http(ServerAddress.getOrganNameByCode, organazationParams, 'get').then(organazationResponse => {
                    //   const linkaddress = {
                    //     Code: userDetailData.result.address,
                    //     Title: organazationResponse.data.data
                    //   }
                    //   result.linkaddress = JSON.stringify(linkaddress);
                    // })
                  });
                } else {
                  this.$message.error(data.msg)
                }
              });
            } catch (e) {
              console.log(e)
            }
          } else {
            return false;
          }
        });
      },
    },
    created() {
    },
    mounted() {
    },
    components: {
      Head,
    }
  }
</script>

<style lang="less">
  .register {
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    background: url('../../assets/imgs/login/bg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .register-box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .register-title {
        color: rgba(255,255,255,0.85);
      }
      .register-sub-title {
        color: rgba(255,255,255,0.45);
      }
      .bd-radius-4 {
        border-radius: 4px;
      }
      .user-icon, .password-icon {
        font-size: 14px;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-left: 5px;
        margin-top: 10px;
        color: rgba(0,0,0,0.25);
      }
      .user-icon {
        background: url('../../assets/imgs/login/user.svg') no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
      }
      .password-icon {
        background: url('../../assets/imgs/login/pwd.svg') no-repeat;
        background-size: 100% 100%;
        width: 12px;
      }
      .login-input {
        .el-input__inner {
          height: 40px;
        }
      }
      .loing-form {
        .el-form-item__label {
          display: none;
        }
      }
      .login-btn {
        border: none;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#18BEF8), to(#0A8AEE));
        height: 40px;
        box-shadow: 0 2px 5px 1px #0D3962;
        border-radius: 4px;
        font-size: 16px;
        letter-spacing: 10px;
      }
    }
    
  }
</style>
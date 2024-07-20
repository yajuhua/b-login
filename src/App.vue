<template>
  <div id="app" class="container">
    <h2>二维码登录获取ac_time_value和cookie</h2>
    <div class="qr-container">
      <img
          alt="bilibili qrcode login"
          src="https://socialsisteryi.github.io/bilibili-API-collect/assets/2233login-eb1b3759.png"
          class="login-img"
      />
      <vue-qr :text="qrUrl" :size="300" class="qr-code"></vue-qr>
    </div>
    <div v-if="loading" class="loading">请稍等...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>
    <div class="buttons">
      <el-button v-if="refresh_token" @click="copy(refresh_token,'复制ac_time_value成功！')" type="primary">复制ac_time_value</el-button>
      <el-button v-if="cookies" @click="copy(cookies,'复制cookie成功！')" type="success">复制cookie</el-button>
    </div>
    <footer class="footer">
      <a href="https://github.com/yajuhua/b-login" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
    </footer>
  </div>
</template>

<script>
import VueQr from 'vue-qr';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    VueQr,
  },
  data() {
    return {
      qrUrl: '',
      qrcodeKey: '',
      loading: false,
      error: null,
      refresh_token: null,
      cookies: '',
      message: null
    };
  },
  created() {
    this.getQrcodeKey();
  },
  methods: {
    async getQrcodeKey() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/generateQrcode');
        if (response.data.code === 0) {
          this.qrcodeKey = response.data.data.qrcode_key;
          this.qrUrl = `https://passport.bilibili.com/h5-app/passport/login/scan?navhide=1&qrcode_key=${this.qrcodeKey}&from=main-fe-header`;
          this.pollLoginStatus();
        } else {
          this.error = response.data.message;
        }
      } catch (err) {
        this.error = '刷新一下页面再试试';
      } finally {
        this.loading = false;
      }
    },
    async pollLoginStatus() {
      this.loading = true;
      this.error = null;
      try {
        const interval = setInterval(async () => {
          const response = await axios.get(`/api/checkLogin?qrcode_key=${this.qrcodeKey}`);
          if (response.data.data.data.code === 0) {
            this.refresh_token = response.data.data.data.refresh_token;
            this.cookies = response.data.cookies || ''; // 设置 cookies 数据
            this.message = response.data.data.data.message;
            clearInterval(interval);
            return;
          }else if (response.data.data.data.code === 86101){
            this.message = response.data.data.data.message;
          }else if (response.data.data.data.code === 86090){
            this.message = response.data.data.data.message;
          }else if (response.data.data.data.code === 86038){
            this.message = response.data.data.data.message;
            clearInterval(interval);
            return;
          }
        }, 3000); // 每3秒轮询一次
      } catch (err) {
        this.error = 'Error checking login status.';
      } finally {
        this.loading = false;
      }
    },

    //复制内容
    copy(text,tip) {
      const textarea = document.createElement('textarea');

      textarea.value = text;

      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      // 延迟显示复制成功提示
      setTimeout(() => {
        this.$message({
          message: tip,
          type: 'success'
        });
      }, 100);

      console.log('内容已成功复制到剪贴板');
    }
  }
};
</script>

<style>
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.login-img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.qr-code {
  margin: 10px 0;
}

.loading,
.error,
.message {
  margin: 10px 0;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.el-button {
  margin: 5px;
}
.footer {
  margin-top: auto; /* Push the footer to the bottom */
  padding: 10px 0;
  background-color: #f1f1f1;
  border-top: 1px solid #ddd;
}
</style>

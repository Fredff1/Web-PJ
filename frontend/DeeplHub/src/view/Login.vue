<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Deep Learning Teaching Platform</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label>Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            required
          />
        </div>

        <div class="form-item">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            required
          />
        </div>

        <button class="login-btn" type="submit">
          Login
        </button>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const username = ref("")
const password = ref("")
const errorMessage = ref("")

const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ""

  try {
    const response = await axios.post("/api/login", {
      username: username.value,
      password: password.value
    })

    const token = response.data.token

    // 保存 token
    localStorage.setItem("token", token)

    // 跳转首页
    router.push("/")
  } catch (error) {
    errorMessage.value = "Invalid username or password"
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.login-card {
  width: 350px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  margin-bottom: 25px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-item input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: #409eff;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.login-btn:hover {
  background: #66b1ff;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
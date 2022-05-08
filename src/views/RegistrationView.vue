<template>
  <div class="wrapper">
    <form class="form" @input="checkForm" @submit.prevent="registration">
      <p class="form__title">{{ title }}</p>
      <div class="form__input-wrapper">
        <input type="text" v-model="username" class="form__input" :class="{ error : usernameError }" name="login" :placeholder="$t('form.username')">
        <input type="text" v-model="email" class="form__input" :class="{ error : emailError }" name="mail" :placeholder="$t('form.email')">
        <input type="password" v-model="password" class="form__input" :class="{ error : passwordError }" name="password" :placeholder="$t('form.password')">
      </div>
      <input type="submit" class="form__submit" :disabled="disabled" :value="$t('form.register')">
      <router-link class="form__link" to="/login">{{ $t("form.login") }}</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      title: '',
      disabled: true,
      username: '',
      email: '',
      password: '',
      usernameError: true,
      emailError: true,
      passwordError: true
    }
  },
  methods: {
    checkForm() {
      this.usernameError = !this.username

      this.emailError = !this.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)

      this.passwordError = !this.password

      this.disabled = this.usernameError || this.emailError || this.passwordError
    },
    async registration() {
      const response = await this.$store.dispatch('registration', {
        username: this.username,
        email: this.email,
        password: this.password
      })
      if (response.data && response.data.token) {
        this.$router.push('/', {replace: true})
      }
    }
  },
  mounted() {
    this.title = process.env.VUE_APP_TITLE
  }
}
</script>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

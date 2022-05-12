<template>
  <div class="wrapper">
    <form class="form" @input="checkForm" @submit.prevent="login">
      <p class="form__title">{{ title }}</p>
      <div class="form__input-wrapper">
        <input autocomplete="email" type="text" v-model="email" :class="{ error : emailError }" class="form__input" name="email" :placeholder="$t('form.email')">
        <input autocomplete="password" type="password" v-model="password" :class="{ error : passwordError }" class="form__input" name="password" :placeholder="$t('form.password')">
      </div>
      <input type="submit" class="form__submit" :disabled="disabled" :value="$t('form.login')">
      <router-link class="form__link" to="/registration">{{ $t("form.registration") }}</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      title: '',
      disabled: true,
      email: '',
      password: '',
      emailError: true,
      passwordError: true
    }
  },
  methods: {
    checkForm() {
      this.emailError = !this.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)

      this.passwordError = !this.password

      this.disabled = this.emailError || this.passwordError
    },
    async login() {
      const response = await this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
      if (response.data && response.data.token) {
        this.$router.push('/')
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

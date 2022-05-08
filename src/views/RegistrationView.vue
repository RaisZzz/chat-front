<template>
  <div class="wrapper">
    <form class="form">
      <p class="form__title">{{ title }}</p>
      <div class="form__input-wrapper">
        <input type="text" class="form__input" name="login" :placeholder="$t('form.username')">
        <input type="password" class="form__input" name="password" :placeholder="$t('form.password')">
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
      disabled: true
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

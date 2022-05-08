<template>
  <div class="container">
    <router-view />
    <transition name="opacity">
      <p class="error" v-if="error" @click="closeError">{{ error }}</p>
    </transition>
  </div>
</template>
<script>
export default {
  methods: {
    closeError() {
      this.$store.commit('closeError')
    }
  },
  mounted() {
    localStorage.setItem('locale', 'ru')
  },
  computed: {
    error() {
      return this.$store.getters['error']
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&display=swap');
:root {
  --primary-color: #524FFF;
  --secondary-color: #3F3F3F;
  --bg-color: #F1F1F1;
  --hover-color: #9997FF;
  --primary-color-invert: #FFFFFF;
  --error-color: #FF5454;
  --main-trans: 0.3s;
  --header-height: 80px;
  --sidebar-width: 250px;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
a[class] {
  text-decoration: none;
}
ul[class] {
  list-style: none;
}
body {
  font-family: 'Montserrat', sans-serif;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background-color: #fff;
}
::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 6px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  max-height: 100%;
  padding: 20px 30px;
  background-color: var(--primary-color-invert);
  box-shadow: 0 0 250px rgba(82, 79, 255, 0.1);
  border-radius: 10px;
}
.form__title {
  font-size: 28px;
  font-weight: 900;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-transform: uppercase;
}
.form__input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}
.form__input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #797979;
  color: #797979;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  transition: var(--main-trans);
}
.form__input:focus {
  border-color: var(--primary-color);
  color: var(--secondary-color);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}
.form__input.error {
  border-color: var(--error-color);
}
.form__submit {
  margin-top: 30px;
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
  border-radius: 5px;
  padding: 7px 15px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: var(--main-trans);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
}
.form__submit:hover {
  opacity: 0.5;
}
.form__submit:disabled {
  opacity: 1;
  background-color: var(--bg-color);
  color: var(--secondary-color);
  cursor: default;
}
.form__link {
  margin-top: 10px;
  font-size: 12px;
  color: var(--primary-color);
}
</style>

<style scoped>
.container {
  position: relative;
}
.error {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 999999;
  padding: 10px;
  background-color: var(--error-color);
  color: #FFFFFF;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
.opacity-enter-active,
.opacity-leave-active {
  transition: all var(--main-trans) ease;
}
.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
</style>

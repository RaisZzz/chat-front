<template>
  <div class="avatar-wrapper" :style="styles">
    <span class="avatar-title" v-if="title" :style="fontSize">{{title}}</span>
    <img v-else src="" alt="" class="avatar">
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      title: ''
    }
  },
  mounted() {
    if (!this.useravatar && this.username) {
      this.title = this.username.charAt(0)
    }
  },
  computed: {
    styles() {
      return {
        width: `${this.size}px`,
        'min-width': `${this.size}px`,
        height: `${this.size}px`
      }
    },
    fontSize() {
      return {
        'font-size': `${this.size/2.5}px`
      }
    }
  },
  props: ['username', 'useravatar', 'size']
}
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  background: var(--secondary-color);
  border-radius: 50%;
  overflow: hidden;
}
.avatar-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}
.avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

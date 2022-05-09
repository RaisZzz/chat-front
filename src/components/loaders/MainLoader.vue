<template>
  <div class="loader"></div>
</template>

<style scoped>
.loader {
  margin: 20px auto 0;
  width: 30px;
  height: 30px;
  border: 5px solid var(--primary-color);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

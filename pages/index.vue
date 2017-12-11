<template>
  <section class="container">
    <img id="tracking" src="http://localhost:3001/api/mails/tracking.gif" alt="Sent by Penguin Jeffrey" class="logo" />
    <p>Hello</p>
  </section>
</template>

<script>

export default {
  head () {
    return {
      title: 'index'
    }
  }
}
</script>

<style scoped>
.logo {
  width: 20px;
}
</style>

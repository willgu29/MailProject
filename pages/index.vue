<template>
  <section class="container">
    <img id="tracking" src="https://www.penguinjeffrey.com/api/mails/tracking" alt="Penguin Jeffrey Logo" class="logo" />

  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    let { data } = await axios.get('/api/users')
    return { users: data }
  },
  head () {
    return {
      title: 'Users'
    }
  }
}
</script>

<style scoped>
.logo {
  width: 20px;
}
</style>

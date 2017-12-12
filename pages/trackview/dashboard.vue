<template>
  <section class="container">
    <h1>Hello trackview.co</h1>
    <ul v-if="campaigns">
      <li v-for="(campaign, index) in campaigns" :key="index" class="item"></li>
    </ul>
    <div v-else>
      <p>Looks like you don't have any campaigns yet.</p>
      <p>Ask your admin to create one.</p>
    </div>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData (context) {
    var url = ('/api/campaigns')
    let { data } = await axios.get(url)
    return { campaigns: data }
  },
  head () {
    return {
      title: 'dashboard',
      campaigns: []
    }
  }
}
</script>

<style scoped>
.logo {
  width: 20px;
}
</style>

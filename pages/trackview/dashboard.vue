<template>
  <section class="container">
    <h1>Hello trackview.co</h1>
    <ul v-if="campaigns.length !== 0">
      <li v-for="(campaign, index) in campaigns" :key="index" class="item">
        <nuxt-link :to="{ name: 'trackview-campaigns-id', params: {id: campaign._id }}">
          {{campaign.name}}
        </nuxt-link>
      </li>
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
  asyncData ({ params, error }) {
    console.log(params)
    return axios.get('/api/campaigns/')
      .then((res) => {
        return { campaigns: res.data }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Users not found' })
      })
  },
  head () {
    return {
      title: 'dashboard'
    }
  }
}
</script>

<style scoped>

</style>

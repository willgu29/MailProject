<template>
  <section class="container">
    <div v-show="!showConfirm">
      <p class='text-wrap inline'>Unsubscribe from {{mail.sender}}?</p>
      <input type="submit" value="unsubscribe" v-on:click="unsubscribeEmail" />
    </div>
    <div v-show="showConfirm">
      <p class='text-wrap inline'><b>{{mail.to}}</b> has been unsubscribed.</p>
    </div>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  name: 'unsubscribe',
  asyncData ({ query, params, error }) {
    return axios.get('/api/mails/' + query.id)
      .then((res) => {
        return { mail: res.data }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Mail not found' })
      })
  },
  head () {
    return {
      title: `Unsubscribe: ${this.mail.to}`
    }
  },
  data () {
    return {
      mail: '',
      showConfirm: false
    }
  },
  methods: {
    unsubscribeEmail: function () {
      // unsubscribe email
      var self = this
      axios.post('/api/mails/unsubscribe', {
        id: this.mail._id
      }).then((res) => {
        console.log(res)
        self.showConfirm = true
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.inline {
  display: inline;
  padding-right: 10px;
}
.text-wrap {
  margin: 0 auto;
  width: 600px;
  text-align: left;
}
.title
{
  margin-top: 30px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 30px;
}
</style>

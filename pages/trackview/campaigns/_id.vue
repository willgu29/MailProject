<template>
  <section class="container">
    <h1>{{campaign.name}}</h1>
    <p>{{campaign}}</p>
    <ul>
      <li v-on:click="editHTML">Add/Update HTML</li>
      <li v-on:click="updateEmails">Add/Update Emails</li>
    </ul>
    <div v-show="viewOption === 0">
      <textarea v-model="html" class='editText'></textarea>
    </div>
    <div v-show="viewOption === 1">
      <textarea v-model="emails" class='editText'></textarea>
    </div>
    <input v-on:click="submit" type="submit" value="save" />
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  name: 'id',
  asyncData ({ params, error }) {
    return axios.get('/api/campaigns/' + params.id)
      .then((res) => {
        return { campaign: res.data }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Campaign not found' })
      })
  },
  head () {
    return {
      title: `Campaign: ${this.campaign.name}`
    }
  },
  data () {
    return {
      viewOption: 0,
      html: '<p>Add your html here</p>',
      emails: 'Separate emails with a , and no spaces',
      spinner: false
    }
  },
  methods: {
    editHTML: function () {
      this.viewOption = 0
    },
    updateEmails: function () {
      this.viewOption = 1
    },
    submit: function () {
      var url = '/api/campaigns/' + this.campaign._id
      if (this.viewOption === 0) {
        url = url + '?edit=html'
      } else {
        url = url + '?edit=emails'
      }
      this.spinner = true
      var self = this
      axios.post(url, {
        emails: this.emails,
        html: this.html
      }).then(function (res) {
        console.log(res)
        self.campaign = res.data
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.editText {
  width: 450px;
  height: 150px;
}
</style>

<template>
  <section class="container">
    <h1>{{campaign.name}}</h1>
    <div class='center' v-if="! campaign.isConverted">
          <p>Emails Added: {{campaign.to.length}}</p>
          <ul class='options'>
            <li class='list-item' v-on:click="editHTML">Add/Update HTML</li>
            <li class='list-item' v-on:click="updateEmails">Add/Update Emails</li>
          </ul>
          <h2>{{optionSelected}}</h2>
          <div v-show="viewOption === 0">
            <textarea v-model="html" class='editText'></textarea>
          </div>
          <div v-show="viewOption === 1">
            <textarea v-model="emails" class='editText'></textarea>
          </div>
          <input v-on:click="submit" type="submit" value="save" />
      <p>Notify your mail admin when this campaign is ready to be sent.</p>
    </div>
    <div class='center' v-else>
      <ul class='options'>
        <li class='list-item' v-on:click="viewCampaign">{{viewDetailsText}}</li>
      </ul>
      <div v-show="displayDetails">
        <h2>HTML Code</h2>
        <code>{{campaign.html}}</code>
        <h2>Emails</h2>
        <p>{{campaign.to}}</p>
      </div>
      <h2>Campaign Statistics</h2>
      <p>Emails Sent: {{campaign.sent}}/{{campaign.to.length}}</p>
      <p>Emails Opened: {{campaign.opened}}</p>
      <p>Emails Bounced: {{campaign.bounced}}</p>
      <p>Emails Unsubscribed: {{campaign.unsubscribed.length}}</p>
    </div>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  name: 'id',
  asyncData ({ params, error }) {
    return axios.get('/api/campaigns/' + params.id)
      .then((res) => {
        return { campaign: res.data, html: res.data.html, emails: res.data.to }
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
      optionSelected: 'Edit HTML',
      displayDetails: false,
      viewDetailsText: 'View Campaign Details'
    }
  },
  methods: {
    editHTML: function () {
      this.viewOption = 0
      this.optionSelected = 'Edit HTML'
    },
    updateEmails: function () {
      this.viewOption = 1
      this.optionSelected = 'Edit Emails'
    },
    viewCampaign: function () {
      this.displayDetails = !this.displayDetails
      if (this.displayDetails) {
        this.viewDetailsText = 'Close Campaign Details'
      } else {
        this.viewDetailsText = 'View Campaign Details'
      }
    },
    submit: function () {
      var url = '/api/campaigns/' + this.campaign._id
      if (this.viewOption === 0) {
        url = url + '?edit=html'
      } else {
        url = url + '?edit=emails'
        this.emails = this.emails.toString().replace(/\s+/g, '')
      }
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
.options {
  list-style: none;
  text-align: center;
  padding: 0;
  cursor: pointer;
}
.center {
  text-align: center;
  margin: 0px auto;
}
.list-item {
  color: purple;
}
.list-item:hover {
  text-decoration: underline;
}
</style>

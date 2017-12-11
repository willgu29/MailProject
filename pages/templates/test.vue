<template>
  <section class="container">
    <p>This is a test email.</p>
    {{id}}
    <img id="tracking" :src="trackingLink" alt="Sent by Penguin Jeffrey" class="logo" />
  </section>
</template>

<script>

export default {
  asyncData ({ query }) {
    var trackingLink = ('https://mail.penguinjeffrey.com/api/mails/tracking.gif?id=' + query.id)
    return {
      id: query.id || 'error',
      trackingLink: trackingLink || 'https://mail.penguinjeffrey.com/api/mails/tracking/missing-id'
    }
  },
  head () {
    return {
      title: 'test'
    }
  }
}
</script>

<style scoped>
.logo {
  width: 20px;
}
</style>

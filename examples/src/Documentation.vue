<template>
  <section>
    <prop-doc :component="TestFile"></prop-doc>
  </section>
</template>
<script>
import propDoc from '../../lib/index.js'
import TestFile from './TestFile.vue'

export default {
  name: 'documentation',
  components: { propDoc },
  data() {
    return { TestFile }
  }
}
</script>

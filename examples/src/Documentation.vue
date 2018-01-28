<template>
  <section>
    <prop-doc :component="checkOne"></prop-doc>
    <div>
      <h1>{{ checkTwo.name }}</h1>
      <ul>
        <li v-for="prop in checkTwo.props">
          {{ prop.name }} is a {{ prop.type }} - {{ prop.note }}
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import propDoc from 'propdoc'
import checkboxOne from './AllInOne.vue'
import checkboxTwo from './Separate.vue'
import checkboxTwoDocs from './Separate.doc.js'

export default {
  name: 'documentation',
  components: { propDoc },
  data() {
    return { checkOne: checkboxOne }
  },
  computed: {
    checkTwo() {
      return propDoc.getDoc(checkboxTwo,checkboxTwoDocs)
    }
  }
}
</script>

<template>
  <article class="propdoc" v-if="merged.name">
    <h2 class="title">{{ merged.name }}</h2>
    <h3 class="subtitle" v-if="merged.introduction">{{ merged.introduction }}</h3>
    <div class="use">
      <div class="description" v-html="description" v-if="merged.description"></div>
      <div class="token" v-if="merged.token"><pre><code>{{ merged.token | sanitize }}</code></pre></div>
    </div>
    <section class="props" v-if="merged.props">
      <div class="proprow labels">
        <div class="propcol name required">name <span>(required)</span></div>
        <div class="propcol type">type</div>
        <div class="propcol default">default</div>
        <div class="propcol notes">notes</div>
      </div>
      <div class="proprow" v-for="(propinfo, propname) in merged.props">
        <div class="propcol name" :class="{ required: propinfo.required }"><span>{{ propname }}</span></div>
        <div class="propcol type">{{ getType(propinfo.type) }}</div>
        <div class="propcol default">{{ getDefault(propinfo.default) }}</div>
        <div class="propcol notes">{{ propinfo.note }}</div>
      </div>
    </section>
  </article>
</template>
<script>
import marked from 'marked'

export default {
  name: 'propDoc',
  props: {
    component: {
      type: Object,
      required: true
    },
    documentation: {
      type: Object
    }
  },
  computed: {
    merged() {
      if (this.component && this.documentation) return Object.assign(this.component, this.documentation)
      return this.component
    },
    description() {
      return marked(this.merged.description)
    }
  },
  filters: {
    sanitize(text) {
      text = text.trim()
      const match = text.match(/^[ \t]*(?=\S)/gm)
      if (!match) return text
      const indent = Math.min.apply(Math, match.map(x => x.length))
      const re = new RegExp(`^[ \\t]{${indent}}`, 'gm')
      return indent > 0 ? text.replace(re, '') : text
    }
  },
  methods: {
    getDefault(d) {
      if (typeof(d) !== 'undefined') {
        if (typeof(d) === 'function') return JSON.stringify(d())
        return JSON.stringify(d)
      }
      return 'undefined'
    },
    getType(t) {
      if (typeof(t) === 'undefined') return 'any'
      let type = typeof(t())
      if (type === 'object') {
        if (Array.isArray(t())) return 'array'
      }
      return type
    }
  }
}
</script>

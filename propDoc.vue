<template>
  <article class="propdoc" v-if="merged && merged.name">
    <h2 class="title">{{ merged.name }}</h2>
    <h3 class="subtitle" v-if="merged.introduction">{{ merged.introduction }}</h3>
    <slot name="pre-use"></slot>
    <div class="use">
      <div class="description" v-html="merged.description" v-if="merged.description"></div>
      <div class="token" v-if="merged.token"><pre><code data-lang="vue">{{ merged.token }}</code></pre></div>
    </div>
    <slot name="pre-props"></slot>
    <section class="props" v-if="merged.props">
      <div class="proprow labels">
        <div class="propcol name required">name <span>(required)</span></div>
        <div class="propcol type">type</div>
        <div class="propcol default">default</div>
        <div class="propcol notes">notes</div>
      </div>
      <div class="proprow" v-for="(propinfo, propname) in merged.props">
        <div class="propcol name" :class="{ required: propinfo.required }"><span>{{ propname }}</span></div>
        <div class="propcol type">{{ propinfo.type }}</div>
        <div class="propcol default">{{ propinfo.default }}</div>
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
    },
    ignoreMixins: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { merged: this.process(this.component, this.documentation) }
  },
  getDoc(component, documentation, ignoreMixins) {
    return this.methods.process(component,documentation,ignoreMixins)
  },
  methods: {
    process(component, documentation,ignoreMixins) {
      let m = this.merge(component, documentation)
      if (m.token) m.token = this.sanitize(m.token)
      if (m.description) m.description = marked(m.description)
      if (! (ignoreMixins || this.ignoreMixins)) {
        if (m.mixins) m.props = this.merge(this.getPropsFromMixins(m.mixins), m.props)
      }
      if (m.props) m.props = this.processProps(m.props)
      return m
    },
    sanitize(text) {
      text = text.trim()
      const match = text.match(/^[ \t]*(?=\S)/gm)
      if (!match) return text
        const indent = Math.min.apply(Math, match.map(x => x.length))
      const re = new RegExp(`^[ \\t]{${indent}}`, 'gm')
      return indent > 0 ? text.replace(re, '') : text
    },
    getPropsFromMixins(mixins) {
      return mixins.reduce((map, mixin) => {
        Object.assign(map, mixin.props)
        return map
      }, {})
    },
    processProps(props) {
      let keys = Array.isArray(props) ? props : Object.keys(props)
      return keys.reduce((map, k) => {
        let v = new Proxy(props[k] || {}, this.basicArrayProxy)
        map[k] = {
          type: this.getType(v.type),
          required: v.required || false,
          default: this.getDefault(v.default),
          note: v.note || ""
        }
        return map
      }, {})
    },
    basicArrayProxy(target, name) {
      return name in target ? target[name] : undefined
    },
    getDefault(d) {
      if (typeof(d) !== 'undefined') {
        if (typeof(d) === 'function') return JSON.stringify(d())
        return JSON.stringify(d)
      }
      return 'undefined'
    },
    isTypeArray(t) {
        return ( typeof(t()) === 'object' && Array.isArray(t()) )
    },
    getType(t) {
      if (typeof(t) === 'undefined') return 'any'
      if (Array.isArray(t)) {
          return t.map(type => (this.isTypeArray(type) ? 'array' : typeof(type()))).join('|')
      }
      let type = typeof(t())
      if (this.isTypeArray(t)) return 'array'
      return type
    },
    merge(a, b) {
      return Object.assign({}, a, b)
    },
    hasMixins(component) {
      return typeof(component.mixins) !== 'undefined'
    }
  }
}
</script>

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
        <div class="propcol default">
          <!--optionally you can output this: {{ propinfo.defaultType }} -->
          <code
            v-if="['array', 'object', 'function'].includes(propinfo.defaultType)"
            style="white-space: pre-wrap;"
          >{{ propinfo.default }}</code>
          <span v-else>{{ propinfo.default }}</span>
        </div>
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

        let objInfo = {}

        objInfo = Object.assign(objInfo, {
          type: this.getType(v.type),
          required: v.required || false,
          default: this.getDefault(v.default, v.type, objInfo),
          // defaultType - this will be sets from the function which is on line above (getDefault)
          note: v.note || ""
        })

        map[k] = objInfo

        return map
      }, {})
    },
    basicArrayProxy(target, name) {
      return name in target ? target[name] : undefined
    },
    getDefault(d, forType, objInfo ) {
      if (typeof(d) === 'undefined') return 'undefined'

      if (getTypeString(d) === 'function') {
        // if type array or object then call default function to get default value
        if (getTypeString(forType) === 'function' && ['array', 'object'].includes(getTypeString(forType()))) {
          objInfo.defaultType = getTypeString(d())
          return JSON.stringify(d(), null, 2)
        }

        objInfo.defaultType = 'function'
        // if not array or object then hust get function in text format
        return d.toString()
      }

      objInfo.defaultType = getTypeString(d)
      // for all other types
      return JSON.stringify(d)
    },
    // works for all types
    getType(t) {
      // for null and undefined
      if (t == undefined) return 'any'

      if (getTypeString(t) === 'function') {
        return getTypeString(t())
      }
      if (Array.isArray(t)) {
        return t.map(this.getType)
      }

      return getTypeString(t)
    },
    merge(a, b) {
      return Object.assign({}, a, b)
    },
    hasMixins(component) {
      return typeof(component.mixins) !== 'undefined'
    }
  }
}

function getTypeString (variable) {
  return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
}
</script>

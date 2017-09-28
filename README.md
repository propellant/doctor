# propdoc [![Build Status](https://travis-ci.org/propellant/doctor.svg?branch=master)](https://travis-ci.org/propellant/doctor)

> quick and easy documentation of Vue.js components

#### installation

`npm install --save propdoc`

#### example output

This example was solely generated based on the extra fields described below.

![screenshot](https://github.com/propellant/doctor/blob/master/exampleOutput.png)

#### features

_propdoc_ proposes a new way of documenting Vue components, by including some (or all) of the documentation in the component itself.

Benefits:
- _props_ can be directly annotated, making documentation essentially the same as commenting a prop
- Documentation can live directly in the component - thus centralizing the documentation and hopefully helping the development/documentation cycle

Downsides:
- If all documentation is built into the options object, the component will use additional space
  - This can be mitigated by externalizing the larger proposed keys such as `description` and `token`

## new keys for your components

This example showcases all of what _propdoc_ would parse, however, none are required to be used and will not be output if absent.

```javascript
export default {
  name: 'checkbox',
  introduction: 'an amazing checkbox',
  description: `
  This \`checkbox\` is amazing, you should _check_ it out.
  `,
  token: "<checkbox label='foo'></checkbox>",
  props: {
    label: {
      type: String,
      default: '',
      note: "a label to be appended after the checkbox"
    }
  }
}
```

#### note

_note_ is used alongside expanded (object-style) props to describe that prop in more detail

#### introduction

a brief summary of what the component is or does

#### description

a more in-depth documentation of the component, will be parsed using Markdown. Note that code will need to be escaped if it's inside of a Javascript string literal.

#### token

a quick example of the component's actual use, great for providing a way to quickly copy/paste in the future


## use in your documentation

```Vue
<script>
import propDoc from 'propdoc'
import myComponent from './myComponent.vue'

export default {
  components: { propDoc },
  // bind your component to use propdoc's native template output
  data() {
    return { documentMe: myComponent }
  },
  // or call getDoc() and use the same data in your own template
  computed: {
    myComponentDoc() { return propDoc.getDoc(myComponent) }
  }
}
</script>

<template>
  <section>
    <prop-doc :component="documentMe"></prop-doc>
    <div>
      <h1>{{ myComponentDoc.name }}</h1>
      <p>{{ myComponentDoc.introduction }}</p>
    </div>
  </section>
</template>
```

#### props

- `component`: **required** and should be the component object itself
- `documentation`: optional, can be any subset of `component`, and will take precedence; useful for two functions
  - if the component's name or other fields should be output differently for documentation
  - for the optional documentation fields, as these will cause some additional space to be used by your components if not separated

#### slots

Two named slots are available for adding content to what _propdoc_ emits
- `pre-use` will add content before the _description_ and _token_ fields
- `pre-props` will add content before the prop tables are emitted

#### propDoc.getDoc

> available in v0.8 onward

`propDoc.getDoc(component, documentation)`

- merges the arguments passed to it, then processes them as described above in _keys_
- the `props` object will be converted into an array instead of an object to simplify parsing in your template
  - essentially this means you can do `v-for="prop in myDocumentedComponent.props"` and then `prop.name` instead of having to separate out the key/value

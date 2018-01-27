/* eslint no-unused-vars: 0 */
import { mount } from 'avoriaz'
import should from 'should'
import marked from 'marked'
import propDoc from '../propDoc.vue'
import testCheckboxMixin from './fixtures/checkboxMixin.vue'
import testCheckboxSolo from './fixtures/checkboxSolo.vue'

let tBasic = {
  name: 'foo',
  props: ['one', 'two', 'three']
}
let tAnnotations = {
  introduction: 'a brief intro to the component',
  description: `
    a more _in-depth_ description that will be rendered with markdown, using \`marked\`
  `,
  token: `<my-component foo="bar"></my-component>`
}
let tComplex = {
  name: 'bar',
  props: {
    first: {
      type: Array,
      required: true,
      note: 'this is a required array'
    },
    second: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    third: {
      type: Number,
      default: 100,
      note: 'this is a number that defaults to 100'
    },
    fourth: {
      type: String,
      default: 'world'
    },
    fifth: {
      required: true
    }
  }
}
let tTypes = {
  name: 'baz',
  props: {
    a: { type: String },
    b: { type: Number },
    c: { type: Boolean },
    d: { type: Function },
    e: { type: Object },
    f: { type: Array },
    g: { type: Symbol },
    h: { type: [String, Number, Boolean, Function, Object, Array, Symbol] }
  }
}
describe('propDoc.vue DOM', () => {
  it('renders an article with class propdoc', () => {
    const component = mount(propDoc, { propsData: { component: tBasic } })
    component.is('article').should.be.true()
    component.hasClass('propdoc').should.be.true()
  })
  it('renders nothing when given a bad prop (without even a name)', () => {
    const component = mount(propDoc, { propsData: { component: {} } })
    component.is('article').should.be.false()
  })
  it('renders a prop list with basic prop arrays', () => {
    const component = mount(propDoc, { propsData: { component: tBasic } })
    component.find('.proprow').length.should.be.exactly(4) // header row + 3 props
  })
  it('renders a prop list with complex prop arrays', () => {
    const component = mount(propDoc, { propsData: { component: tComplex } })
    component.find('.proprow').length.should.be.exactly(6) // header row + 5 props
  })
})
describe('propDoc.getDefault', () => {
  it('returns "undefined" (the text, not the value) when there is no default value', () => {
    const component = mount(propDoc, { propsData: { component: {} } })
    component.vm.getDefault(tBasic.props[0].default).should.be.exactly('undefined')
    component.vm.getDefault(tComplex.props.fifth.default).should.be.exactly('undefined')
  })
  it('returns the correct string when a default value is provided', () => {
    const component = mount(propDoc, { propsData: { component: {} } })
    component.vm.getDefault(tComplex.props.second.default).should.be.exactly(JSON.stringify(tComplex.props.second.default()))
    component.vm.getDefault(tComplex.props.third.default).should.be.exactly(JSON.stringify(100))
    component.vm.getDefault(tComplex.props.fourth.default).should.be.exactly(JSON.stringify('world'))
  })
})
describe('propDoc.getType', () => {
  it('returns "any" when there is no type specified', () => {
    const component = mount(propDoc, { propsData: { component: {} } })
    component.vm.getType(tBasic.props[0].type).should.be.exactly('any')
    component.vm.getType(tComplex.props.fifth.type).should.be.exactly('any')
  })
  it('returns the correct string when a type is specified', () => {
    const component = mount(propDoc, { propsData: { component: {} } })
    component.vm.getType(tTypes.props.a.type).should.be.exactly('string')
    component.vm.getType(tTypes.props.b.type).should.be.exactly('number')
    component.vm.getType(tTypes.props.c.type).should.be.exactly('boolean')
    component.vm.getType(tTypes.props.d.type).should.be.exactly('function')
    component.vm.getType(tTypes.props.e.type).should.be.exactly('object')
    component.vm.getType(tTypes.props.f.type).should.be.exactly('array')
    component.vm.getType(tTypes.props.g.type).should.be.exactly('symbol')
    component.vm.getType(tTypes.props.h.type).should.be.exactly('string|number|boolean|function|object|array|symbol')
  })
})
describe('propDoc option merging', () => {
  it('merges both props before render - documentation wins when two keys exist', () => {
    const component = mount(propDoc, { propsData: {
      component: tBasic,
      documentation: tComplex
    } })
    component.vm.merged.name.should.be.exactly(tComplex.name)
    component.vm.merged.props.first.should.be.ok()
  })
  it('merges both props before render - mutually exclusive keys are preserved', () => {
    const component = mount(propDoc, { propsData: {
      component: tComplex,
      documentation: tAnnotations
    } })
    component.vm.merged.name.should.be.exactly(tComplex.name)
    component.vm.merged.props.first.should.be.ok()
    component.vm.merged.introduction.should.be.ok()
    component.vm.merged.introduction.should.be.exactly('a brief intro to the component')
    component.vm.merged.description.should.be.ok()
    component.vm.merged.token.should.be.ok()
  })
})
describe('propDoc.methods.processProps(component)', () => {
  it('will annotate basic prop arrays by filling in appropriate types, defaults, etc', () => {
    let basicDoc = propDoc.getDoc(tBasic)
    basicDoc.name.should.be.exactly(tBasic.name)
    basicDoc.props.one.should.eql({
      type: 'any',
      required: false,
      default: 'undefined',
      note: ''
    })
  })
  it('adds notes found in the "note" key for each prop', () => {
    const component = mount(propDoc, { propsData: { component: tComplex } })
    component.find('.propcol.notes')[1].text().should.be.exactly(tComplex.props.first.note)
    component.find('.propcol.notes')[3].text().should.be.exactly(tComplex.props.third.note)
  })
  it('adds a "required" class to the name of any prop marked as required', () => {
    const component = mount(propDoc, { propsData: { component: tComplex } })
    component.find('.propcol.required')[1].text().should.be.exactly('first')
    component.find('.propcol.required')[2].text().should.be.exactly('fifth')
  })
  it('re-maps prop values to their processed equivalent', () => {
    let complexDoc = propDoc.getDoc(tComplex)
    complexDoc.name.should.be.exactly(tComplex.name)
    complexDoc.props.first.should.be.ok()
    complexDoc.props.first.type.should.be.exactly('array')
    complexDoc.props.first.required.should.be.exactly(true)
    complexDoc.props.first.note.should.be.exactly(tComplex.props.first.note)
  })
})
describe('propDoc.getDoc()', () => {
  it('will merge components and documentation, just like normal', () => {
    let completeDoc = propDoc.getDoc(tComplex, tAnnotations)
    completeDoc.name.should.be.exactly(tComplex.name)
    completeDoc.introduction.should.be.exactly(tAnnotations.introduction)
    completeDoc.description.should.be.exactly(marked(tAnnotations.description))
  })
})
describe('propDoc mixin handling', () => {
  it('will automatically bring in props from mixins', () => {
    propDoc.methods.hasMixins(testCheckboxSolo).should.be.false()
    propDoc.methods.hasMixins(testCheckboxMixin).should.be.true()
  })
  it('will pull props from mixins and return them as a normal prop object', () => {
    let mix = testCheckboxMixin.mixins
    propDoc.methods.getPropsFromMixins(mix).should.eql(mix[0].props)
  })
  it('will process props and mixin-props as though they were one object', () => {
    let allInOne = propDoc.getDoc(testCheckboxSolo)
    let propsInMixins = propDoc.getDoc(testCheckboxMixin)
    allInOne.props.should.eql(propsInMixins.props)
  })
  it('will ignore mixin-props when "ignore-mixins" is specified', () => {
    let allInOne = propDoc.getDoc(testCheckboxSolo)
    let propsInMixinsIgnored = propDoc.getDoc(testCheckboxMixin, null, true)
    allInOne.props.should.not.eql(propsInMixinsIgnored.props)
    const component = mount(propDoc, { propsData: { component: testCheckboxMixin, ignoreMixins: true } })
    component.vm.merged.should.eql(propsInMixinsIgnored)
  })
})

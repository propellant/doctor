<template>
    <label class="checkbox">
      <input type="checkbox">{{ label }}
    </label>
</template>

<script>
import input from './input.mixin.vue'

export default {
  name: 'testCheckbox',
  mixins: [ input ],
  props: {
    label: {
      type: String,
      default: '',
      note: "a label to be appended after the checkbox"
    }
  }
}
</script>

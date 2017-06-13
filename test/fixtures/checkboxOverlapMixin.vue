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
  props: [ 'label','disabled' ]
}
</script>

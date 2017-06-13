<template>
    <label class="checkbox">
      <input type="checkbox">{{ label }}
    </label>
</template>

<script>
export default {
  name: 'testCheckbox',
  props: {
    label: {
      type: String,
      default: '',
      note: "a label to be appended after the checkbox"
    },
    model: {
      required: true,
      note: "a model object the component should bind to"
    },
    disabled: {
      type: Boolean,
      default: false,
      note: "whether the element is disabled or not"
    }
  }
}
</script>

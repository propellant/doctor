<template>
  <div class="checkbox">
    <label>
      <input :disabled="disabled"type="checkbox">
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'checkboxTwo',
  props: {
    label: {
      type: String,
      default: '',
      note: "a label to be appended after the checkbox"
    },
    disabled: {
      type: Boolean,
      default: false,
      note: "whether or not the checkbox should be disabled"
    }
  }
}
</script>

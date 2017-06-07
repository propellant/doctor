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
  name: 'checkboxOne',
  introduction: 'an amazing checkbox',
  description: `
  This \`checkbox\` is amazing, you should _check_ it out.
  Except for the fact it's borderline useless in its current state.
  `,
  token: "<checkbox label='foo'></checkbox>",
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

<script>
export default {
  props: {
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
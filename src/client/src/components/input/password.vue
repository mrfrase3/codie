<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :type="visible ? 'text' : 'password'"
    :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
    outlined
    v-on="$listeners"
    @input="$emit('input', $event)"
    @click:append="visible = !visible"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>

<style>

</style>

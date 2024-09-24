<script>
const defaultStyle = { width: '400px'};

export default {
  name: "create-and-edit",
  props: { entity: null, visible: Boolean, entityName: '', edit: Boolean, size: 'default'},
  methods: {
    onCancel() {
      this.$emit('canceled');
    },
    onSave() {
      this.$emit('saved', this.entity);
    },
    getHeaderTitle() {
      return `${this.edit ? 'Edit' : 'New'} ${this.entityName}`;
    },
    getSubmitLabel() {
      return this.edit ? 'Update' : 'Create';
    },
    getDialogStyle() {
      let dialogStyle = defaultStyle;
      dialogStyle = this.size === 'standard' ? { width: '600px' } : defaultStyle;
      dialogStyle = this.size === 'large' ? { width: '900px' } : dialogStyle;
      return dialogStyle;
    }
  }
}
</script>

<template>

</template>

<style scoped>

</style>
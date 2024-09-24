<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";


export default {
  name: "material-create-and-edit-dialog",
  components: { CreateAndEdit},
  props: {
    item: null,
    visible: Boolean
  },
  data() {
    return {
      submitted: false
    }
  },
  watch: {
    'item.quantity': 'validateQuantity'
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested', this.item);
    },
    validateQuantity() {
      if (this.item.quantity > 30) {
        this.item.quantityStatus = "Stock";
      }

      if (this.item.quantity < 30 && this.item.quantity >= 15) {
        this.item.quantityStatus = "Medium Stock";
      }

      if (this.item.quantity < 15) {
        this.item.quantityStatus = "Low Stock";
      }

      if (this.item.quantity === 0) {
        this.item.quantityStatus = "Out of Stock";
      }
    }
  }
}
</script>

<template>
  <create-and-edit :entity="item" :visible="visible" entity-name="Material"
                   @cancelled="onCancelRequested" @saved="onSaveRequested">
    <template #content>
      <div class="p-fluid">
        <div class="field mt-5">
          <pv-float-label class="field-gap">
            <pv-cascade-select id="name" v-model="item.name" :class="{ 'p-invalid': submitted && !item.name}"/>
          </pv-float-label>
          <pv-float-label class="field-gap">
            <label for="quantity">Quantity</label>
            <pv-input-number id="quantity" v-model="item.quantity" :class="{ 'p-invalid': submitted && !item.quantity}"/>
          </pv-float-label>
          <pv-float-label class="field-gap">
            <label for="provider">Provider</label>
            <pv-input-text id="provider" v-model="item.provider" :class="{ 'p-invalid': submitted && !item.provider}"/>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
.field-gap {
  margin-bottom: 30px;
}
</style>
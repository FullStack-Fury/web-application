<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";




export default {
  name: "material-create-and-edit-dialog",
  components: { CreateAndEdit },
  props: {
    item: null,
    visible: Boolean
  },
  data() {
    return {
      date: null,
      selectedMaterialStone: null,
      materials: [
        {
          name: 'Gemstones',  // Grupo de piedras preciosas
          stones: [
            { name: 'Diamond' },
            { name: 'Emerald' },
            { name: 'Ruby' },
            { name: 'Sapphire' }
          ]
        },
        {
          name: 'Semiprecious Stones',  // Nuevo grupo de piedras semipreciosas
          stones: [
            { name: 'Agate' },                   // Ágata
            { name: 'Aquamarine and other Beryl varieties' },  // Aguamarina y otras variedades del berilo
            { name: 'Alexandrite' },             // Alejandrita
            { name: 'Amethyst' },                // Amatista
            { name: 'Amber' },                   // Ámbar
            { name: 'Chrysocolla' },             // Crisocola
            { name: 'Quartz and its varieties' },// Cuarzo y sus variedades
            { name: 'Lapis lazuli' },            // Lapislázuli
            { name: 'Malachite' },               // Malaquita
            { name: 'Obsidian' },                // Obsidiana
            { name: 'Tiger\'s eye' },            // Ojo de tigre

          ]
        }
      ],
      submitted: false
    };
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
      } else if (this.item.quantity >= 15) {
        this.item.quantityStatus = "Medium Stock";
      } else if (this.item.quantity < 15) {
        this.item.quantityStatus = "Low Stock";
      }

      if (this.item.quantity === 0) {
        this.item.quantityStatus = "Out of Stock";
      }
    }
  }
};
</script>

<template>
  <create-and-edit :entity="item" :visible="visible" entity-name="Material"
                   @canceled="onCancelRequested" @saved="onSaveRequested">
    <template #content>
      <div class="p-fluid">
        <div class="field mt-5">
          <div style="margin-bottom: 30px">
            <label for="material" class="flex flex-col gap-2" id="material-label">Material</label>
            <pv-cascade-select id="material" v-model="selectedMaterialStone"
                               :options="materials" optionLabel="name" optionGroupLabel="name"
                               :optionGroupChildren="['stones']" style="min-width: 14rem"
                               placeholder="Select a Material"
                               @change="item.name = selectedMaterialStone.name"
                               :class="{ 'p-invalid': submitted && !item.name }" />
          </div>
          <pv-float-label class="field-gap">
            <label for="quantity">Quantity</label>
            <pv-input-number id="quantity" v-model="item.quantity"
                             :class="{ 'p-invalid': submitted && !item.quantity }"/>
          </pv-float-label>
          <pv-float-label class="field-gap">
            <label for="provider">Provider</label>
            <pv-input-text id="provider" v-model="item.provider"
                           :class="{ 'p-invalid': submitted && !item.provider }"/>
          </pv-float-label>
          <pv-date-picker v-model="date" />
          <pv-textarea/>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
.field-gap {
  margin-bottom: 30px;
}

#material-label{
  margin:0 0 5px 10px;
  font-size: 12px;
  color: rgb(161, 161, 170);
}
</style>

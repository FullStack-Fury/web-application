<script>
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";
import { ItemHistoryService } from "../services/item-history.service.js";

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
          name: this.$t('inventory.gemstones-group'),  // Grupo de piedras preciosas
          stones: [
            { name:  this.$t('inventory.gemstones.diamond')}, // Diamante
            { name: this.$t('inventory.gemstones.emerald') }, // Esmeralda
            { name: this.$t('inventory.gemstones.ruby') }, // Rubí
            { name: this.$t('inventory.gemstones.sapphire') } // Zafiro
          ]
        },
        {
          name: this.$t('inventory.semiprecious-group'),  // Nuevo grupo de piedras semipreciosas
          stones: [
            { name: this.$t('inventory.semiprecious.agate') },                   // Ágata
            { name: this.$t('inventory.semiprecious.aquamarine')},  // Aguamarina y otras variedades del berilo
            { name: this.$t('inventory.semiprecious.alexandrite') }, // Alejandrita
            { name: this.$t('inventory.semiprecious.amethyst') }, // Amatista
            { name: this.$t('inventory.semiprecious.amber') }, // Ámbar
            { name: this.$t('inventory.semiprecious.chrysocolla') }, // Crisocola
            { name: this.$t('inventory.semiprecious.quartz') }, // Cuarzo y sus variedades
            { name: this.$t('inventory.semiprecious.lapis-lazuli') }, // Lapislázuli
            { name: this.$t('inventory.semiprecious.malachite') }, // Malaquita
            { name: this.$t('inventory.semiprecious.obsidian') }, // Obsidiana
            { name: this.$t('inventory.semiprecious.tiger-eye') } // Ojo de tigre
          ]
        }
      ],
      submitted: false,
      textareaContent: '',
      itemHistoryService: new ItemHistoryService()
    };
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested', this.item);
      // Create item history
      const itemHistory = {
        name: this.item.name,
        quantity: this.item.quantity,
        quantityStatus: this.item.quantityStatus,
        provider: this.item.provider,
        date: this.date,
        textareaContent: this.textareaContent
      };

      this.itemHistoryService.create(itemHistory)
          .then(response => {
            console.log('Item history saved:', response.data);
          })
          .catch(error => {
            console.error('Error saving item history:', error);
          });
    },

    validateQuantity() {
      if (this.item.quantity > 30) {
        this.item.quantityStatus = this.$t('inventory.stock-status.stock');
      } else if (this.item.quantity >= 15) {
        this.item.quantityStatus = this.$t('inventory.stock-status.medium-stock');
      } else if (this.item.quantity < 15) {
        this.item.quantityStatus = this.$t('inventory.stock-status.low-stock');
      }

      if (this.item.quantity === 0) {
        this.item.quantityStatus = this.$t('inventory.stock-status.out-of-stock');
      }
    }
  }
};
</script>

<template>
  <create-and-edit :entity="item" :visible="visible" entity-name="Material"
                   @canceled="onCancelRequested" @saved="onSaveRequested">
    <template #content>
      <div class="p-fluid grid formgrid">
        <!-- Selección de Material -->
        <div class="field col-12 md:col-6">
          <label for="material" id="material-label">{{ $t('inventory.label') }}</label>
          <pv-cascade-select id="material" v-model="selectedMaterialStone"
                             :options="materials" optionLabel="name" optionGroupLabel="name"
                             :optionGroupChildren="['stones']" class="w-full"
                             :placeholder="$t('inventory.select-material')"
                             @change="item.name = selectedMaterialStone.name"
                             :class="{ 'p-invalid': submitted && !item.name }" />
        </div>

        <!-- Cantidad -->
        <div class="field col-12 md:col-6">
          <label for="quantity">{{ $t('inventory.quantity') }}</label>
          <pv-input-number id="quantity" v-model="item.quantity" class="w-full"
                           :class="{ 'p-invalid': submitted && !item.quantity }"/>
        </div>

        <!-- Proveedor -->
        <div class="field col-12 md:col-6">
          <label for="provider">{{ $t('inventory.provider') }}</label>
          <pv-input-text id="provider" v-model="item.provider" class="w-full"
                         :class="{ 'p-invalid': submitted && !item.provider }"/>
        </div>

        <!-- Fecha -->
        <div class="field col-12 md:col-6">
          <label for="date">{{ $t('inventory.date') }}</label>
          <pv-date-picker v-model="date" class="w-full" />
        </div>

        <!-- Notas -->
        <div class="field col-12">
          <label for="notes">{{ $t('inventory.note') }}</label>
          <pv-textarea id="notes" v-model="textareaContent" class="w-full" />
        </div>
      </div>
    </template>
  </create-and-edit>
</template>
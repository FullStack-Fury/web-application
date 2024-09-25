<script>
import CreateAndEditDialog from "../../shared/components/create-and-edit.component.vue";

export default {
  name: "product-create-and-edit-dialog",
  components: {
    CreateAndEditDialog,
  },
  props: {
    visible: Boolean,
    product: Object,
    materials: Array,
  },
  data() {
    return {
      productData: {},
      selectedMaterials: [],
      originalMaterials: [],
    };
  },
  computed: {
    dialogTitle() {
      return this.productData.id ? 'Edit Product' : 'New Product';
    },
  },
  watch: {
    product: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // Clonar el producto para evitar mutaciones
          this.productData = JSON.parse(JSON.stringify(newVal));
          // Preparar los materiales seleccionados
          this.selectedMaterials = this.productData.materials.map(pm => {
            const material = this.materials.find(m => m.id === pm.materialId);
            return {
              ...material,
              quantityToUse: pm.quantity,
            };
          });
          // Guardar los materiales originales para cálculos posteriores
          this.originalMaterials = JSON.parse(JSON.stringify(this.productData.materials));
        } else {
          this.productData = {};
          this.selectedMaterials = [];
          this.originalMaterials = [];
        }
      },
    },
  },
  methods: {
    onMaterialsChange() {
      // Si se agregan nuevos materiales, inicializar quantityToUse
      this.selectedMaterials.forEach(material => {
        if (typeof material.quantityToUse === 'undefined') {
          material.quantityToUse = 1;
        }
      });
    },
    getOriginalQuantityUsed(material) {
      if (this.originalMaterials) {
        const originalMaterial = this.originalMaterials.find(pm => pm.materialId === material.id);
        return originalMaterial ? originalMaterial.quantity : 0;
      }
      return 0;
    },
    onSaveRequested() {
      if (!this.productData.name || this.selectedMaterials.length === 0) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter a name and select materials',
          life: 3000
        });
        return;
      }

      let allValid = true;
      this.selectedMaterials.forEach(material => {
        const originalQuantityUsed = this.getOriginalQuantityUsed(material);
        if (!material.quantityToUse || material.quantityToUse <= 0 || material.quantityToUse > (material.quantity + originalQuantityUsed)) {
          allValid = false;
        }
      });

      if (!allValid) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please verify the quantities entered',
          life: 3000
        });
        return;
      }

      // Preparar los datos del producto
      const productData = {
        id: this.productData.id,
        name: this.productData.name,
        materials: this.selectedMaterials.map(material => ({
          materialId: material.id,
          quantity: material.quantityToUse,
        })),
      };

      this.$emit('saved', productData, this.originalMaterials);
    },
    onCancelRequested() {
      this.$emit('canceled');
    },
  },
};
</script>

<template>
  <create-and-edit-dialog
      :visible="visible"
      :entityName="dialogTitle"
      @canceled="onCancelRequested"
      @saved="onSaveRequested"
  >
    <template #content>
      <div class="p-fluid">
        <div class="field">
          <label for="productName">Product Name</label>
          <pv-input-text
              id="productName"
              v-model="productData.name"
              placeholder="Enter the product name"
          />
        </div>
        <div class="field">
          <label for="materials">Materials</label>
          <pv-multi-select
              id="materials"
              v-model="selectedMaterials"
              :options="materials"
              option-label="name"
              placeholder="Select materials"
              @change="onMaterialsChange"
          />
        </div>
        <div class="field" v-for="(material, index) in selectedMaterials" :key="material.id">
          <label :for="'quantity-' + material.id">Quantity for {{ material.name }}</label>
          <pv-input-number
              :id="'quantity-' + material.id"
              v-model="material.quantityToUse"
              :min="1"
              :max="material.quantity + getOriginalQuantityUsed(material)"
              show-buttons
              :step="1"
              placeholder="Quantity"
              style="width: 100%"
          />
          <small>Available Quantity: {{ material.quantity + getOriginalQuantityUsed(material) }}</small>
        </div>
      </div>
    </template>
  </create-and-edit-dialog>
</template>

<style scoped>
/* Estilos opcionales */
</style>

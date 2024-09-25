<script>
import CreateAndEditDialog from "../../shared/components/create-and-edit.component.vue";
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import InputNumber from 'primevue/inputnumber';
import CascadeSelect from 'primevue/cascadeselect';

export default {
  name: "product-create-and-edit-dialog",
  components: {
    CreateAndEditDialog,
    'pv-input-text': InputText,
    'pv-multi-select': MultiSelect,
    'pv-input-number': InputNumber,
    'pv-cascade-select': CascadeSelect,
  },
  props: {
    visible: Boolean,
    product: Object,
    materials: Array,
    employees: Array,
  },
  data() {
    return {
      productData: {},
      selectedMaterials: [],
      originalMaterials: [],
      selectedEmployee: null,
    };
  },
  computed: {
    dialogTitle() {
      return this.productData.id ? 'Edit Product' : 'New Product';
    },
    employeeOptions() {
      const departments = {};
      this.employees.forEach(emp => {
        if (!departments[emp.department]) {
          departments[emp.department] = {
            label: emp.department,
            employees: [],
          };
        }
        departments[emp.department].employees.push(emp);
      });
      return Object.values(departments);
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
          // Asignar empleado seleccionado
          this.selectedEmployee = this.employees.find(e => e.id === this.productData.employeeId) || null;
        } else {
          this.productData = {};
          this.selectedMaterials = [];
          this.originalMaterials = [];
          this.selectedEmployee = null;
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
    onEmployeeChange() {
      if (this.selectedEmployee) {
        this.productData.employeeId = this.selectedEmployee.id;
      } else {
        this.productData.employeeId = null;
      }
    },
    onSaveRequested() {
      if (!this.productData.name || this.selectedMaterials.length === 0 || !this.selectedEmployee) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter a name, select materials, and assign an employee',
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
        employeeId: this.selectedEmployee.id,
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
        <div class="field">
          <label for="employee">Employee</label>
          <pv-cascade-select
              id="employee"
              v-model="selectedEmployee"
              :options="employeeOptions"
              optionLabel="name"
              optionGroupLabel="department"
              :optionGroupChildren="['employees']"
              placeholder="Select an employee"
              @change="onEmployeeChange"
          />
        </div>
      </div>
    </template>
  </create-and-edit-dialog>
</template>

<style scoped>
/* Estilos opcionales */
</style>

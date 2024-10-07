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
    employees: Array,
  },
  data() {
    return {
      productData: {},
      selectedMaterials: [],
      originalMaterials: [],
      selectedEmployee: null,
      selectedStatus: null,
      statusOptions: [
        { label: "Pendiente", value: "pendient" },
        { label: "En Progreso", value: "inprogress" },
        { label: "Finalizado", value: "finish" },
      ],
    };
  },
  computed: {
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
          this.productData = JSON.parse(JSON.stringify(newVal));
          this.selectedMaterials = this.productData.materials.map(pm => {
            const material = this.materials.find(m => m.id === pm.materialId);
            return {
              ...material,
              quantityToUse: pm.quantity,
            };
          });
          this.originalMaterials = JSON.parse(JSON.stringify(this.productData.materials));
          this.selectedEmployee = this.employees.find(e => e.id === this.productData.employeeId) || null;
          this.selectedStatus = this.productData.status || null;
        } else {
          this.productData = {};
          this.selectedMaterials = [];
          this.originalMaterials = [];
          this.selectedEmployee = null;
          this.selectedStatus = null;
        }
      },
    },
  },
  methods: {
    onMaterialsChange() {
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
      if (!this.productData.name || this.selectedMaterials.length === 0 || !this.selectedEmployee || !this.selectedStatus) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter a name, select materials, assign an employee, and select a status',
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

      const productData = {
        id: this.productData.id,
        name: this.productData.name,
        employeeId: this.selectedEmployee ? this.selectedEmployee.id : null,
        status: this.selectedStatus,
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
      :entityName="$t('management.product')"
      @canceled="onCancelRequested"
      @saved="onSaveRequested"
  >
    <template #content>
      <div class="p-fluid">
        <div class="field">
          <label for="productName" style="margin-right: 10px">{{ $t('management.product-name')}}</label>
          <pv-input-text
              id="productName"
              v-model="productData.name"
              :placeholder="$t('management.enter-product-name' )"
          />
        </div>
        <div class="field" >
          <label for="materials">{{ $t('management.materials') }} </label>
          <pv-multi-select
              id="materials"
              v-model="selectedMaterials"
              :options="materials"
              option-label="name"
              :placeholder=" $t('management.select-materials') "
              @change="onMaterialsChange"
          />
        </div>
        <div class="field" v-for="(material) in selectedMaterials" :key="material.id">
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
          <label for="employee">{{ $t('management.employees') }}</label>
          <pv-cascade-select
              id="employee"
              v-model="selectedEmployee"
              :options="employeeOptions"
              optionLabel="name"
              optionGroupLabel="department"
              :optionGroupChildren="['employees']"
              :placeholder="$t('management.select-employees')"
              @change="onEmployeeChange"
          />
        </div>
        <div class="field">
          <label for="status">{{ $t('management.status') }}</label>
          <pv-dropdown
              id="status"
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('management.select-status')"
          />
        </div>
      </div>
    </template>
  </create-and-edit-dialog>
</template>

<style scoped>

</style>

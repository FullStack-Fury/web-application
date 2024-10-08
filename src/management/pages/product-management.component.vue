<script>
import { Product } from "../model/product.entity.js";
import { Material } from "../../inventory/model/material.entity.js";
import { ProductService } from "../services/product.service.js";
import { MaterialService } from "../../inventory/services/material.service.js";
import { Employee } from "../model/employee.entity.js";
import { EmployeeService } from "../services/employee.service.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import ProductCreateAndEditDialog from "../components/product-create-and-edit.component.vue";

export default {
  name: "product-management",
  components: {
    DataManager,
    ProductCreateAndEditDialog,
  },
  data() {
    return {
      title: { singular: 'Product', plural: 'Products' },
      materials: [],
      products: [],
      employees: [],
      materialService: null,
      productService: null,
      employeeService: null,
      selectedProducts: [],
      product: new Product(),
      addProductDialogIsVisible: false,
      filters: null,
    };
  },
  methods: {
    //#region Métodos Utilitarios
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },
    findMaterialIndexById(id) {
      return this.materials.findIndex(material => material.id === id);
    },
    findProductIndexById(id) {
      return this.products.findIndex(product => product.id === id);
    },
    initFilters() {
      this.filters = { global: { value: null, matchMode: 'contains' } };
    },
    //#endregion

    //#region Manejadores de Eventos para Productos
    onNewItem() {
      this.product = new Product();
      this.addProductDialogIsVisible = true;
    },
    onEditItem(item) {
      this.product = JSON.parse(JSON.stringify(item));
      this.addProductDialogIsVisible = true;
    },
    onDeleteItem(item) {
      this.productService.delete(item.id)
          .then(() => {
            item.materials.forEach(pm => {
              const materialIndex = this.findMaterialIndexById(pm.materialId);
              this.materials[materialIndex].quantity += pm.quantity;
              this.materialService.update(pm.materialId, this.materials[materialIndex]);
            });
            const index = this.findProductIndexById(item.id);
            this.products.splice(index, 1);
            this.notifySuccessfulAction(`Eliminated Product: ${item.name}`);
          })
          .catch(error => console.error(error));
    },
    onSaveRequested(productData, originalMaterials) {
      if (!productData.employeeId) {
        productData.employeeId = this.product.employeeId;
      }

      const materialUpdates = productData.materials.map(material => {
        const materialIndex = this.findMaterialIndexById(material.materialId);
        const originalQuantityUsed = this.getOriginalQuantityUsed(material, originalMaterials);
        const quantityDifference = material.quantity - originalQuantityUsed;
        this.materials[materialIndex].quantity -= quantityDifference;
        return this.materialService.update(material.materialId, this.materials[materialIndex]);
      });

      Promise.all(materialUpdates)
          .then(() => {
            if (productData.id) {
              this.productService.update(productData.id, productData)
                  .then(response => {
                    const index = this.findProductIndexById(productData.id);
                    const updatedProduct = response.data;
                    updatedProduct.materials = productData.materials.map(pm => {
                      const material = this.materials.find(m => m.id === pm.materialId);
                      return {
                        ...pm,
                        material: material,
                      };
                    });
                    updatedProduct.employee = this.employees.find(e => e.id === updatedProduct.employeeId);
                    this.products.splice(index, 1, updatedProduct);
                    this.notifySuccessfulAction(`Updated Product: ${updatedProduct.name}`);
                    this.addProductDialogIsVisible = false;
                  })
                  .catch(error => console.error(error));
            } else {
              this.productService.create(productData)
                  .then(response => {
                    const product = response.data;
                    product.materials = productData.materials.map(pm => {
                      const material = this.materials.find(m => m.id === pm.materialId);
                      return {
                        ...pm,
                        material: material,
                      };
                    });
                    product.employee = this.employees.find(e => e.id === product.employeeId);
                    this.products.push(product);
                    this.notifySuccessfulAction(`Added Product: ${product.name}`);
                    this.addProductDialogIsVisible = false;
                  })
                  .catch(error => console.error(error));
            }
          })
          .catch(error => console.error(error));
    },
    onCancelRequested() {
      this.addProductDialogIsVisible = false;
    },
    //#endregion

    //#region Métodos para cargar datos
    loadMaterials() {
      this.materialService.getAll()
          .then(response => {
            this.materials = response.data.map(material => new Material(material));
            this.loadProducts();
          })
          .catch(error => console.error(error));
    },
    loadProducts() {
      this.productService.getAll()
          .then(response => {
            this.products = response.data.map(product => {
              product.materials = product.materials.map(pm => {
                const material = this.materials.find(m => m.id === pm.materialId);
                return {
                  ...pm,
                  material: material,
                };
              });
              const employee = this.employees.find(e => e.id === product.employeeId);
              product.employee = employee ? employee : { name: 'Empleado no asignado' };
              return product;
            });
          })
          .catch(error => console.error(error));
    },
    loadEmployees() {
      this.employeeService.getAll()
          .then(response => {
            this.employees = response.data.map(employee => new Employee(employee));
          })
          .catch(error => console.error(error));
    },
    //#endregion

    getOriginalQuantityUsed(material, originalMaterials) {
      if (originalMaterials) {
        const originalMaterial = originalMaterials.find(pm => pm.materialId === material.materialId);
        return originalMaterial ? originalMaterial.quantity : 0;
      }
      return 0;
    },
  },
  created() {
    this.materialService = new MaterialService();
    this.productService = new ProductService();
    this.employeeService = new EmployeeService();
    this.loadMaterials();
    this.loadEmployees();
    this.initFilters();
  },
};
</script>

<template>
  <div class="w-full">
    <!-- Tabla de Productos -->
    <data-manager
        :title="title"
        :items="products"
        :dynamic="false"
        @new-item-requested="onNewItem"
        @edit-item-requested="onEditItem"
        @delete-item-requested="onDeleteItem"
    >
      <template #custom-columns>
        <pv-column :sortable="true" field="id" :header="$t('management.id')" style="min-width: 6rem" />
        <pv-column :sortable="true" field="name" :header="$t('management.name')" style="min-width: 12rem" />
        <pv-column :header="$t('management.materials')" style="min-width: 20rem">
          <template #body="slotProps">
            <ul>
              <li v-for="pm in slotProps.data.materials" :key="pm.materialId">
                {{ pm.material.name }}: {{ pm.quantity }}
              </li>
            </ul>
          </template>
        </pv-column>
        <pv-column :sortable="true" field="employee.name" :header="$t('management.employees')" style="min-width: 12rem" />
        <pv-column :sortable="true" field="status" :header="$t('management.status')" style="min-width: 12rem" />
      </template>
    </data-manager>

    <!-- Diálogo para agregar/editar producto -->
    <product-create-and-edit-dialog
        :visible="addProductDialogIsVisible"
        :product="product"
        :materials="materials"
        :employees="employees"
        @canceled="onCancelRequested"
        @saved="onSaveRequested"

    />
  </div>
</template>

<style scoped>
</style>
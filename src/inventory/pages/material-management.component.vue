<script>
import {Material} from "../model/material.entity.js";
import {MaterialService} from "../services/material.service.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import MaterialCreateAndEditDialog from "../components/material-create-and-edit.component.vue";

export default {
  name: "material-management",
  components: {MaterialCreateAndEditDialog, DataManager},
  data() {
    return {
      title: { singular: 'Material', plural: 'Materials' },
      materials: [],
      material: new Material({}),
      selectedMaterials: [],
      materialService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
    }
  },
  methods: {

    //#region Utility Methods
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },
    findIndexById(id) {
      return this.materials.findIndex(material => material.id === id);
    },
    //#endregion

    //#region Event Handlers
    onNewItem() {
      this.material = new Material({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItem(item) {
      this.material = new Material(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onDeleteItem(item) {
      this.material = new Material(item);
      this.deleteMaterial();
    },
    onDeleteSelectedItems(selectedItems) {
      this.selectedMaterials = selectedItems;
      this.deleteSelectedMaterials();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    onSaveRequested(item) {
      this.submitted = true;
      if (this.material.name.trim()) {
        if (item.id) {
          this.updateMaterial();
        } else {
          this.createMaterial();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    //#endregion

    //#region Action Methods
    createMaterial() {
      this.materialService.create(this.material).then(response => {
        let material = new Material(response.data);
        this.materials.push(material);
        this.notifySuccessfulAction('Item Created');
      }).catch(error => console.error(error));
    },
    updateMaterial() {
      this.materialService.update(this.material.id, this.material).then(response => {
        let index = this.findIndexById(this.material.id);
        this.materials[index] = new Material(response.data);
        this.notifySuccessfulAction('Item Updated');
      }).catch(error => console.error(error));
    },
    deleteMaterial() {
      this.materialService.delete(this.material.id).then(() => {
        let index = this.findIndexById(this.material.id);
        this.materials.splice(index, 1);
        this.notifySuccessfulAction('item Deleted');
      }).catch(error => console.error(error));
    },
    deleteSelectedMaterials() {
      this.selectedMaterials.forEach((material) => {
        this.materialService.delete(material.id).then(() => {
          this.materials = this.materials.filter((t) => t.id !== material.id);
        });
      });
      this.notifySuccessfulAction('Items Deleted');
    },
    //#endregion
  },
  //#region Lifecycle Hooks

  watch: {
    createAndEditDialogIsVisible(newVal) {
      console.log('Dialog visibility changed:', newVal);
    }
  },

  created() {
    this.materialService = new MaterialService();
    this.materialService.getAll().then(response => {
      this.materials = response.data.map(material => new Material(material));
      console.log(this.materials);
    }).catch(error => console.error(error));
  }

  //#endregion
}
</script>

<template>
  <div class="w-full">
    <data-manager :title="title"
                  v-bind:items="materials"
                  v-on:new-item-requested="onNewItem"
                  v-on:edit-item-requested="onEditItem($event)"
                  v-on:delete-item-requested="onDeleteItem($event)"
                  v-on:delete-selected-items-requested="onDeleteSelectedItems($event)">
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="Id" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="name" header="Name" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="quantity" header="Quantity" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="quantityStatus" header="Quantity Status" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="provider" header="Provider" style="min-width: 12rem"/>
      </template>
    </data-manager>
    <material-create-and-edit-dialog
        :edit="isEdit"
        :item="material"
        :visible="createAndEditDialogIsVisible"
        v-on:cancel-requested="onCancelRequested"
        v-on:save-requested="onSaveRequested($event)"/>
  </div>
</template>

<style scoped>

</style>
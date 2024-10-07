<script>
import {FilterMatchMode} from "@primevue/core";

export default {
  name: "data-manager",
  inheritAttrs: false,
  props: {
    items: { type: Array, required: true },
    title: { type: { singular: '', plural: ''}, required: true },
    dynamic: { type: Boolean, default: false },
    columns: { type: Array, default: () => []},
    showNewAndDeleteButtons: { type: Boolean, default: true }
  },
  data() {
    return {
      selectedItems: [],
      filters: null
    }
  },
  methods: {
    initFilters() {
      this.filters = { global: { value: null, matchMode: FilterMatchMode.CONTAINS } };
    },
    newItem() {
      this.$emit('new-item-requested');
    },
    confirmDeleteSelected() {
      this.$confirm.require({
        message: this.$t('data-manager.confirmation.message.plural'),
        header:  this.$t('data-manager.confirmation.header'),
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button=outlined',
        rejectLabel: this.$t('data-manager.confirmation.cancel'),
        acceptLabel:  this.$t('data-manager.delete'),
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-selected-items-requested', this.selectedItems),
        reject: () => {
        }
      });
    },
    exportToCsv() {
      this.$refs.dt.exportCSV();
    },
    editItem(item) {
      this.$emit('edit-item-requested', item);
    },
    confirmDeleteItem(item) {
      this.$confirm.require({
        message: this.$t('data-manager.confirmation.message.singular'),
        header:  this.$t('data-manager.confirmation.header'),
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button=outlined',
        rejectLabel: this.$t('data-manager.confirmation.cancel'),
        acceptLabel:  this.$t('data-manager.delete'),
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-item-requested', item),
        reject: () => {
        }
      })
    }
  },
  created() {
    this.initFilters();
  }
}
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <h2 style="text-align: center">{{ $t('management.product') }}</h2>

  <!-- Toolbar section -->
  <pv-toolbar class="mb-5">
    <template #start>
      <pv-button v-if="showNewAndDeleteButtons" class="mr-2" icon="pi pi-plus" :label="$t('data-manager.new')" severity="success" @click="newItem"/>
      <pv-button v-if="showNewAndDeleteButtons" :disabled="!selectedItems || !selectedItems.length" icon="pi pi-trash" :label="$t('data-manager.delete')" severity="danger"
                 @click="confirmDeleteSelected"/>
    </template>
    <template #end>
      <pv-button icon="pi pi-download" :label="$t('data-manager.export')" severity="help" @click="exportToCsv($event)"/>
    </template>
  </pv-toolbar>

  <pv-data-table
      ref="dt"
      v-model:selection="selectedItems"
      :filters="filters"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 15]"
      :value="items"
      current-page-report-template="Showing {first} to {last} of {totalRecords} ${{title.plural}}"
      data-key="id"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">
    <pv-column :exportable="false" selection-mode="multiple" style="width: 3em"/>
    <slot name="custom-columns"></slot>
    <pv-column v-if="dynamic" v-for="column in columns"
               :key="column.field"
               :field="column.field" :header="column.header"/>
    <pv-column :exportable="false" style="min-width:8rem">
      <template #body="slotProps">
        <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editItem(slotProps.data)"/>
        <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteItem(slotProps.data)"/>
      </template>
    </pv-column>
  </pv-data-table>
</template>

<style scoped>

</style>
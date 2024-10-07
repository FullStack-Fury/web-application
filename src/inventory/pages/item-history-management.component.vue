<script>
import { ItemHistory } from "../model/item-history.entity.js";
import { ItemHistoryService } from "../services/item-history.service.js";
import DataManager from "../../shared/components/data-manager.component.vue";
import MaterialCreateAndEditDialog from "../components/material-create-and-edit.component.vue";

export default {
  name: "item-history-management",
  components: {
    DataManager,
    MaterialCreateAndEditDialog
  },
  props: {
    itemId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      title: { singular: "Material History", plural: "Material Histories" },
      histories: [],
      history: new ItemHistory(),
      selectedHistories: [],
      historyService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      showNewAndDeleteButtons: false,
    };
  },
  methods: {
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },
    closeHistory() {
      this.$emit('close');
    },
    findIndexById(id) {
      return this.histories.findIndex(history => history.id === id);
    },
    onNewItem() {
      this.history = new ItemHistory({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItem(item) {
      this.history = new ItemHistory(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },
    onDeleteItem(item) {
      this.history = new ItemHistory(item);
      this.deleteHistory();
    },
    onDeleteSelectedItems(selectedItems) {
      this.selectedHistories = selectedItems;
      this.deleteSelectedHistories();
    },
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    onSaveRequested(item) {
      this.submitted = true;
      if (this.history.name.trim()) {
        if (item.id) {
          this.updateHistory();
        } else {
          this.createHistory();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },
    createHistory() {
      this.historyService.create(this.history).then(response => {
        let history = new ItemHistory(response.data);
        this.histories.push(history);
        this.notifySuccessfulAction('History Created');
      }).catch(error => console.error(error));
    },
    updateHistory() {
      this.historyService.update(this.history.id, this.history).then(response => {
        let index = this.findIndexById(this.history.id);
        this.histories[index] = new ItemHistory(response.data);
        this.notifySuccessfulAction('History Updated');
      }).catch(error => console.error(error));
    },
    deleteHistory() {
      this.historyService.delete(this.history.id).then(() => {
        let index = this.findIndexById(this.history.id);
        this.histories.splice(index, 1);
        this.notifySuccessfulAction('History Deleted');
      }).catch(error => console.error(error));
    },
    deleteSelectedHistories() {
      this.selectedHistories.forEach((history) => {
        this.historyService.delete(history.id).then(() => {
          this.histories = this.histories.filter((t) => t.id !== history.id);
        });
      });
      this.notifySuccessfulAction('Histories Deleted');
    },
    addMaterialToHistory(material) {
      const newItem = new ItemHistory(material);
      this.histories.push(newItem);
    }
  },
  watch: {
    createAndEditDialogIsVisible(newVal) {
      console.log('Dialog visibility changed:', newVal);
    }
  },
  created() {
    this.historyService = new ItemHistoryService();
    this.historyService.getAll().then(response => {
      this.histories = response.data.map(history => new ItemHistory(history));
      console.log(this.histories);
    }).catch(error => console.error(error));
  },
  beforeDestroy() {
    this.$root.$off('material-added', this.addMaterialToHistory);
  }
};
</script>

<template>
  <div class="w-full">
    <button @click="closeHistory">Close History</button>
    <data-manager :title="title"
                  :items="histories"
                  :show-new-and-delete-buttons="showNewAndDeleteButtons"
                  @new-item-requested="onNewItem"
                  @edit-item-requested="onEditItem($event)"
                  @delete-item-requested="onDeleteItem($event)"
                  @delete-selected-items-requested="onDeleteSelectedItems($event)">
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="Id" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="name" header="Name" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="quantity" header="Quantity" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="provider" header="Provider" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="date" header="Date" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="textareaContent" header="Textarea Content" style="min-width: 12rem"/>
      </template>
    </data-manager>
    <material-create-and-edit-dialog
        :edit="isEdit"
        :item="history"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"/>
  </div>
</template>

<style scoped>
</style>
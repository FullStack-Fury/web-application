<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "headerContent",
  data(){
    return {
      items: [
        {
          label: "Inicio",
          icon: "pi pi-home"
        },
        {
          label: "Productos",
          icon: "pi pi-tags"
        },
        {
          label: "Proceso",
          icon: "pi pi-cog"
        },
        {
          label: "Más opciones",
          icon: "pi pi-ellipsis-v"
        }
      ]
    }
  }
})
</script>

<template>
  <div class="card">
    <pv-menubar :model="items" class="menuBar"/>
  </div>
</template>

<style scoped>

.card {
  width: 100%;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.menuBar {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
}

.p-menubar{
  border-radius: 0;
}
</style>
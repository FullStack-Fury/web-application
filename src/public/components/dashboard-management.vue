<script setup>
import { ref, computed, onMounted } from 'vue';

// Estados reactivos para productos, materiales y empleados
const products = ref([]);
const materials = ref([]);
const employees = ref([]);
const detailsVisible = ref(false);
const selectedStatus = ref('');

// Computar la cantidad de productos por estado
const inProgressCount = computed(() => products.value.filter(p => p.status.toLowerCase() === 'inprogress').length);
const finishCount = computed(() => products.value.filter(p => p.status.toLowerCase() === 'finish').length);
const pendingCount = computed(() => products.value.filter(p => p.status.toLowerCase() === 'pendient').length);

// Filtrar productos según el estado seleccionado
const filteredProducts = computed(() => {
  return products.value.filter(p => p.status.toLowerCase() === selectedStatus.value);
});

// Función para abrir la tabla de detalles
const openDetails = (status) => {
  selectedStatus.value = status;
  detailsVisible.value = true;
};

// Función para obtener el nombre del material según el ID
const getMaterialName = (id) => {
  const material = materials.value.find(m => m.id === id);
  return material ? material.name : 'Unknown Material';
};

// Función para obtener el nombre del empleado según el ID
const getEmployeeName = (id) => {
  const employee = employees.value.find(e => e.id === id);
  return employee ? employee.name : 'No employee assigned';
};

// Función para cargar los productos desde la API pública
const fetchProducts = async () => {
  try {
    const response = await fetch('https://my-json-server.typicode.com/FullStack-Fury/Json-placeholder/products');
    if (response.ok) {
      let data = await response.json();
      // Mapeo de los estados de los productos si es necesario
      products.value = data.map(product => {
        if (product.status === 'pending') {
          product.status = 'pendient';
        } else if (product.status === 'in-progress') {
          product.status = 'inprogress';
        } else if (product.status === 'done') {
          product.status = 'finish';
        }
        return product;
      });
    } else {
      console.error('Error fetching products');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para cargar los materiales desde la API pública
const fetchMaterials = async () => {
  try {
    const response = await fetch('https://my-json-server.typicode.com/FullStack-Fury/Json-placeholder/materials');
    if (response.ok) {
      materials.value = await response.json();
    } else {
      console.error('Error fetching materials');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para cargar los empleados desde la API pública
const fetchEmployees = async () => {
  try {
    const response = await fetch('https://my-json-server.typicode.com/FullStack-Fury/Json-placeholder/employees');
    if (response.ok) {
      employees.value = await response.json();
    } else {
      console.error('Error fetching employees');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Cargar productos, materiales y empleados cuando el componente se monta
onMounted(() => {
  fetchProducts();
  fetchMaterials();
  fetchEmployees();
});
</script>

<template>

    <div class="cards-container">
      <pv-card style="width: 25rem; overflow: hidden" class="card inprogress">
        <template #title>In Progress</template>
        <template #content>
          <p class="m-0"> {{ inProgressCount }} products </p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <pv-button label="View Details" text raised class="w-full" @click="openDetails('inprogress')"/>
          </div>
        </template>
      </pv-card>

      <pv-card style="width: 25rem; overflow: hidden" class="card finish">
        <template #title>Finish</template>
        <template #content>
          <p class="m-0"> {{ finishCount }} products </p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <pv-button label="View Details" text raised  class="w-full" @click="openDetails('finish')"/>
          </div>
        </template>
      </pv-card>

      <pv-card style="width: 25rem; overflow: hidden" class="card pending">
        <template #title>Pending</template>
        <template #content>
          <p class="m-0"> {{ pendingCount }} products </p>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <pv-button label="View Details" text raised class="w-full" @click="openDetails('pendient')"/>
          </div>
        </template>
      </pv-card>
    </div>

  <div class="dashboard-container">
  <!-- Tabla de detalles de productos -->
    <div v-if="detailsVisible" class="details-table">
      <h3>Products with Status: {{ selectedStatus }}</h3>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Materials</th>
          <th>Employee</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>
            <ul>
              <li v-for="material in product.materials" :key="material.materialId">
                Material: {{ getMaterialName(material.materialId) }} - Quantity: {{ material.quantity }}
              </li>
            </ul>
          </td>
          <td>{{ getEmployeeName(product.employeeId) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.card {
  margin: 10px;
}

.card button {
  background-color: #fff;
}

.card button:hover {
  background-color: #f0f0f0;
}

.inprogress {
  background-color: #f0ad4e;
}

.finish {
  background-color: #5cb85c;
}

.pending {
  background-color: #d9534f;
}

.details-table {
  width: 100%;
}

table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

table th,
table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #f4f4f4;
}
</style>

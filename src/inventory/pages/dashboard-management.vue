<template>
  <div class="dashboard-container">
    <div class="cards-container">
      <div class="card inprogress">
        <h2>In Progress</h2>
        <p>{{ inProgressCount }} products</p>
        <button @click="openDetails('inprogress')">View Details</button>
      </div>
      <div class="card finish">
        <h2>Finish</h2>
        <p>{{ finishCount }} products</p>
        <button @click="openDetails('finish')">View Details</button>
      </div>
      <div class="card pending">
        <h2>Pending</h2>
        <p>{{ pendingCount }} products</p>
        <button @click="openDetails('pendient')">View Details</button>
      </div>
    </div>

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

// Función para cargar los productos desde la db.json
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/products'); // Asegúrate de que la URL sea correcta
    if (response.ok) {
      products.value = await response.json();
    } else {
      console.error('Error fetching products');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para cargar los materiales desde la db.json
const fetchMaterials = async () => {
  try {
    const response = await fetch('http://localhost:3000/materials'); // Asegúrate de que la URL sea correcta
    if (response.ok) {
      materials.value = await response.json();
    } else {
      console.error('Error fetching materials');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para cargar los empleados desde la db.json
const fetchEmployees = async () => {
  try {
    const response = await fetch('http://localhost:3000/employees'); // Asegúrate de que la URL sea correcta
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

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.cards-container {
  display: flex;
  justify-content: center; /* Centra las tarjetas en el contenedor */
  margin-bottom: 20px; /* Espacio entre las tarjetas y la tabla */
}

.card {
  width: 200px;
  height: 200px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px; /* Espacio entre las tarjetas */
  font-size: 1.2rem;
  color: white;
}

.card h2 {
  margin-bottom: 10px;
}

.card p {
  margin-bottom: 20px;
}

.card button {
  padding: 10px 20px;
  background-color: #fff;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.card button:hover {
  background-color: #f0f0f0;
}

.inprogress {
  background-color: #f0ad4e; /* Color amarillo para 'In Progress' */
}

.finish {
  background-color: #5cb85c; /* Color verde para 'Finish' */
}

.pending {
  background-color: #d9534f; /* Color rojo para 'Pending' */
}

.details-table {
  width: 100%; /* Ajusta el ancho de la tabla */
}

table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%; /* Ajustar el ancho de la tabla */
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

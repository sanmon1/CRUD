       async function cargarTareas() {

            const respuesta = await fetch('/tareas');
            const tareas = await respuesta.json();

            const lista = document.getElementById('listaTareas');

            lista.innerHTML = '';

            tareas.forEach(tarea => {

                lista.innerHTML += `
                    <div style="border:1px solid black; padding:10px; margin:10px;">
                        <h3>${tarea.titulo}</h3>
                        <p>${tarea.descripcion}</p>

                        <button onclick="editarTarea('${tarea._id}')">
                            Editar
                        </button>

                        <button onclick="eliminarTarea('${tarea._id}')">
                            Eliminar
                        </button>
                    </div>
                `;
            });
        }

        async function crearTarea() {

            const titulo = document.getElementById('titulo').value;
            const descripcion = document.getElementById('descripcion').value;

            await fetch('/tareas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo,
                    descripcion
                })
            });

            document.getElementById('titulo').value = '';
            document.getElementById('descripcion').value = '';

            cargarTareas();
        }

        async function eliminarTarea(id) {

            await fetch(`/tareas/${id}`, {
                method: 'DELETE'
            });

            cargarTareas();
        }

        async function editarTarea(id) {

            const nuevoTitulo = prompt('Nuevo título');

            const nuevaDescripcion = prompt('Nueva descripción');

            if (!nuevoTitulo || !nuevaDescripcion) return;

            await fetch(`/tareas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: nuevoTitulo,
                    descripcion: nuevaDescripcion
                })
            });

            cargarTareas();
        }

        cargarTareas();
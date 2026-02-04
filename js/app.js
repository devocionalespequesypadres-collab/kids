
document.addEventListener('DOMContentLoaded', async () => {
    const daysGrid = document.querySelector('.days-grid');

    if (!daysGrid) return; // Solo ejecutar si estamos en la página principal con la grilla

    // Mostrar estado de carga (opcional)
    daysGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Cargando devocionales...</p>';

    const devotionals = await getDevotionals();

    if (!devotionals || devotionals.length === 0) {
        daysGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron devocionales.</p>';
        return;
    }

    // Limpiar grilla
    daysGrid.innerHTML = '';

    // Agrupar por semanas para mantener la estructura visual si se desea, 
    // pero la estructura actual del HTML tiene secciones por semana.
    // Vamos a inyectar en las secciones correspondientes o recrear la estructura.

    // NOTA: El HTML original tiene secciones estáticas para Semana 1, Semana 2, etc.
    // Para simplificar, vamos a llenar los contenedores existentes si tienen IDs o clases específicas,
    // o vamos a reconstruir todo el contenido principal.

    // Estrategia: Buscar los contenedores de semana y llenarlos, o modificar el HTML para tener un solo contenedor dinámico.
    // Dado que el diseño divide por semanas, lo respetaremos.

    const weeks = {
        1: document.querySelector('section.week-section:nth-of-type(2) .days-grid'), // Semana 1 (nth-of-type 2 porque la intro es section 1)
        2: document.querySelector('section.week-section:nth-of-type(3) .days-grid'),
        3: document.querySelector('section.week-section:nth-of-type(4) .days-grid'),
        4: document.querySelector('section.week-section:nth-of-type(5) .days-grid')
    };

    // Limpiar los contenedores actuales antes de llenarlos
    Object.values(weeks).forEach(el => { if (el) el.innerHTML = ''; });

    devotionals.forEach(day => {
        const weekNum = Math.ceil(day.day_number / 7);
        const container = weeks[weekNum];

        if (container) {
            const card = document.createElement('a');
            card.href = `dias/dia-dinamico.html?id=${day.day_number}`; // Enlace a página dinámica
            card.className = 'day-card';

            card.innerHTML = `
                <div class="day-number">${day.day_number}</div>
                <div class="day-title">${day.title}</div>
            `;

            container.appendChild(card);
        }
    });
});

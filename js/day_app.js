
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el ID del día de la URL: dia-dinamico.html?id=5
    const params = new URLSearchParams(window.location.search);
    const dayId = params.get('id');

    if (!dayId) {
        window.location.href = '../index.html';
        return;
    }

    const { data: day, error } = await db
        .from('devotionals')
        .select('*')
        .eq('day_number', dayId)
        .single();

    if (error || !day) {
        document.querySelector('main').innerHTML = '<p class="container">Día no encontrado.</p>';
        return;
    }

    // Actualizar Título y Meta
    document.title = `Día ${day.day_number} – ${day.title} | Un día con Dios`;

    // Header
    document.querySelector('.site-header h1').innerHTML = `<i class="fa-solid fa-star icon-yellow"></i> Día ${day.day_number} – ${day.title}`;

    // Versículo
    const verseSection = document.getElementById('versiculo')?.parentElement;
    if (verseSection) {
        verseSection.querySelector('blockquote p').innerText = `"${day.verse_text}"`;
        verseSection.querySelector('blockquote footer').innerText = `— ${day.verse_reference}`;
    }

    // Lectura
    // La lectura viene como HTML en la base de datos (reading_html) o texto
    const readingSection = document.getElementById('lectura')?.parentElement;
    if (readingSection) {
        // Insertamos después del h2
        const h2 = readingSection.querySelector('h2');
        // Eliminar contenido previo (excepto h2)
        while (h2.nextSibling) {
            h2.nextSibling.remove();
        }
        // Insertar nuevo contenido
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = day.reading_html;
        readingSection.appendChild(contentDiv);
    }

    // Pensar (Preguntas)
    const pensarSection = document.getElementById('pensar')?.parentElement;
    if (pensarSection) {
        const ul = pensarSection.querySelector('ul');
        ul.innerHTML = '';
        if (day.questions && Array.isArray(day.questions)) {
            day.questions.forEach(q => {
                const li = document.createElement('li');
                li.innerText = q;
                ul.appendChild(li);
            });
        }
    }

    // Actividad
    const actividadSection = document.getElementById('actividad')?.parentElement;
    if (actividadSection) {
        const p = actividadSection.querySelector('p');
        if (p) p.innerText = day.activity;
    }

    // Oración
    const oracionSection = document.getElementById('oracion')?.parentElement;
    if (oracionSection) {
        const p = oracionSection.querySelector('p');
        if (p) p.innerText = day.prayer;
    }
});

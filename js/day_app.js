
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const dayId = parseInt(params.get('id'));

    if (!dayId || dayId < 1 || dayId > 28) {
        window.location.href = '../index.html';
        return;
    }

    const { data: day, error } = await db
        .from('devotionals')
        .select('*')
        .eq('day_number', dayId)
        .single();

    if (error || !day) {
        document.getElementById('main').innerHTML = '<div class="card"><p>Dia no encontrado. <a href="../index.html">Volver al inicio</a></p></div>';
        return;
    }

    // Calcular semana
    const weekNum = Math.ceil(dayId / 7);
    const weekIcons = ['fa-seedling', 'fa-sun', 'fa-sun', 'fa-trophy'];
    const weekIcon = weekIcons[weekNum - 1] || 'fa-sun';

    // Actualizar titulo de la pagina
    document.title = `Dia ${day.day_number} - ${day.title} | Un dia con Dios`;

    // Actualizar header
    document.getElementById('week-badge').innerHTML = `<i class="fa-solid ${weekIcon}" style="color: #FFD54F;"></i> Semana ${weekNum}`;
    document.getElementById('page-title').innerHTML = `<i class="fa-solid fa-star"></i> Dia ${day.day_number} - ${day.title}`;
    document.getElementById('page-lead').textContent = getLeadText(day.title);

    // Construir contenido principal
    const main = document.getElementById('main');
    main.innerHTML = `
        <section class="card seccion-versiculo">
            <h2><span class="icon-circle icon-turquesa"><i class="fa-solid fa-book-bible"></i></span> Versiculo</h2>
            <blockquote>
                <p>"${day.verse_text}"</p>
                <footer>- ${day.verse_reference}</footer>
            </blockquote>
        </section>
        <section class="card seccion-lectura">
            <h2><span class="icon-circle icon-verde"><i class="fa-solid fa-book-open"></i></span> Lectura</h2>
            ${day.reading_html}
        </section>
        <section class="card seccion-pensar">
            <h2><span class="icon-circle icon-azul"><i class="fa-solid fa-lightbulb"></i></span> Para pensar</h2>
            <ul>
                ${(day.questions || []).map(q => `<li><i class="fa-solid fa-circle-question" style="color: #2196F3;"></i> ${q}</li>`).join('')}
            </ul>
        </section>
        <section class="card seccion-actividad">
            <h2><span class="icon-circle icon-amarillo"><i class="fa-solid fa-pencil"></i></span> Actividad</h2>
            <p>${day.activity}</p>
        </section>
        <section class="card seccion-oracion">
            <h2><span class="icon-circle icon-rosa"><i class="fa-solid fa-hands-praying"></i></span> Oracion</h2>
            <p><em>${day.prayer}</em></p>
        </section>
        <section class="card seccion-espacio">
            <h2><span class="icon-circle icon-naranja"><i class="fa-solid fa-star"></i></span> Espacio personal</h2>
            <p>Escribe lo que quieras recordar de hoy:</p>
            <textarea id="personal-notes" rows="6" placeholder="Escribe aqui..."></textarea>
        </section>
        <div class="navigation">
            ${dayId > 1 ? `<a href="dia-dinamico.html?id=${dayId - 1}" class="nav-btn"><i class="fa-solid fa-arrow-left"></i> Anterior</a>` : '<span></span>'}
            <span class="page-counter">Dia ${dayId} de 28</span>
            ${dayId < 28 ? `<a href="dia-dinamico.html?id=${dayId + 1}" class="nav-btn">Siguiente <i class="fa-solid fa-arrow-right"></i></a>` : `<a href="../index.html" class="nav-btn"><i class="fa-solid fa-flag-checkered"></i> Finalizar</a>`}
        </div>
    `;

    // LocalStorage para notas
    const textarea = document.getElementById('personal-notes');
    const storageKey = `devo-dia${dayId}`;
    textarea.value = localStorage.getItem(storageKey) || '';
    textarea.addEventListener('input', () => localStorage.setItem(storageKey, textarea.value));

    // Back to top button
    window.addEventListener('scroll', function() {
        document.querySelector('.back-to-top').classList.toggle('visible', window.scrollY > 400);
    });
});

function getLeadText(title) {
    const leads = {
        'El amor de Dios': 'Dios nos ama de manera incondicional',
        'La gratitud': 'Agradecer nos llena de alegria',
        'Confianza en Dios': 'Podemos confiar en Dios siempre',
        'La bondad': 'Ser buenos con los demas nos hace felices',
        'El perdon': 'Perdonar nos libera el corazon',
        'La obediencia': 'Obedecer a Dios nos protege',
        'La fe': 'La fe es confiar en lo que no vemos'
    };
    return leads[title] || 'Reflexion para crecer con Dios';
}

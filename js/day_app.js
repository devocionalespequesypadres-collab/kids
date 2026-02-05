
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
        document.getElementById('main').innerHTML = `
            <a href="../index.html" class="btn-volver">
                <i class="fa-solid fa-arrow-left"></i> Volver al inicio
            </a>
            <div class="card" style="text-align: center; padding: 40px;">
                <h2><i class="fa-solid fa-face-sad-tear"></i> Dia no encontrado</h2>
                <p>Lo sentimos, no pudimos cargar este devocional.</p>
                <a href="../index.html" class="button" style="margin-top: 20px;">
                    <i class="fa-solid fa-house"></i> Ir al inicio
                </a>
            </div>
        `;
        return;
    }

    // Calcular semana
    const weekNum = Math.ceil(dayId / 7);
    const weekIcons = ['fa-seedling', 'fa-sun', 'fa-sun', 'fa-trophy'];
    const weekIcon = weekIcons[weekNum - 1] || 'fa-sun';
    const weekColors = ['#F06292', '#4DD0E1', '#81C784', '#BA68C8'];
    const weekColor = weekColors[weekNum - 1] || '#4DD0E1';

    // Actualizar titulo de la pagina
    document.title = `Dia ${day.day_number} - ${day.title} | Un dia con Dios`;

    // Actualizar header
    document.getElementById('week-badge').innerHTML = `
        <i class="fa-solid ${weekIcon}" style="color: #FFD54F;"></i> Semana ${weekNum}
    `;
    document.getElementById('page-title').innerHTML = `
        <i class="fa-solid fa-star"></i> Dia ${day.day_number} - ${day.title}
    `;
    document.getElementById('page-lead').textContent = getLeadText(day.title);

    // Construir contenido principal
    const main = document.getElementById('main');
    main.innerHTML = `
        <!-- Boton Volver -->
        <a href="../index.html" class="btn-volver">
            <i class="fa-solid fa-arrow-left"></i> Volver al inicio
        </a>

        <!-- VERSICULO -->
        <section class="card seccion-versiculo">
            <h2>
                <span class="icon-circle icon-turquesa"><i class="fa-solid fa-book-bible"></i></span>
                <span class="emoji">📖</span> Versiculo
            </h2>
            <blockquote>
                <p>"${day.verse_text}"</p>
                <footer>— ${day.verse_reference}</footer>
            </blockquote>
        </section>

        <!-- LECTURA -->
        <section class="card seccion-lectura">
            <h2>
                <span class="icon-circle icon-verde"><i class="fa-solid fa-book-open"></i></span>
                <span class="emoji">📚</span> Lectura
            </h2>
            ${day.reading_html}
        </section>

        <!-- PARA PENSAR -->
        <section class="card seccion-pensar">
            <h2>
                <span class="icon-circle icon-azul"><i class="fa-solid fa-lightbulb"></i></span>
                <span class="emoji">💭</span> Para pensar
            </h2>
            <ul>
                ${(day.questions || []).map(q => `
                    <li>
                        <i class="fa-solid fa-circle-question" style="color: #2196F3;"></i>
                        ${q}
                    </li>
                `).join('')}
            </ul>
        </section>

        <!-- ACTIVIDAD -->
        <section class="card seccion-actividad">
            <h2>
                <span class="icon-circle icon-amarillo"><i class="fa-solid fa-pencil"></i></span>
                <span class="emoji">🎯</span> Actividad
            </h2>
            <p>${day.activity}</p>
        </section>

        <!-- ORACION -->
        <section class="card seccion-oracion">
            <h2>
                <span class="icon-circle icon-rosa"><i class="fa-solid fa-hands-praying"></i></span>
                <span class="emoji">🙏</span> Oracion
            </h2>
            <p><em>${day.prayer}</em></p>
        </section>

        <!-- ESPACIO PERSONAL -->
        <section class="card seccion-espacio">
            <h2>
                <span class="icon-circle icon-naranja"><i class="fa-solid fa-pen-fancy"></i></span>
                <span class="emoji">✏️</span> Espacio personal
            </h2>
            <p>Escribe o dibuja aqui lo que quieras recordar de hoy:</p>
            <textarea id="personal-notes" rows="7" placeholder="Escribe tus pensamientos, oraciones o dibujos aqui..."></textarea>
        </section>

        <!-- NAVEGACION -->
        <div class="navigation">
            ${dayId > 1
                ? `<a href="dia-dinamico.html?id=${dayId - 1}" class="nav-btn">
                    <i class="fa-solid fa-arrow-left"></i> Dia anterior
                   </a>`
                : '<span></span>'}
            <span class="page-counter">Dia ${dayId} de 28</span>
            ${dayId < 28
                ? `<a href="dia-dinamico.html?id=${dayId + 1}" class="nav-btn">
                    Dia siguiente <i class="fa-solid fa-arrow-right"></i>
                   </a>`
                : `<a href="../index.html" class="nav-btn">
                    <i class="fa-solid fa-flag-checkered"></i> Finalizar
                   </a>`}
        </div>
    `;

    // LocalStorage para notas
    const textarea = document.getElementById('personal-notes');
    const storageKey = `devo-dia${dayId}`;
    textarea.value = localStorage.getItem(storageKey) || '';
    textarea.addEventListener('input', () => localStorage.setItem(storageKey, textarea.value));

    // Back to top button
    window.addEventListener('scroll', function() {
        const btn = document.querySelector('.back-to-top');
        if (btn) btn.classList.toggle('visible', window.scrollY > 400);
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
        'La fe': 'La fe es confiar en lo que no vemos',
        'Dios me cuida': 'Dios siempre cuida de nosotros',
        'Dios escucha mis oraciones': 'Dios siempre nos escucha',
        'Dios me da valor': 'Con Dios podemos ser valientes',
        'Dios me perdona': 'El perdon de Dios es infinito',
        'Dios me guia': 'Dios nos muestra el camino',
        'Dios me ayuda a amar a los demas': 'Amar a otros es amar a Dios',
        'Dios me da paz': 'La paz de Dios calma nuestro corazon',
        'Dios me da alegria': 'La alegria viene de Dios',
        'Dios me hace fuerte': 'En Dios encontramos fortaleza',
        'Dios esta siempre conmigo': 'Nunca estamos solos',
        'Dios me ensena a ser agradecido': 'Dar gracias nos hace felices',
        'Dios me ayuda a ser generoso': 'Dar es mejor que recibir',
        'Dios me da esperanza': 'La esperanza nos mantiene firmes',
        'Dios me invita a descansar': 'Descansar tambien es importante',
        'Ser paciente': 'La paciencia es una virtud',
        'Ser honesto': 'La verdad nos hace libres',
        'Perdonarme': 'Tambien merecemos perdonarnos',
        'Dios me da sabiduria': 'La sabiduria viene de Dios',
        'Dios me ayuda en las dificultades': 'Dios es nuestro refugio',
        'Dios me ensena a ser humilde': 'La humildad nos acerca a Dios',
        'Dios celebra conmigo': 'Dios se alegra con nosotros'
    };
    return leads[title] || 'Reflexion para crecer con Dios cada dia';
}

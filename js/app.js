
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si estamos en la pagina principal
    const diasGrids = document.querySelectorAll('.dias-grid');
    if (!diasGrids || diasGrids.length === 0) return;

    try {
        // Cargar devocionales desde Supabase
        const devotionals = await getDevotionals();

        if (!devotionals || devotionals.length === 0) {
            console.log('Usando enlaces estaticos (Supabase no disponible)');
            return; // Mantener enlaces estaticos como fallback
        }

        console.log(`Cargados ${devotionals.length} devocionales desde Supabase`);

        // Actualizar enlaces para usar pagina dinamica
        const allDayCards = document.querySelectorAll('.dia-card');

        devotionals.forEach(day => {
            // Buscar la tarjeta correspondiente
            allDayCards.forEach(card => {
                const dayTitle = card.querySelector('h3');
                if (dayTitle && dayTitle.textContent.includes(`Dia ${day.day_number}`)) {
                    // Cambiar enlace a pagina dinamica
                    card.href = `dias/dia-dinamico.html?id=${day.day_number}`;

                    // Actualizar titulo si es diferente
                    const pTitle = card.querySelector('p');
                    if (pTitle && day.title) {
                        pTitle.textContent = day.title;
                    }
                }
            });
        });

    } catch (error) {
        console.log('Error conectando a Supabase, usando enlaces estaticos:', error);
        // Los enlaces estaticos siguen funcionando como fallback
    }
});


const SUPABASE_URL = 'https://qmkfkrvywofzgqskqhxz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFta2ZrcnZ5d29memdxc2txaHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjQwNDEsImV4cCI6MjA4NTYwMDA0MX0.hcjKu1fEnA6-qZzgJ3mBk2tehKKI2fkn9O0NKrXMXQs';

// Inicializar cliente de Supabase
// Asegúrate de incluir el script de Supabase en tu HTML antes de este archivo
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function getDevotionals() {
    console.log("Obteniendo devocionales...");
    const { data, error } = await db
        .from('devotionals')
        .select('*')
        .order('day_number', { ascending: true });

    if (error) {
        console.error('Error al cargar devocionales:', error);
        return [];
    }
    return data;
}

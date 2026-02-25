import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { Announcement } from '../types/database';

export const useAnuncios = () => {
  const [anuncios, setAnuncios] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnuncios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnuncios(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Error al cargar los anuncios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnuncios();
  }, [fetchAnuncios]);

  return { anuncios, loading, error, refetch: fetchAnuncios, setAnuncios };
};

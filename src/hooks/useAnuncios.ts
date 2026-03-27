import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import type { Announcement } from '../types/database';

export const useAnuncios = () => {
  const [anuncios, setAnuncios] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnuncios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: Announcement[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Announcement);
      });
      setAnuncios(data);
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

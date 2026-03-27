import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { Profile } from '../../../types/database';
import { Button } from '../../atoms/Button';

export const ParentApproval = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data: Profile[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Profile);
      });
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching pending profiles:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPendingProfiles();
  }, []);
  const approveProfile = async (id: string) => {
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        status: 'approved',
        role: 'parent',
        updatedAt: serverTimestamp()
      });
      fetchPendingProfiles();
    } catch (error: any) {
      alert('Error aprobando perfil: ' + error.message);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Cargando solicitudes...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <span className="text-2xl block mb-2">✅</span>
          No hay solicitudes pendientes.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">Usuario</th>
                <th scope="col" className="px-4 py-3">Fecha Solicitud</th>
                <th scope="col" className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((profile) => (
                <tr key={profile.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {profile.email.charAt(0).toUpperCase()}
                    </div>
                    {profile.email}
                  </td>
                  <td className="px-4 py-3">
                    {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approveProfile(profile.id)}
                    >
                      Aprobar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

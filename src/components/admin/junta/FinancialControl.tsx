import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { GroupFinance } from '../../../types/database';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { useAuth } from '../../../context/AuthContext';

export const FinancialControl = () => {
  const { user } = useAuth();
  const [finance, setFinance] = useState<GroupFinance | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState('0');

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'group_finance', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as GroupFinance;
        setFinance(data);
        setAmount(data.balance.toString());
      } else {
        setAmount('0');
      }
    } catch (error) {
      console.error('Error fetching finance:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFinance();
  }, []);

  const handleUpdate = async () => {
    const newBalance = parseFloat(amount);
    if (isNaN(newBalance)) {
      alert('Monto inválido');
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, 'group_finance', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          balance: Number(newBalance),
          last_updated_at: serverTimestamp(),
          updated_by: user?.id
        });
      } else {
        await setDoc(docRef, {
          balance: Number(newBalance),
          updated_by: user?.id,
          created_at: serverTimestamp(),
          last_updated_at: serverTimestamp()
        });
      }
      setIsEditing(false);
      fetchFinance();
    } catch (error: any) {
      alert('Error actualizando finanzas: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500 mb-1">Saldo Disponible del Grupo</p>
        {loading ? (
          <div className="h-16 w-48 bg-slate-100 rounded animate-pulse mx-auto"></div>
        ) : (
          <h2 className={`text-6xl font-black tracking-tighter ${
            finance && finance.balance < 0 ? 'text-red-500' : 'text-slate-800'
          }`}>
            ₡{finance?.balance.toLocaleString() ?? '0'}
          </h2>
        )}
        <p className="text-xs text-slate-400 mt-2">
          Actualizado: {finance?.last_updated_at ? new Date((finance.last_updated_at as any).seconds * 1000).toLocaleString() : 'N/A'}
        </p>
      </div>

      {isEditing ? (
        <div className="w-full max-w-xs animate-fade-in-up">
          <Input
            label="Nuevo Saldo"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-center text-xl font-bold"
          />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" fullWidth onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button variant="primary" fullWidth onClick={handleUpdate} disabled={loading}>Guardar</Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all px-8"
        >
          Editar Monto
        </Button>
      )}
    </div>
  );
};

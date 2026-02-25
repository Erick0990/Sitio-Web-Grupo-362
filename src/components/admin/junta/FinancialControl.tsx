import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
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

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('group_finance')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (data) {
      setFinance(data);
      setAmount(data.balance.toString());
    } else if (!error) {
      // Row doesn't exist? Schema says it inserts one.
      // But if not found, we can default to 0.
      setAmount('0');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    const newBalance = parseFloat(amount);
    if (isNaN(newBalance)) {
      alert('Monto inválido');
      return;
    }

    setLoading(true);

    // Check if row exists, if not insert
    const { data: existing } = await supabase
      .from('group_finance')
      .select('id')
      .eq('id', 1)
      .maybeSingle();

    let error;
    if (existing) {
       const { error: updateError } = await supabase
         .from('group_finance')
         .update({
           balance: newBalance,
           last_updated_at: new Date().toISOString(),
           updated_by: user?.id
         })
         .eq('id', 1);
       error = updateError;
    } else {
       const { error: insertError } = await supabase
         .from('group_finance')
         .insert([{
           id: 1,
           balance: newBalance,
           updated_by: user?.id
         }]);
       error = insertError;
    }

    if (error) {
      alert('Error actualizando finanzas: ' + error.message);
    } else {
      setIsEditing(false);
      fetchFinance();
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
          Actualizado: {finance?.last_updated_at ? new Date(finance.last_updated_at).toLocaleString() : 'N/A'}
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

// hooks/useOfflineMutation.ts
import { useNetworkStatus } from './useNetworkStatus';
import { offlineDB } from '@/lib/offlineDB';
import { supabase } from '@/lib/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

type MutationAction = 'insert' | 'update' | 'delete';

interface MutationResult {
  data: any;
  error: PostgrestError | Error | null;
}

export function useOfflineMutation(table: string) {
  const isOnline = useNetworkStatus();

  const mutate = async (
    action: MutationAction,
    payload?: any,
    recordId?: number
  ): Promise<MutationResult> => {
    if (isOnline) {
      try {
        let result;
        if (action === 'insert') result = await supabase.from(table).insert(payload);
        else if (action === 'update') result = await supabase.from(table).update(payload).eq('id', recordId);
        else if (action === 'delete') result = await supabase.from(table).delete().eq('id', recordId);
        
        // Normalizamos la respuesta
        if (result?.error) {
          return { data: null, error: result.error };
        }
        return { data: result?.data ?? null, error: null };
      } catch (err) {
        return { data: null, error: err as Error };
      }
    } else {
      // Offline: guardar en cola
      await offlineDB.pendingOperations.add({
        table,
        action,
        payload,
        recordId,
        timestamp: Date.now(),
        synced: 0,
      });
      return { data: payload, error: null };
    }
  };

  return { mutate };
}
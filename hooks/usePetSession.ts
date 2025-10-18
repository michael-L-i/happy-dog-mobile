import { useState, useEffect, useCallback } from 'react';
import { ApiService, PetState } from '@/services/api';
import { StorageService } from '@/services/storage';

export function usePetSession() {
  const [petState, setPetState] = useState<PetState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPetState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const session = StorageService.getSession();
      const pet = StorageService.getPet();

      if (!session || !pet) {
        return { hasSession: false };
      }

      const state = await ApiService.getState(pet.name, session.space);

      if (!state) {
        setError('Pet not found');
        return { hasSession: false };
      }

      setPetState(state);
      return { hasSession: true };
    } catch (err) {
      console.error('Error loading pet state:', err);
      setError('Failed to load pet');
      return { hasSession: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performAction = useCallback(async (action: 'feed' | 'pet' | 'treat' | 'toy') => {
    if (!petState) return;

    const session = StorageService.getSession();
    if (!session) return;

    // Optimistically update local state
    const newState = { ...petState };
    
    switch (action) {
      case 'feed':
        newState.state_stomach = Math.min(100, newState.state_stomach + 50);
        newState.state_energy = Math.max(0, newState.state_energy - 1);
        newState.coin = (newState.coin || 0) + 1;
        break;
      case 'pet':
        newState.state_mood = Math.min(100, newState.state_mood + 5);
        newState.state_energy = Math.max(0, newState.state_energy - 1);
        newState.coin = (newState.coin || 0) + 1;
        break;
      case 'treat':
        newState.state_stomach = Math.min(100, newState.state_stomach + 2);
        newState.state_mood = Math.min(100, newState.state_mood + 5);
        newState.state_energy = Math.max(0, newState.state_energy - 1);
        newState.coin = (newState.coin || 0) + 1;
        break;
      case 'toy':
        newState.state_mood = Math.min(100, newState.state_mood + 20);
        newState.state_energy = Math.max(0, newState.state_energy - 5);
        newState.coin = (newState.coin || 0) + 1;
        break;
    }

    setPetState(newState);

    // Cache action for batch update
    const cachedActions = StorageService.getCachedActions();
    cachedActions.push(action);
    StorageService.setCachedActions(cachedActions);

    // Optionally: trigger batch update immediately or let it happen in background
    // For now, we'll let it happen in background
  }, [petState]);

  const flushCachedActions = useCallback(async () => {
    const session = StorageService.getSession();
    const pet = StorageService.getPet();
    const cachedActions = StorageService.getCachedActions();

    if (!session || !pet || cachedActions.length === 0) return;

    try {
      const updatedState = await ApiService.batchActionUpdate(
        pet.name,
        session.space,
        session.user,
        cachedActions
      );

      // Update state with server response
      if (petState && updatedState) {
        setPetState({ ...petState, ...updatedState });
      }

      // Clear cached actions
      StorageService.setCachedActions([]);
    } catch (err) {
      console.error('Error flushing cached actions:', err);
    }
  }, [petState]);

  useEffect(() => {
    loadPetState();
  }, [loadPetState]);

  return {
    petState,
    isLoading,
    error,
    loadPetState,
    performAction,
    flushCachedActions,
  };
}


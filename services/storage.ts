import { MMKV } from 'react-native-mmkv';

export interface Session {
  user: string;
  space: string;
}

export interface PetData {
  name: string;
  breed: number;
}

export interface Goodie {
  id: number;
  type: number;
}

// Initialize MMKV storage
const storage = new MMKV();

// Storage keys
const KEYS = {
  SESSION: 'session',
  PET: 'pet',
  CLIENT_ID: 'client_id',
  GOODIES_OWNED: 'goodies_owned',
  PUT_ON_GOODIES: 'put_on_goodies',
  RECENT_SPACES: 'recent_spaces',
  CACHED_ACTIONS: 'cached_actions',
};

export class StorageService {
  // Session management
  static getSession(): Session | null {
    try {
      const session = storage.getString(KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static setSession(user: string, space: string): void {
    try {
      storage.set(KEYS.SESSION, JSON.stringify({ user, space }));
    } catch (error) {
      console.error('Error setting session:', error);
      throw error;
    }
  }

  static clearSession(): void {
    try {
      storage.delete(KEYS.SESSION);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Pet management
  static getPet(): PetData | null {
    try {
      const pet = storage.getString(KEYS.PET);
      return pet ? JSON.parse(pet) : null;
    } catch (error) {
      console.error('Error getting pet:', error);
      return null;
    }
  }

  static setPet(name: string, breed: number): void {
    try {
      storage.set(KEYS.PET, JSON.stringify({ name, breed }));
    } catch (error) {
      console.error('Error setting pet:', error);
      throw error;
    }
  }

  static clearPet(): void {
    try {
      storage.delete(KEYS.PET);
    } catch (error) {
      console.error('Error clearing pet:', error);
    }
  }

  // Client ID management
  static getClientId(): string | null {
    try {
      return storage.getString(KEYS.CLIENT_ID) ?? null;
    } catch (error) {
      console.error('Error getting client_id:', error);
      return null;
    }
  }

  static setClientId(clientId: string): void {
    try {
      storage.set(KEYS.CLIENT_ID, clientId);
    } catch (error) {
      console.error('Error setting client_id:', error);
      throw error;
    }
  }

  // Goodies management
  static getGoodiesOwned(): Goodie[] {
    try {
      const goodies = storage.getString(KEYS.GOODIES_OWNED);
      return goodies ? JSON.parse(goodies) : [
        { id: 1, type: 1 },
        { id: 23, type: 2 },
        { id: 31, type: 3 }
      ];
    } catch (error) {
      console.error('Error getting goodies owned:', error);
      return [];
    }
  }

  static setGoodiesOwned(goodies: Goodie[]): void {
    try {
      storage.set(KEYS.GOODIES_OWNED, JSON.stringify(goodies));
    } catch (error) {
      console.error('Error setting goodies owned:', error);
      throw error;
    }
  }

  static getPutOnGoodies(): boolean[] {
    try {
      const putOnGoodies = storage.getString(KEYS.PUT_ON_GOODIES);
      return putOnGoodies ? JSON.parse(putOnGoodies) : [false, true, false];
    } catch (error) {
      console.error('Error getting put on goodies:', error);
      return [];
    }
  }

  static setPutOnGoodies(putOnGoodies: boolean[]): void {
    try {
      storage.set(KEYS.PUT_ON_GOODIES, JSON.stringify(putOnGoodies));
    } catch (error) {
      console.error('Error setting put on goodies:', error);
      throw error;
    }
  }

  // Recent spaces management
  static getRecentSpaces(): string[] {
    try {
      const spaces = storage.getString(KEYS.RECENT_SPACES);
      return spaces ? JSON.parse(spaces) : [];
    } catch (error) {
      console.error('Error getting recent spaces:', error);
      return [];
    }
  }

  static storeRecentSpace(space: string): void {
    try {
      const recentSpaces = this.getRecentSpaces();
      
      // Remove space if it already exists
      const index = recentSpaces.indexOf(space);
      if (index > -1) {
        recentSpaces.splice(index, 1);
      }
      
      // Add to end and keep only last 3
      recentSpaces.push(space);
      const updatedSpaces = [...new Set(recentSpaces.slice(-3))];
      
      storage.set(KEYS.RECENT_SPACES, JSON.stringify(updatedSpaces));
    } catch (error) {
      console.error('Error storing recent space:', error);
    }
  }

  // Cached actions management
  static getCachedActions(): string[] {
    try {
      const actions = storage.getString(KEYS.CACHED_ACTIONS);
      return actions ? JSON.parse(actions) : [];
    } catch (error) {
      console.error('Error getting cached actions:', error);
      return [];
    }
  }

  static setCachedActions(actions: string[]): void {
    try {
      storage.set(KEYS.CACHED_ACTIONS, JSON.stringify(actions));
    } catch (error) {
      console.error('Error setting cached actions:', error);
      throw error;
    }
  }

  // Clear all data
  static clearAll(): void {
    try {
      storage.delete(KEYS.SESSION);
      storage.delete(KEYS.PET);
      storage.delete(KEYS.GOODIES_OWNED);
      storage.delete(KEYS.PUT_ON_GOODIES);
      storage.delete(KEYS.CACHED_ACTIONS);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}


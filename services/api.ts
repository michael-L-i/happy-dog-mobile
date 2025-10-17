const API_BASE_URL = 'https://us-central1-office-pets.cloudfunctions.net';

export interface PetInfo {
  name: string;
  breed: number;
}

export interface PetState {
  id: string;
  pet: string;
  space: string;
  breed: number;
  state_mood: number;
  state_stomach: number;
  state_energy: number;
  state_health: number;
  coin: number;
  activity?: string[];
  time?: string[];
  by_user?: string[];
  boarding?: boolean;
  created_by_clientId?: string;
  ownerId?: string;
  personality_profile?: any;
}

export interface CreatePetResponse {
  space: string;
  pet: string;
  breed: number;
}

export interface Goodie {
  id: number;
  type: number;
}

export class ApiService {
  /**
   * Register a new install and get a client_id
   */
  static async registerNewInstall(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/registerNewInstall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.client_id) {
        throw new Error('No client_id received from server');
      }

      return data.client_id;
    } catch (error) {
      console.error('Error registering new install:', error);
      throw error;
    }
  }

  /**
   * Create a new pet and space
   */
  static async createPet(petName: string, breed: number, clientId: string): Promise<CreatePetResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/createPet-3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet: petName,
          breed: breed,
          client_id: clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Create pet response:', data);
      return data;
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    }
  }

  /**
   * Get pets in a space
   */
  static async getPets(space: string): Promise<PetInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/getPetsAndBreed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ space }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Get pets response:', data);
      return data;
    } catch (error) {
      console.error('Error getting pets:', error);
      throw error;
    }
  }

  /**
   * Get pet state
   */
  static async getState(pet: string, space: string): Promise<PetState | null> {
    try {
      console.log('Getting state for:', { pet, space });
      
      const response = await fetch(`${API_BASE_URL}/getState`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, space }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.status >= 200 && response.status < 300) {
        console.log('State response:', data);
        return data;
      } else {
        console.log('Pet not found (404)');
        return null;
      }
    } catch (error) {
      console.error('Error getting state:', error);
      throw error;
    }
  }

  /**
   * Get goodies owned by the pet
   */
  static async getGoodies(pet: string, space: string, user: string): Promise<Goodie[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/getGoodies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, space, user }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Get goodies response:', data);
      return data;
    } catch (error) {
      console.error('Error getting goodies:', error);
      throw error;
    }
  }

  /**
   * Get coin count for a client
   */
  static async getCoins(clientId: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/getCoinCount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.coins || 0;
    } catch (error) {
      console.error('Error getting coins:', error);
      return 0;
    }
  }

  /**
   * Batch update actions
   */
  static async batchActionUpdate(
    pet: string,
    space: string,
    user: string,
    actions: string[]
  ): Promise<Partial<PetState>> {
    try {
      const response = await fetch(`${API_BASE_URL}/batch_action_update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, space, user, actions }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Batch action update response:', data);
      return data;
    } catch (error) {
      console.error('Error batch updating actions:', error);
      throw error;
    }
  }

  /**
   * Get favorite users / leaderboard
   */
  static async getFavoriteUsers(pet: string, space: string, user: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/getFavoriteUsers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, space, user }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting favorite users:', error);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(pet: string, space: string, user: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/getRecentActivity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet, space, user }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }
}


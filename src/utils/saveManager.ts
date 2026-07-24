import { PlayerProfile } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

const SAVE_KEY = 'altyn_dag_player_profile_v1';

export class SaveManager {
  public static loadProfile(): PlayerProfile {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...GAME_CONFIG.DEFAULT_PLAYER_PROFILE,
          ...parsed,
          settings: {
            ...GAME_CONFIG.DEFAULT_PLAYER_PROFILE.settings,
            ...(parsed.settings || {})
          }
        };
      }
    } catch (e) {
      console.warn('Failed to load profile from localStorage, using default:', e);
    }
    return { ...GAME_CONFIG.DEFAULT_PLAYER_PROFILE };
  }

  public static saveProfile(profile: PlayerProfile): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }

  public static resetProgress(): PlayerProfile {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
    return { ...GAME_CONFIG.DEFAULT_PLAYER_PROFILE };
  }
}

import { create } from 'zustand';
import { habitService, Habit, CheckIn } from '../services/habitService';

interface HabitState {
  habits: Habit[];
  selectedHabit: Habit | null;
  checkIns: CheckIn[];
  isLoading: boolean;
  error: string | null;
  getHabits: () => Promise<void>;
  getHabit: (habitId: string) => Promise<void>;
  createHabit: (data: any) => Promise<void>;
  updateHabit: (habitId: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  getCheckIns: (habitId: string) => Promise<void>;
  createCheckIn: (
    habitId: string,
    data: any
  ) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  selectedHabit: null,
  checkIns: [],
  isLoading: false,
  error: null,

  getHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await habitService.getHabits();
      set({ habits, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch habits';
      set({ error: message, isLoading: false });
    }
  },

  getHabit: async (habitId: string) => {
    set({ isLoading: true, error: null });
    try {
      const selectedHabit = await habitService.getHabit(habitId);
      set({ selectedHabit, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch habit';
      set({ error: message, isLoading: false });
    }
  },

  createHabit: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const newHabit = await habitService.createHabit(data);
      set((state) => ({
        habits: [...state.habits, newHabit],
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create habit';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateHabit: async (habitId: string, data: Partial<Habit>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedHabit = await habitService.updateHabit(habitId, data);
      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === habitId ? updatedHabit : h
        ),
        selectedHabit:
          state.selectedHabit?.id === habitId
            ? updatedHabit
            : state.selectedHabit,
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update habit';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteHabit: async (habitId: string) => {
    console.log('🗑️ [habitStore] deleteHabit iniciado:', habitId);
    set({ isLoading: true, error: null });
    try {
      console.log('📡 [habitStore] Chamando habitService.deleteHabit...');
      await habitService.deleteHabit(habitId);
      console.log('✅ [habitStore] Hábito deletado da API');
      
      set((state) => {
        const filteredHabits = state.habits.filter((h) => h.id !== habitId);
        console.log('🔄 [habitStore] State atualizado. Hábitos restantes:', filteredHabits.length);
        return {
          habits: filteredHabits,
          selectedHabit:
            state.selectedHabit?.id === habitId ? null : state.selectedHabit,
          isLoading: false,
        };
      });
      console.log('✅ [habitStore] State sincronizado');
    } catch (error) {
      console.error('❌ [habitStore] Erro ao deletar:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to delete habit';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getCheckIns: async (habitId: string) => {
    set({ isLoading: true, error: null });
    try {
      const checkIns = await habitService.getCheckIns(habitId);
      set({ checkIns, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch check-ins';
      set({ error: message, isLoading: false });
    }
  },

  createCheckIn: async (habitId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const newCheckIn = await habitService.createCheckIn(habitId, data);
      set((state) => ({
        checkIns: [...state.checkIns, newCheckIn],
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create check-in';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      habits: [],
      selectedHabit: null,
      checkIns: [],
      isLoading: false,
      error: null,
    });
  },
}));

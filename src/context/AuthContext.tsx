'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

/* ─── Types ──────────────────────────────────────────────────────────── */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  birthYear: number;
  gender: 'Male' | 'Female' | 'Other';
  region: string;
  freeAnalysesUsed: number;
  plan: 'free' | 'pro' | 'enterprise';
  token: string;
  createdAt: string;
  analyses: SavedAnalysis[];
}

export interface SavedOptimizationItem {
  category: string;
  categoryZh: string;
  recommendation: string;
  recommendationZh: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SavedPillarSummary {
  caseId: string;
  nameZh: string;
  nameEn: string;
  risk: 'normal' | 'medium' | 'high';
}

export interface SavedAnalysis {
  id: string;
  date: string;
  type: 'mock' | 'upload';
  biologicalAge: number;
  chronologicalAge: number;
  delta: number;
  topFlags: string[];
  optimizationItems?: SavedOptimizationItem[];
  pillarSummary?: SavedPillarSummary[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthYear: number;
  gender: 'Male' | 'Female' | 'Other';
  region: string;
}

export interface ProfileUpdateData {
  name?: string;
  birthYear?: number;
  gender?: 'Male' | 'Female' | 'Other';
  region?: string;
}

interface AuthContextShape {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => void;
  consumeFreeAnalysis: () => void;
  hasRemainingAnalyses: () => boolean;
  remainingFreeCount: () => number;
  saveAnalysis: (analysis: Omit<SavedAnalysis, 'id' | 'date'>) => void;
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const STORAGE_KEY  = 'pivot_auth_user';
const ACCOUNTS_KEY = 'pivot_accounts';
const FREE_QUOTA   = 3;

/* ─── Helpers ────────────────────────────────────────────────────────── */
function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function getAccounts(): Record<string, { passwordHash: string; user: AuthUser }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, { passwordHash: string; user: AuthUser }>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

/* ─── Context ────────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextShape>({
  user: null,
  isLoading: true,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: () => {},
  updateProfile: () => {},
  consumeFreeAnalysis: () => {},
  hasRemainingAnalyses: () => false,
  remainingFreeCount: () => 0,
  saveAnalysis: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  /* Load persisted session on mount */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* Persist user to localStorage whenever it changes */
  useEffect(() => {
    if (isLoading) return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      const accounts = getAccounts();
      if (accounts[user.email]) {
        accounts[user.email].user = user;
        saveAccounts(accounts);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, isLoading]);

  const register = useCallback(async (data: RegisterData): Promise<{ ok: boolean; error?: string }> => {
    const accounts = getAccounts();
    if (accounts[data.email]) {
      return { ok: false, error: '该邮箱已注册账户。|This email is already registered.' };
    }
    if (data.password.length < 8) {
      return { ok: false, error: '密码至少需要 8 位字符。|Password must be at least 8 characters.' };
    }

    const newUser: AuthUser = {
      id: generateId(),
      name: data.name,
      email: data.email,
      birthYear: data.birthYear,
      gender: data.gender,
      region: data.region,
      freeAnalysesUsed: 0,
      plan: 'free',
      token: generateId(),
      createdAt: new Date().toISOString(),
      analyses: [],
    };

    accounts[data.email] = { passwordHash: simpleHash(data.password), user: newUser };
    saveAccounts(accounts);
    setUser(newUser);
    return { ok: true };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const accounts = getAccounts();
    const record = accounts[email];
    if (!record) {
      return { ok: false, error: '该邮箱未注册账户。' };
    }
    if (record.passwordHash !== simpleHash(password)) {
      return { ok: false, error: '密码不正确。' };
    }
    setUser(record.user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: ProfileUpdateData) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  }, []);

  const consumeFreeAnalysis = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, freeAnalysesUsed: prev.freeAnalysesUsed + 1 };
    });
  }, []);

  const hasRemainingAnalyses = useCallback((): boolean => {
    if (!user) return false;
    if (user.plan === 'pro' || user.plan === 'enterprise') return true;
    return user.freeAnalysesUsed < FREE_QUOTA;
  }, [user]);

  const remainingFreeCount = useCallback((): number => {
    if (!user) return 0;
    if (user.plan !== 'free') return Infinity;
    return Math.max(0, FREE_QUOTA - user.freeAnalysesUsed);
  }, [user]);

  const saveAnalysis = useCallback((analysis: Omit<SavedAnalysis, 'id' | 'date'>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newAnalysis: SavedAnalysis = {
        ...analysis,
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
      };
      return { ...prev, analyses: [newAnalysis, ...prev.analyses] };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateProfile, consumeFreeAnalysis, hasRemainingAnalyses, remainingFreeCount, saveAnalysis }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

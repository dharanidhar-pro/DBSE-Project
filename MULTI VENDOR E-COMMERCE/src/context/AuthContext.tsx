import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, UserRole, VendorApprovalStatus } from '../types/database';
import { authService, CustomerRegistrationPayload, VendorRegistrationPayload, AuthResult } from '../services/api/authService';
import {
  initializeStorage,
  getSessionUser,
  setSessionUser,
  updateCustomerProfile,
  updateVendorProfile,
  updateAdminProfile,
} from '../services/storage';
import { useToast } from './ToastContext';

export interface ProfileUpdatePayload {
  name?: string;
  business_name?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginCustomer: (email: string, password: string) => Promise<AuthResult>;
  registerCustomer: (payload: CustomerRegistrationPayload) => Promise<AuthResult>;
  loginVendor: (email: string, password: string) => Promise<AuthResult>;
  registerVendor: (payload: VendorRegistrationPayload) => Promise<AuthResult>;
  loginAdmin: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => void;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<{ success: boolean; error?: string }>;
  // Quick demo switch helper for testing all 20 demo rubric requirements with one click
  switchDemoRole: (role: 'customer' | 'vendor_approved' | 'vendor_pending' | 'vendor_rejected' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showSuccess, showInfo } = useToast();

  // Initialize storage & check session on mount
  useEffect(() => {
    initializeStorage();
    const currentSession = getSessionUser();
    if (currentSession) {
      setUser(currentSession);
    }
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(() => {
    const currentSession = getSessionUser();
    setUser(currentSession);
  }, []);

  const loginCustomer = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await authService.loginCustomer(email, password);
        if (result.success && result.user) {
          setUser(result.user);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const registerCustomer = useCallback(
    async (payload: CustomerRegistrationPayload): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await authService.registerCustomer(payload);
        if (result.success && result.user) {
          setUser(result.user);
          showSuccess('Account created successfully.\nWelcome to MarketHub!', 'Registration Success');
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess]
  );

  const loginVendor = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await authService.loginVendor(email, password);
        if (result.success && result.user) {
          setUser(result.user);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const registerVendor = useCallback(
    async (payload: VendorRegistrationPayload): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await authService.registerVendor(payload);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loginAdmin = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        const result = await authService.loginAdmin(email, password);
        if (result.success && result.user) {
          setUser(result.user);
        }
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(() => {
    const currentRole = user?.role;
    authService.logout();
    setUser(null);
    if (currentRole === 'CUSTOMER') {
      showInfo('You have been logged out.', 'Session Ended');
    }
  }, [user, showInfo]);

  // Profile customization helper
  const updateProfile = useCallback(
    async (payload: ProfileUpdatePayload): Promise<{ success: boolean; error?: string }> => {
      const currentSession = getSessionUser();
      if (!currentSession) {
        return { success: false, error: 'No active session found.' };
      }

      try {
        if (currentSession.role === 'CUSTOMER') {
          const updated = updateCustomerProfile(currentSession.id, {
            ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
            ...(payload.phone !== undefined ? { phone: payload.phone.trim() } : {}),
            ...(payload.address !== undefined ? { address: payload.address.trim() } : {}),
            ...(payload.avatar !== undefined ? { avatar: payload.avatar } : {}),
          });
          if (!updated) {
            return { success: false, error: 'Failed to update customer profile in storage.' };
          }
        } else if (currentSession.role === 'VENDOR') {
          const updated = updateVendorProfile(currentSession.id, {
            ...(payload.business_name !== undefined ? { business_name: payload.business_name.trim() } : {}),
            ...(payload.name !== undefined && !payload.business_name ? { business_name: payload.name.trim() } : {}),
            ...(payload.phone !== undefined ? { phone: payload.phone.trim() } : {}),
            ...(payload.address !== undefined ? { business_address: payload.address.trim() } : {}),
            ...(payload.avatar !== undefined ? { avatar: payload.avatar } : {}),
          });
          if (!updated) {
            return { success: false, error: 'Failed to update vendor profile in storage.' };
          }
        } else if (currentSession.role === 'ADMIN') {
          updateAdminProfile({
            ...(payload.name !== undefined ? { admin_name: payload.name.trim() } : {}),
            ...(payload.avatar !== undefined ? { avatar: payload.avatar } : {}),
          });
        }

        const refreshed = getSessionUser();
        setUser(refreshed);
        showSuccess('Your profile details have been saved successfully!', 'Profile Updated');
        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update profile.';
        return { success: false, error: errorMsg };
      }
    },
    [showSuccess]
  );

  // Demo helper to conveniently load standard accounts
  const switchDemoRole = useCallback(
    async (type: 'customer' | 'vendor_approved' | 'vendor_pending' | 'vendor_rejected' | 'admin') => {
      switch (type) {
        case 'customer':
          await loginCustomer('customer@markethub.demo', 'Customer@123');
          break;
        case 'vendor_approved':
          await loginVendor('vendor@markethub.demo', 'Vendor@123');
          break;
        case 'vendor_pending':
          await loginVendor('pending@markethub.demo', 'Vendor@123');
          break;
        case 'vendor_rejected':
          await loginVendor('rejected@markethub.demo', 'Vendor@123');
          break;
        case 'admin':
          await loginAdmin('admin@markethub.demo', 'Admin@123');
          break;
      }
    },
    [loginCustomer, loginVendor, loginAdmin]
  );

  const value = {
    user,
    role: user ? user.role : null,
    isAuthenticated: !!user,
    isLoading,
    loginCustomer,
    registerCustomer,
    loginVendor,
    registerVendor,
    loginAdmin,
    logout,
    refreshUser,
    updateProfile,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

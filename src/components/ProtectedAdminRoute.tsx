import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/pages/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ProtectedAdminRoute = () => {
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;
      if (!user) {
        setAuthorized(false);
        return;
      }

      // Check if the user has admin or creator role
      const [{ data: isAdmin, error: adminErr }, { data: isCreator, error: creatorErr }] = await Promise.all([
        supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }),
        supabase.rpc('has_role', { _user_id: user.id, _role: 'creator' }),
      ]);

      if (adminErr || creatorErr) {
        console.error('Role check failed', adminErr || creatorErr);
        setAuthorized(false);
        return;
      }

      setAuthorized(Boolean(isAdmin) || Boolean(isCreator));
    };

    checkAccess();
  }, [user, loading]);

  if (loading || authorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return <AdminDashboard />;
};

export default ProtectedAdminRoute;

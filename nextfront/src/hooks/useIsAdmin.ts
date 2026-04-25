import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useIsAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                const { data: profiles, error } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", session.user.id)
                    .single();

                setIsAdmin(!error && profiles?.is_admin === true);
            } catch (err) {
                console.error("Error checking admin status:", err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        }

        checkAdmin();
    }, []);

    return { isAdmin, loading };
}

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { RootState } from '@/reducers/store';
import { clearSession } from '@/reducers/session/sessionSlice';
import { isTokenExpired } from '@/lib/utils';

function useTokenExpiry() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expiry, accessToken } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (!accessToken) return undefined;

    const checkTokenExpiry = () => {
      if (isTokenExpired(expiry)) {
        dispatch(clearSession());
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/');
      }
    };

    checkTokenExpiry();

    const interval = setInterval(checkTokenExpiry, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [expiry, accessToken, dispatch, navigate]);
}

export default useTokenExpiry;

import { useState, useEffect } from 'react';
import bridge from '@maxhub/max-bridge';

export function useInitData() {
  const [initData, setInitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bridge.getInitData()
      .then(data => {
        setInitData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('InitData error:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { initData, loading, error };
}
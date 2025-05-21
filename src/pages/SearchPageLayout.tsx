import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export function SearchPageLayout() {
  useEffect(() => {
    console.log('SearchPageLayout MOUNTED');
    return () => {
      console.log('SearchPageLayout UNMOUNTED');
    };
  }, []);

  return (
    <Outlet />
  );
} 
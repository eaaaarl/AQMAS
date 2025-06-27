import { useEffect } from 'react';
import { useToast } from '@/lib/redux/hooks/useUI';

interface ToastProps {
  id?: string;
  duration?: number;
}

export function Toast({ id, duration = 3000 }: ToastProps) {
  const { component, close } = useToast(id);

  useEffect(() => {
    if (component?.open) {
      const timer = setTimeout(() => {
        close();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [component?.open, close, duration]);

  if (!component?.open) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-all transform ${
        component.variant === 'success'
          ? 'bg-green-500 text-white'
          : component.variant === 'destructive'
          ? 'bg-red-500 text-white'
          : 'bg-gray-800 text-white'
      }`}
    >
      {component.message}
    </div>
  );
} 
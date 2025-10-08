import { useState, useEffect } from 'react';
import { NotificationData } from '@/lib/types';

export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Buscar notificações
  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.filter((n: NotificationData) => !n.read).length || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          notificationId
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Adicionar nova notificação
  const addNotification = async (type: NotificationData['type'], message: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          message
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(prev => [data.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erro ao adicionar notificação:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling para verificar novas notificações a cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    addNotification
  };
};
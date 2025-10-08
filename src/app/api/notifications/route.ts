import { NextRequest, NextResponse } from 'next/server';

// Simulação de banco de dados de notificações
const notifications = new Map<string, any[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userNotifications = notifications.get(userId) || [];
    
    return NextResponse.json({
      notifications: userNotifications,
      count: userNotifications.length
    });

  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, message } = body;
    
    if (!userId || !type || !message) {
      return NextResponse.json(
        { error: 'userId, type and message are required' },
        { status: 400 }
      );
    }

    const notification = {
      id: Date.now().toString(),
      userId,
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    const userNotifications = notifications.get(userId) || [];
    userNotifications.unshift(notification);
    
    // Manter apenas as últimas 50 notificações
    if (userNotifications.length > 50) {
      userNotifications.splice(50);
    }
    
    notifications.set(userId, userNotifications);

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Marcar notificação como lida
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationId } = body;
    
    if (!userId || !notificationId) {
      return NextResponse.json(
        { error: 'userId and notificationId are required' },
        { status: 400 }
      );
    }

    const userNotifications = notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      notifications.set(userId, userNotifications);
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
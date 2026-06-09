const API_BASE_URL = '/api';
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || 'default-eval-key';

export interface Notification {
  id: number;
  message: string;
  severity: 'info' | 'warn' | 'error' | 'success';
  createdAt: string;
  viewed?: boolean;
}

export async function getNotifications(
  limit?: number,
  page?: number,
  notificationType?: string
): Promise<{ notifications: Notification[]; total?: number }> {
  try {
    const url = new URL(`${API_BASE_URL}/notifications`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    if (limit) url.searchParams.append('limit', limit.toString());
    if (page) url.searchParams.append('page', page.toString());
    if (notificationType) url.searchParams.append('notification_type', notificationType);

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return { notifications: [] };
  }
}

export async function getPriorityNotifications(limit: number = 5): Promise<Notification[]> {
  try {
    const url = new URL(`${API_BASE_URL}/notifications`, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Failed to fetch priority notifications:', error);
    return [];
  }
}

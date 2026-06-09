import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4100';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const notificationType = searchParams.get('notification_type');

    const backendUrl = new URL(`${BACKEND_URL}/notifications`);
    if (limit) backendUrl.searchParams.append('limit', limit);
    if (page) backendUrl.searchParams.append('page', page);
    if (notificationType) backendUrl.searchParams.append('notification_type', notificationType);

    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: String(error) },
      { status: 500 }
    );
  }
}

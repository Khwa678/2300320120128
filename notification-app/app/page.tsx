'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import NotificationList from '@/app/components/NotificationList';
import NotificationFilter from '@/app/components/NotificationFilter';
import { getNotifications, Notification } from '@/app/lib/api';

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);
        const result = await getNotifications(undefined, undefined, filter);
        setNotifications(result.notifications || []);
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [filter]);

  const notificationCounts = {
    info: notifications.filter((n) => n.severity === 'info').length,
    warn: notifications.filter((n) => n.severity === 'warn').length,
    error: notifications.filter((n) => n.severity === 'error').length,
    success: notifications.filter((n) => n.severity === 'success').length,
  };

  const filteredNotifications = filter
    ? notifications.filter((n) => n.severity === filter)
    : notifications;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        All Notifications
      </Typography>

      <NotificationFilter
        onFilterChange={setFilter}
        selectedFilter={filter}
        notificationCounts={notificationCounts}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          title={filter ? `${filter.toUpperCase()} Notifications` : 'All Notifications'}
          showViewedStatus
        />
      )}
    </Box>
  );
}

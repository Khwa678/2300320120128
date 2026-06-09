'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Slider, Stack } from '@mui/material';
import NotificationList from '@/app/components/NotificationList';
import { getPriorityNotifications, Notification } from '@/app/lib/api';

export default function PriorityPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        setError(null);
        const result = await getPriorityNotifications(limit);
        setNotifications(result || []);
      } catch (err) {
        setError('Failed to load priority notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [limit]);

  const handleLimitChange = (_event: Event, newValue: number | number[]) => {
    setLimit(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Priority Notifications
      </Typography>

      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Show Top {limit} Notifications
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={limit}
                onChange={handleLimitChange}
                min={1}
                max={20}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{ maxWidth: 400 }}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList
          notifications={notifications}
          title={`Top ${Math.min(limit, notifications.length)} Priority Notifications`}
          showViewedStatus
          maxItems={limit}
        />
      )}
    </Box>
  );
}

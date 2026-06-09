'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import { Notification } from '@/app/lib/api';

interface NotificationListProps {
  notifications: Notification[];
  title: string;
  showViewedStatus?: boolean;
  maxItems?: number;
}

const severityColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  info: 'info',
  warn: 'warning',
  error: 'error',
  success: 'success',
};

export default function NotificationList({
  notifications,
  title,
  showViewedStatus = true,
  maxItems,
}: NotificationListProps) {
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());

  const handleMarkAsRead = (id: number) => {
    setViewedIds((prev) => new Set(prev).add(id));
  };

  const displayNotifications = maxItems ? notifications.slice(0, maxItems) : notifications;

  if (displayNotifications.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
        <Typography variant="body1" color="textSecondary">
          No {title.toLowerCase()} at this time.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
        {maxItems && (
          <Typography variant="caption" sx={{ ml: 1, color: 'textSecondary' }}>
            (Top {Math.min(maxItems, displayNotifications.length)} of {notifications.length})
          </Typography>
        )}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {displayNotifications.map((notification) => {
          const isViewed = viewedIds.has(notification.id);
          return (
            <Box key={notification.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: isViewed ? 0.7 : 1,
                  backgroundColor: isViewed ? '#fafafa' : '#fff',
                  border: !isViewed ? '2px solid #e3f2fd' : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <Chip
                      label={notification.severity.toUpperCase()}
                      color={severityColors[notification.severity]}
                      variant="outlined"
                      size="small"
                    />
                    {showViewedStatus && (
                      <Chip
                        label={isViewed ? 'Viewed' : 'New'}
                        variant={isViewed ? 'outlined' : 'filled'}
                        color={isViewed ? 'default' : 'primary'}
                        size="small"
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: isViewed ? 400 : 600,
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </Typography>

                  <Typography variant="caption" color="textSecondary">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </CardContent>

                {showViewedStatus && !isViewed && (
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleMarkAsRead(notification.id)}
                      fullWidth
                    >
                      Mark as Read
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

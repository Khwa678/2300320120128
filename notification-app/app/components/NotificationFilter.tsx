'use client';

import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Chip,
  Stack,
} from '@mui/material';

interface NotificationFilterProps {
  onFilterChange: (type?: string) => void;
  selectedFilter?: string;
  notificationCounts?: { [key: string]: number };
}

export default function NotificationFilter({
  onFilterChange,
  selectedFilter,
  notificationCounts = {},
}: NotificationFilterProps) {
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value === 'all' ? undefined : event.target.value;
    onFilterChange(value);
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Stack spacing={2}>
        <Box>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
            Filter by Type
          </h3>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="filter-select-label">Notification Type</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              value={selectedFilter || 'all'}
              label="Notification Type"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Notifications</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warn">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="success">Success</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {Object.keys(notificationCounts).length > 0 && (
          <Box>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
              Counts
            </h3>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(notificationCounts).map(([type, count]) => (
                <Chip
                  key={type}
                  label={`${type}: ${count}`}
                  color={type === selectedFilter ? 'primary' : 'default'}
                  variant={type === selectedFilter ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

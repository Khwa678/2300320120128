import type { Metadata } from "next";
import { Box, Container, AppBar, Toolbar, Button, Typography, Stack } from "@mui/material";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notification System",
  description: "Responsive React/Next.js notification management app with Material UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
            <Toolbar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  Notification System
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  color="inherit"
                  href="/"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  All Notifications
                </Button>
                <Button
                  color="inherit"
                  href="/priority"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Priority
                </Button>
              </Stack>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
            {children}
          </Container>

          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: "auto",
              bgcolor: "#f5f5f5",
              borderTop: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              © 2025 Notification System. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </body>
    </html>
  );
}

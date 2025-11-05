import { ChakraProvider } from "@chakra-ui/react";

import { AuthProvider } from "./lib/contexts/AuthContext";
import { theme } from "./theme";
import { ThemeProvider } from "./contexts/ThemeContext";

import { PageTransition } from "./components/PageTransition";

import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <ThemeProvider>
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </ThemeProvider>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;

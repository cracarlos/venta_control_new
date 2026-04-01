import { ThemeProvider } from "@/components/ui/layouts/ThemeProvider"
import { RoutesApp } from "./routes/RoutesApp";
import { TasaProvider } from "./hooks/useTasa";

function App() {

  return (
      <ThemeProvider>
        <TasaProvider>
          <RoutesApp/>
        </TasaProvider>
      </ThemeProvider>

  )
}

export default App

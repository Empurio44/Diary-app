import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { StatsProvider } from "./store/StatsContext";
import Dashboard from "./pages/Dashboard";
import Counters from "./pages/Counters";
import Habits from "./pages/Habits";
import Logs from "./pages/Logs";
import Diary from "./pages/Diary";

export default function App() {
  return (
    <StatsProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="counters" element={<Counters />} />
            <Route path="habits" element={<Habits />} />
            <Route path="logs" element={<Logs />} />
            <Route path="diary" element={<Diary />} />
          </Route>
        </Routes>
      </HashRouter>
    </StatsProvider>
  );
}

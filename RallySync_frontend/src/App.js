import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import useAuthContext from "./contexts/AuthContext";
import VendegLayout from "./layouts/VendegLayout";
import Kezdolap from "./pages/Vendeg/Kezdolap";
import Kapcsolat from "./pages/Vendeg/Kapcsolat";
import Galeria from "./pages/Vendeg/Galeria";
import VersenyzoLayout from "./layouts/VersenyzoLayout";
import SzervezoLayout from "./layouts/SzervezoLayout";
import AdminLayout from "./layouts/AdminLayout";
import Bejelentkezes from "./pages/Bejelentkezes";
import Regisztracio from "./pages/Regisztracio";
import Versenyek from "./pages/Vendeg/Versenyek";
import SzVersenyek from "./pages/Szervezo/SzVersenyek";
import Szervezes from "./pages/Szervezo/Szervezes";
import Profil from "./pages/Profil";
import AKezdolap from "./pages/Admin/AKezdolap";
import RaceCars from "./pages/Admin/RaceCars";
import Categories from "./pages/Admin/Categories";
import Competitions from "./pages/Admin/Competitions";
import Places from "./pages/Admin/Places";
import AProfil from "./pages/Admin/AProfil";
import Brandtype from "./pages/Admin/Brandtype";
import Status from "./pages/Admin/Status";


function AppRoutes() {
    const { user } = useAuthContext();

    return (
        <Routes>
            {/* VENDEG */}
            {!user && (
                <Route path="/" element={<VendegLayout />}>
                    <Route index element={<Kezdolap />} />
                    <Route path="versenyek" element={<Versenyek />} />
                    <Route path="galeria" element={<Galeria />} />
                    <Route path="kapcsolat" element={<Kapcsolat />} />
                    <Route path="bejelentkezes" element={<Bejelentkezes />} />
                    <Route path="regisztracio" element={<Regisztracio />} />
                </Route>
            )}

            {/* VERSENYZO */}
            {user && user.permission === 1 && (
                <Route path="/" element={<VersenyzoLayout />}>
                </Route>
            )}

            {/* SZERVEZO */}
            {user && user.permission === 2 && (
                <Route path="/" element={<SzervezoLayout />}>
                </Route>
            )}

            {/* ADMIN */}
            {user && user.permission === 3 && (
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<AKezdolap />} />
                    <Route path="profil" element={<AProfil />} />
                    <Route path="versenyautok" element={<RaceCars />} />
                    <Route path="kategoriak" element={<Categories />} />
                    <Route path="versenyek" element={<Competitions />} />
                    <Route path="helyszinek" element={<Places />} />
                    <Route path="markatipus" element={<Brandtype />} />
                    <Route path="status" element={<Status />} />
                </Route>
            )}

            {/* BEJELENTKEZVE PERMISSION NELKUL */}
            {user && !user.permission && (
                <Route path="/" element={<VendegLayout />}>
                    <Route index element={<Kezdolap />} />
                    <Route path="versenyek" element={<Versenyek />} />
                    <Route path="galeria" element={<Galeria />} />
                    <Route path="kapcsolat" element={<Kapcsolat />} />
                    <Route path="profil" element={<Profil />} />
                </Route>
            )}
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

/* function szervezoRoutek(){
        return(
            <Routes>
                <Route path="versenyeim" element={<Versenyek />} />
                <Route path="szervezes" element={<Galeria />} />
                <Route path="profilAdatok" element={<Kapcsolat />} />
            </Routes>
        );
} */

export default App;
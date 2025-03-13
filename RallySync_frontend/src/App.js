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


function AppRoutes() {
    const { user } = useAuthContext();

    return (
        <Routes>
            {/* Vendég layout */}
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
            {/* {user && user.permission === 1 ? (
                <Route path="/" element={<VersenyzoLayout />}>
                    <Route index element={<Kezdolap />} />
                    <Route path="versenyeim" element={<Versenyeim />} />
                    <Route path="regisztracio" element={<Regisztracio />} />
                </Route>
            ) : ""} */}

            {user && user.permission === 2 ? (
                <Route path="/" element={<SzervezoLayout />}>
                    <Route index element={<Kezdolap />} />
                    <Route path="versenyeim" element={<SzVersenyek />} />
                    <Route path="szervezes" element={<Szervezes />} />
                    <Route path="Profil" element={<Profil />} />
                </Route>
            ) : ""}
            {/* Admin és User ugyanazon útvonalon */}
            {user && (
                <Route path="/" element={
                    user.permission === 1 ?
                        (<VersenyzoLayout />)
                        : user.permission === 2 ? (
                            <SzervezoLayout />)
                            : user.permission === 3 ? (
                                <AdminLayout />)
                                : <VersenyzoLayout />}>
                    <Route index element={<Kezdolap />} />
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

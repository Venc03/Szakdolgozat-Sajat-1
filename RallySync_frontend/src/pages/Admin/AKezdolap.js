import useAuthContext from "../../contexts/AuthContext";

export default function AKezdolap() {
      const { user } = useAuthContext();

    return (
        <div className="container mt-5">
            <h1>Üdvözöljuk kedves: {user === null ? "Nincs bejelentkezett felhasználó!" : user.name}</h1>
            <p>
                Jo munkát
            </p>
        </div>
    );
}
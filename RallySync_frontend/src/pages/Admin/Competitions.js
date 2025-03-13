import useAuthContext from "../../contexts/AuthContext";

export default function Competitions() {
      const { user } = useAuthContext();

    return (
        <div className="container mt-5">
            <h1>Competitions</h1>

        </div>
    );
}
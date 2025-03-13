import useAuthContext from "../../contexts/AuthContext";

export default function RaceCars() {
      const { user } = useAuthContext();

    return (
        <div className="container mt-5">
            <h1>RaceCars</h1>
        </div>
    );
}
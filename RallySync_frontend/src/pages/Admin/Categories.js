import useAuthContext from "../../contexts/AuthContext";

export default function Categories() {
      const { user } = useAuthContext();

    return (
        <div className="container mt-5">
            <h1>Categories</h1>
        </div>
    );
}
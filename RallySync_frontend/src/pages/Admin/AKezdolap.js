import useAuthContext from "../../contexts/AuthContext";

export default function AKezdolap() {
      const { user } = useAuthContext();

    return (
        <div className="container mt-5">
            <h1>Üdvözöljuk kedves: {user === null ? "Nincs bejelentkezett felhasználó!" : user.name}</h1>
            <p>
                Jo munkát
            </p>
            <video width="600" controls autoPlay muted loop playsInline>
              <source src="/videos/rallyvid1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        </div>
    );
}
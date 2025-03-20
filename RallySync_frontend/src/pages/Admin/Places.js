import React, { useContext, useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { getCsrfToken, myAxios } from '../../api/myAxios';
import APIContext from '../../contexts/APIContext';

export default function Places() {
    const { helyszinLista, getHelyszin } = useContext(APIContext);
    const [placeName, setPlaceName] = useState("");
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState({});
    const [loadingModify, setLoadingModify] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        getHelyszin();
    }, [getHelyszin]);

    const handleAdd = async () => {
        if (!placeName.trim()) {
            setError("Place name is required.");
            return;
        }

        const newPlace = { place: placeName.trim() };
        setLoadingAdd(true);
        setError("");

        try {
            await getCsrfToken();
            await myAxios.post('/api/placeCreate', newPlace);
            getHelyszin();
            setPlaceName("");
        } catch (error) {
            console.error("Error adding the place:", error);
            setError(error.response?.data?.message || "There was an error adding the place.");
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this place?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));
            setError("");

            try {
                await getCsrfToken();
                await myAxios.delete(`/api/placeDelete/${id}`);
                getHelyszin();
            } catch (error) {
                console.error("Error deleting the place:", error);
                if (error.response?.data?.message === "An error occurred while deleting the place.") {
                    window.alert("A Pályához van verseny kötve.");
                } else {
                    setError("There was an error deleting the place.");
                }
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    const handleModify = async (id, oldName) => {
        const newName = window.prompt("Enter new place name:", oldName);
        if (!newName || newName.trim() === "") {
            window.alert("The place name cannot be empty.");
            return;
        }

        setLoadingModify(prev => ({ ...prev, [id]: true }));
        setError("");

        try {
            await getCsrfToken();
            await myAxios.patch(`/api/placeModify/${id}`, { place: newName.trim() });
            getHelyszin();
        } catch (error) {
            console.error("Error modifying the place:", error);
            setError("There was an error modifying the place.");
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="container mt-5">
            <div className="container">
                <h1>Pályák</h1>
                <InputGroup className="mb-3" style={{ width: '300px' }}>
                    <FormControl
                        placeholder="New Place Name"
                        aria-label="New Place Name"
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                    />
                </InputGroup>
                <Button variant="warning" onClick={handleAdd} disabled={loadingAdd}>
                    {loadingAdd ? <Spinner animation="border" size="sm" /> : "Pálya hozzáadás"}
                </Button>
            </div>

            <div className="row mt-3">
                {helyszinLista.length > 0 ? (
                    helyszinLista.map((helyszin, index) => (
                        <div className="col-md-4 mb-3" key={helyszin.id || index}>
                            <div className="card">
                                <div className="card-header">
                                    ID: {helyszin.plac_id}
                                </div>
                                <div className="card-body">
                                    <p><strong>Place: </strong> {helyszin.place}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleModify(helyszin.plac_id, helyszin.place)}
                                        disabled={loadingModify[helyszin.plac_id]}
                                    >
                                        {loadingModify[helyszin.plac_id] ? <Spinner animation="border" size="sm" /> : "Módosítás"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(helyszin.plac_id)}
                                        disabled={loadingDelete[helyszin.plac_id]}
                                    >
                                        {loadingDelete[helyszin.plac_id] ? <Spinner animation="border" size="sm" /> : "Törlés"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nem található helyszín!</p>
                )}
            </div>
        </div>
    );
}

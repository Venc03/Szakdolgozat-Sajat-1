import React, { useContext, useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { APIContext } from '../../contexts/APIContext'; // Assuming APIContext is imported correctly
import { getCsrfToken, myAxios } from '../../api/myAxios';

export default function Brandtype() {
    const { brandtypeLista, getBrandtype } = useContext(APIContext); 
    const [brandtypeName, setBrandtypeName] = useState(""); 
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState({});
    const [loadingModify, setLoadingModify] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        getBrandtype(); 
    }, [getBrandtype]);

    const handleAdd = async () => {
        if (!brandtypeName.trim()) {
            setError("Brandtype name is required.");
            return;
        }

        const newBrandtype = { brandtype: brandtypeName.trim() };
        setLoadingAdd(true);
        setError("");

        try {
            await getCsrfToken();
            await myAxios.post('/api/brandtypeCreate', newBrandtype);
            setBrandtypeName(""); 
            getBrandtype(); 
        } catch (error) {
            console.error("Error adding the brandtype:", error);
            setError(error.response?.data?.message || "There was an error adding the brandtype.");
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this brandtype?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));
            setError("");

            try {
                await getCsrfToken();
                await myAxios.delete(`/api/brandtypeDelete/${id}`); 
                getBrandtype();
            } catch (error) {
                console.error("Error deleting the brandtype:", error);
                setError("There was an error deleting the brandtype.");
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    const handleModify = async (id, oldName) => {
        const newName = window.prompt("Enter new brandtype name:", oldName);
        if (!newName || newName.trim() === "") {
            window.alert("The brandtype name cannot be empty.");
            return;
        }

        setLoadingModify(prev => ({ ...prev, [id]: true }));
        setError("");

        try {
            await getCsrfToken();
            await myAxios.patch(`/api/brandtypeModify/${id}`, { brandtype: newName.trim() }); 
            getBrandtype(); 
            console.log(newName);
        } catch (error) {
            console.error("Error modifying the brandtype:", error);
            setError("There was an error modifying the brandtype.");
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="container mt-5">
            <div className="container">
                <h1>Brandtypes</h1>
                <InputGroup className="mb-3" style={{ width: '300px' }}>
                    <FormControl
                        placeholder="New Brandtype Name"
                        aria-label="New Brandtype Name"
                        value={brandtypeName} 
                        onChange={(e) => setBrandtypeName(e.target.value)}
                    />
                </InputGroup>
                <Button variant="warning" onClick={handleAdd} disabled={loadingAdd}>
                    {loadingAdd ? <Spinner animation="border" size="sm" /> : "Add Brandtype"}
                </Button>
            </div>

            <div className="row mt-3">
                {Array.isArray(brandtypeLista) && brandtypeLista.length > 0 ? (
                    brandtypeLista.map((brandtype, index) => (
                        <div className="col-md-4 mb-3" key={brandtype.bt_id || index}>
                            <div className="card">
                                <div className="card-header">
                                    {brandtype.bt_id}
                                </div>
                                <div className="card-body">
                                    <p><strong>Brandtype: </strong> {brandtype.brandtype}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleModify(brandtype.bt_id, brandtype.brandtype)}
                                        disabled={loadingModify[brandtype.bt_id]}
                                    >
                                        {loadingModify[brandtype.bt_id] ? <Spinner animation="border" size="sm" /> : "Modify"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(brandtype.bt_id)}
                                        disabled={loadingDelete[brandtype.bt_id]}
                                    >
                                        {loadingDelete[brandtype.bt_id] ? <Spinner animation="border" size="sm" /> : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No brandtypes found!</p>
                )}
            </div>
        </div>
    );
}

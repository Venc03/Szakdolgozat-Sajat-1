import React, { useContext, useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { APIContext } from '../../contexts/APIContext';
import { getCsrfToken, myAxios } from '../../api/myAxios';

export default function Status() {
    const { statusLista, getStatus } = useContext(APIContext); 
    const [statusName, setStatusName] = useState(""); 
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState({});
    const [loadingModify, setLoadingModify] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        getStatus(); 
    }, [getStatus]);

    const handleAdd = async () => { 
        if (!statusName.trim()) {
            setError("Status name is required.");
            return;
        }

        const newStatus = { statsus: statusName.trim() }; 
        setLoadingAdd(true);
        setError("");

        try {
            await getCsrfToken();
            await myAxios.post('/api/statusCreate', newStatus); 
            setStatusName(""); 
            getStatus(); 
        } catch (error) {
            console.error("Error adding the status:", error);
            setError(error.response?.data?.message || "There was an error adding the status.");
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this status?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));
            setError("");

            try {
                await getCsrfToken();
                await myAxios.delete(`/api/statusDelete/${id}`); 
                getStatus();
            } catch (error) {
                console.error("Error deleting the status:", error);
                setError("There was an error deleting the status.");
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    const handleModify = async (id, oldName) => {
        const newName = window.prompt("Enter new status name:", oldName);
        if (!newName || newName.trim() === "") {
            window.alert("The status name cannot be empty.");
            return;
        }
    
        setLoadingModify(prev => ({ ...prev, [id]: true }));
        setError("");
    
        try {
            await getCsrfToken();
            await myAxios.patch(`/api/statusModify/${id}`, { statsus: newName.trim() }); 
            getStatus(); 
        } catch (error) {
            console.error("Error modifying the status:", error.response?.data?.message);
            setError("There was an error modifying the status.");
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="container mt-5">
            <div className="container">
                <h1>Státuszok</h1>
                <InputGroup className="mb-3" style={{ width: '300px' }}>
                    <FormControl
                        placeholder="New Status Name"
                        aria-label="New Status Name"
                        value={statusName} 
                        onChange={(e) => setStatusName(e.target.value)} 
                    />
                </InputGroup>
                <Button variant="warning" onClick={handleAdd} disabled={loadingAdd}>
                    {loadingAdd ? <Spinner animation="border" size="sm" /> : "Status hozzáadása"}
                </Button>
            </div>

            <div className="row mt-3">
                {Array.isArray(statusLista) && statusLista.length > 0 ? (
                    statusLista.map((status, index) => (
                        <div className="col-md-4 mb-3" key={status.stat_id || index}>
                            <div className="card">
                                <div className="card-header">
                                    {status.stat_id}
                                </div>
                                <div className="card-body">
                                    <p><strong>Status: </strong> {status.statsus}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleModify(status.stat_id, status.statsus)} 
                                        disabled={loadingModify[status.stat_id]}
                                    >
                                        {loadingModify[status.stat_id] ? <Spinner animation="border" size="sm" /> : "Módosítás"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(status.stat_id)} 
                                        disabled={loadingDelete[status.stat_id]}
                                    >
                                        {loadingDelete[status.stat_id] ? <Spinner animation="border" size="sm" /> : "Törlés"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nem található státusz!</p> 
                )}
            </div>
        </div>
    );
}

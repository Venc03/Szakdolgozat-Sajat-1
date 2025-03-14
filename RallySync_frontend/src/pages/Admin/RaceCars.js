import React, { useContext, useState } from 'react';
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import APIContext from '../../contexts/APIContext';
import { myAxios } from '../../api/myAxios';

export default function RaceCars() {
    const { carList, getCars } = useContext(APIContext);
    const [carName, setCarName] = useState("");
    const [categName, setCategName] = useState("");
    const [statusName, setStatusName] = useState("");
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState({});

    // Handle Add Car
    const handleAdd = async () => {
        if (!carName.trim()) {
            alert("Car name is required.");
            return;
        }

        const newCar = { brandtype: carName.trim() };
        const newCateg = { category: categName.trim() };
        const newStatus = { status: statusName.trim() };
        setLoadingAdd(true);

        try {
            await myAxios.post('/api/carCreate', newCar, newCateg, newStatus);
            getCars();
            setCarName("");
            setCategName("");
            setStatusName("");
        } catch (error) {
            console.error("Error adding car:", error);
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));

            try {
                await myAxios.delete(`/api/carDelete/${id}`);
                getCars();
            } catch (error) {
                console.error("Error deleting the car:", error);
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1>Kocsik</h1>
            <InputGroup className="mb-3" style={{ width: '300px' }}>
                <FormControl
                    placeholder="New Car Name"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                />
            </InputGroup>
            <Button variant="warning" onClick={handleAdd} disabled={loadingAdd}>
                {loadingAdd ? <Spinner animation="border" size="sm" /> : "Add Car"}
            </Button>

            <div className="row mt-3">
                {carList && carList.length > 0 ? (
                    carList.map((car, index) => (
                        <div key={car.cid || index} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-header">{car.brandtype}</div>
                                <div className="card-body">
                                    <p><strong>Category: </strong> {car.category}</p>
                                    <p><strong>Status: </strong> {car.status}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button variant="primary" onClick={() => {}}>
                                        Modify
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(car.cid)}
                                        disabled={loadingDelete[car.cid]}
                                    >
                                        {loadingDelete[car.cid] ? <Spinner animation="border" size="sm" /> : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No cars found!</p>
                )}
            </div>
        </div>
    );
}

import React, { useContext, useState, useEffect } from 'react';
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
    const [loadingModify, setLoadingModify] = useState({});

    useEffect(() => {
        getCars();
    }, [getCars]);

    const handleAdd = async () => {
        if (!carName.trim() || !categName.trim() || !statusName.trim()) {
            alert("everything is required.");
            return;
        }
    
        setLoadingAdd(true);
    
        try {
            await myAxios.post('/api/carCreate', {
                brandtype: carName.trim(),
                category: categName.trim(),
                status: statusName.trim(), 
            });
            getCars();
            setCarName("");
            setCategName("");
            setStatusName("");
        } catch (error) {
            console.error("Error response:", error.response?.data);
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

    const handleModify = async (id, oldBrandId, oldCategoryId, oldStatusId) => {
        const newBrandId = window.prompt("Enter new brand ID (current: " + oldBrandId + "):", oldBrandId);
        const newCategoryId = window.prompt("Enter new category ID (current: " + oldCategoryId + "):", oldCategoryId);
        const newStatusId = window.prompt("Enter new status ID (current: " + oldStatusId + "):", oldStatusId);
    
        if (!newBrandId.trim() || !newCategoryId.trim() || !newStatusId.trim()) {
            alert("Brand, Category, and Status cannot be empty.");
            return;
        }
    
        setLoadingModify(prev => ({ ...prev, [id]: true }));
    
        try {
            await myAxios.patch(`/api/carModify/${id}`, {
                brandtype: newBrandId.trim(),
                category: newCategoryId.trim(),
                statsus: newStatusId.trim(),
            });
            console.log({
                brandtype: newBrandId.trim(),
                category: newCategoryId.trim(),
                statsus: newStatusId.trim(),
            });
            getCars();
        } catch (error) {
            console.error("Error modifying the car:", error);
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="container mt-5">
            <h1>Kocsik</h1>
            <InputGroup className="mb-3" style={{ width: '300px' }}>
                <div>
                    <FormControl
                        placeholder="New Car Name"
                        value={carName}
                        onChange={(e) => setCarName(e.target.value)}
                    />
                </div>
                <div>
                    <FormControl
                        placeholder="New Category Name"
                        value={categName}
                        onChange={(e) => setCategName(e.target.value)}
                    />
                </div>
                <div>
                    <FormControl
                        placeholder="New Status Name"
                        value={statusName}
                        onChange={(e) => setStatusName(e.target.value)}
                    />
                </div>
            </InputGroup>
            <Button variant="warning" onClick={handleAdd} disabled={loadingAdd}>
                {loadingAdd ? <Spinner animation="border" size="sm" /> : "Add Car"}
            </Button>

            <div className="row mt-3">
            {carList && carList.length > 0 ? (
                carList.map((car, index) => (
                    <div key={car.cid || index} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-header">{car.cid}</div>
                            <div className="card-body">
                                <p><strong>Brand: </strong> {car.brandtype}</p>
                                <p><strong>Category: </strong> {car.category}</p>
                                <p><strong>Status: </strong> {car.statsus}</p>
                            </div>
                            <div className="card-body d-flex justify-content-between">
                                <Button
                                    variant="primary"
                                    onClick={() => handleModify(car.cid, car.btid, car.categ_id, car.stat_id)} 
                                    disabled={loadingModify[car.cid]}
                                >
                                    {loadingModify[car.cid] ? <Spinner animation="border" size="sm" /> : "Modify"}
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

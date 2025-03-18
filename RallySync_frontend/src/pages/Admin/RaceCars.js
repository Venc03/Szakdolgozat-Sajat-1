import React, { useContext, useState, useEffect } from "react";
import { Button, InputGroup, FormControl, Spinner, Form } from "react-bootstrap";
import APIContext from "../../contexts/APIContext";
import { myAxios } from "../../api/myAxios";

export default function RaceCars() {
    const { carList, getCars } = useContext(APIContext);
    const [selectedID, setSelectedID] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortCriteria, setSortCriteria] = useState("ID");
    const [loadingAdd, setLoadingAdd] = useState(false); // Loading state for add
    const [loadingDelete, setLoadingDelete] = useState({}); // Loading state for delete
    const [loadingModify, setLoadingModify] = useState({}); // Loading state for modify
    const [carName, setCarName] = useState(""); // Car name state
    const [categName, setCategName] = useState(""); // Category name state
    const [statusName, setStatusName] = useState(""); // Status name state

    useEffect(() => {
        getCars();
    }, [getCars]);

    const filteredCars = carList.filter(car =>
        (selectedID === "All" || car.cid === selectedID) &&
        (selectedBrand === "All" || car.brandtype === selectedBrand) &&
        (selectedCategory === "All" || car.category === selectedCategory) &&
        (selectedStatus === "All" || car.statsus === selectedStatus) 
    );

    // Sorting function
    const sortedCars = filteredCars.sort((a, b) => {
        if (sortCriteria === "ID") {
            return a.cid - b.cid;
        } else if (sortCriteria === "Márka") {
            return a.brandtype.localeCompare(b.brandtype);
        }
        return 0;
    });

    // Handle Add Car
    const handleAdd = async () => {
        if (!carName.trim()) {
            alert("Car name is required.");
            return;
        }

        const newCar = { brandtype: carName.trim(), category: categName.trim(), status: statusName.trim() };
        setLoadingAdd(true);

        try {
            await myAxios.post('/api/carCreate', newCar); 
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

    // Handle Delete Car
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));

            try {
                await myAxios.delete(`/api/carDelete/${id}`); // Corrected delete URL
                getCars();
            } catch (error) {
                console.error("Error deleting the car:", error);
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    // Handle Modify Car
    const handleModify = async (id, oldBrandId, oldCategoryId, oldStatusId) => {
        const newBrand = window.prompt("Enter new brand (current: " + oldBrandId + "):", oldBrandId);
        const newCategory = window.prompt("Enter new category (current: " + oldCategoryId + "):", oldCategoryId);
        const newStatus = window.prompt("Enter new status (current: " + oldStatusId + "):", oldStatusId);
    
        if (!newBrand.trim() || !newCategory.trim() || !newStatus.trim()) {
            alert("Brand, Category, and Status cannot be empty.");
            return;
        }

        setLoadingModify(prev => ({ ...prev, [id]: true }));
     
        try {
            await myAxios.patch(`/api/carModify/${id}`, {
                brandtype: newBrand.trim(),
                category: newCategory.trim(),
                statsus: newStatus.trim(),
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
            <h1>Versenyautók</h1>

            {/* Add Car Form */}
            <div className="mt-4">
                <h3>Új autó hozzáadása</h3>
                <InputGroup className="mb-3">
                    <FormControl 
                        placeholder="Márka" 
                        value={carName} 
                        onChange={e => setCarName(e.target.value)} 
                    />
                    <FormControl 
                        placeholder="Kategória" 
                        value={categName} 
                        onChange={e => setCategName(e.target.value)} 
                    />
                    <FormControl 
                        placeholder="Státusz" 
                        value={statusName} 
                        onChange={e => setStatusName(e.target.value)} 
                    />
                    <Button 
                        variant="warning" 
                        onClick={handleAdd} 
                        disabled={loadingAdd}>
                        {loadingAdd ? <Spinner as="span" animation="border" size="sm" /> : 'Hozzáadás'}
                    </Button>
                </InputGroup>
            </div>
            
            {/* Filtering Options */}
            <div className="mb-3 d-flex gap-2">
                {/* Sort Dropdown */}
                <Form.Select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
                    <option value="ID">ID szerint</option>
                    <option value="Márka">Márka szerint</option>
                </Form.Select>

                {/* Category dropdown */}
                <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="All">Kategória szűrő</option>
                    {[...new Set(carList.map(car => car.category))].map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </Form.Select>

                {/* Status dropdown */}
                <Form.Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                    <option value="All">Státusz szűrő</option>
                    {[...new Set(carList.map(car => car.statsus))].map(statsus => (
                        <option key={statsus} value={statsus}>{statsus}</option>
                    ))}
                </Form.Select>
            </div>

            {/* Car List */}
            <div className="row mt-3">
                {sortedCars.length > 0 ? (
                    sortedCars.map((car, index) => (
                        <div key={car.cid || index} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-header">ID: {car.cid}</div>
                                <div className="card-body">
                                    <p><strong>Márka: </strong> {car.brandtype}</p>
                                    <p><strong>Kategória: </strong> {car.category}</p>
                                    <p><strong>Státusz: </strong> {car.statsus}</p>
                                    
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleModify(car.cid, car.btid, car.categid, car.statid)} 
                                        disabled={loadingModify[car.cid]}>
                                        {loadingModify[car.cid] ? <Spinner as="span" animation="border" size="sm" /> : 'Módosítás'}
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleDelete(car.cid)} 
                                        disabled={loadingDelete[car.cid]}>
                                        {loadingDelete[car.cid] ? <Spinner as="span" animation="border" size="sm" /> : 'Törlés'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nincs található autó!</p>
                )}
            </div>
        </div>
    );
}

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
    const [sortCriteria, setSortCriteria] = useState("ID"); // Add a state for sorting criteria

    useEffect(() => {
        getCars();
    }, [getCars]);

    const filteredCars = carList.filter(car => 
        (selectedID === "All" || car.cid === selectedID) &&
        (selectedBrand === "All" || car.brandtype === selectedBrand) &&
        (selectedCategory === "All" || car.category === selectedCategory) &&
        (selectedStatus === "All" || car.statsus === selectedStatus)
    );

    // Function to handle sorting of the filtered car list based on selected criteria
    const sortedCars = filteredCars.sort((a, b) => {
        if (sortCriteria === "ID") {
            return a.cid - b.cid;  // Sort numerically by ID
        } else if (sortCriteria === "Márka") {
            return a.brandtype.localeCompare(b.brandtype);  // Sort alphabetically by brand
        }
        return 0;
    });

    return (
        <div className="container mt-5">
            <h1>Versenyautók</h1>
            
            {/* Filtering Options */}
            <div className="mb-3 d-flex gap-2">
                {/* Sort Dropdown */}
                <Form.Select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
                    <option value="ID">ID szerint</option>
                    <option value="Márka">Márka szerint</option>
                </Form.Select>

                {/* Category dropdown */}
                <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="All">Kategória szürő</option>
                    {[...new Set(carList.map(car => car.category))].map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </Form.Select>

                {/* Status dropdown */}
                <Form.Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                    <option value="All">Státusz szürő</option>
                    {[...new Set(carList.map(car => car.statsus))].map(status => (
                        <option key={status} value={status}>{status}</option>
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

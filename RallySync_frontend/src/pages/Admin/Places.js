import React, { useContext, useState, useEffect } from 'react';
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { myAxios } from '../../api/myAxios'; // Assuming this axios instance is correctly set up
import APIContext from '../../contexts/APIContext'; // Path to your APIContext

export default function Places() {
    const { helyszinLista, getHelyszin } = useContext(APIContext); // Access API context
    const [placeName, setPlaceName] = useState(""); // Define the state for the input field

    // Fetch places on component mount
    useEffect(() => {
        getHelyszin(); 
    }, [getHelyszin]); // Add getHelyszin to dependency array

    // Function to handle deleting a place
    const handleDelete = async (id) => {
        try {
            await myAxios.delete(`/placeDelete/${id}`); // Send DELETE request to the API
            getHelyszin(); // Refresh places list after deletion
        } catch (error) {
            console.error("Error deleting the place:", error);
        }
    };

    // Function to handle adding a new place
    const handleAdd = async () => {
        const newPlace = { name: placeName }; // Create an object with the new place data

        try {
            const response = await myAxios.post('/api/placeCreate', newPlace); // Assuming your backend is expecting this
            getHelyszin(); // Refresh places list after successful addition
            setPlaceName(""); // Clear the input field after successful addition
        } catch (error) {
            console.error("Error adding the place:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center"
                 style={{ gridTemplateColumns: "4fr 1fr 1fr" }}>
                <h1>Pályák</h1>
                {/* Input field to add place */}
                <InputGroup className="mb-3" style={{ width: '300px' }}>
                    <FormControl
                        placeholder="New Place Name"
                        aria-label="New Place Name"
                        value={placeName} // Bind input field to placeName
                        onChange={(e) => setPlaceName(e.target.value)} // Update placeName on input change
                    />
                </InputGroup>
                <Button variant="warning" onClick={handleAdd}>Pálya hozzáadás</Button>
            </div>
            <div className="row mt-3">
                {/* If places exist, display them */}
                {helyszinLista.length > 0 ? (
                    helyszinLista.map((helyszin) => (
                        <div className="col-md-4 mb-3" key={helyszin.id}>
                            <div className="card">
                                <div className="card-header">
                                    {helyszin.name} {/* Display place name */}
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">{helyszin.address}</li> {/* Address */}
                                    <li className="list-group-item">{helyszin.description}</li> {/* Description */}
                                </ul>
                                {/* Button to delete the place */}
                                <Button variant="danger" onClick={() => handleDelete(helyszin.id)}>
                                    Törlés
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nem található helyszín!</p> // If no places are found, show this message
                )}
            </div>
        </div>
    );
}

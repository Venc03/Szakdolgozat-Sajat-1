import React, { useContext, useState, useEffect } from 'react';
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { getCsrfToken, myAxios } from '../../api/myAxios'; // Assuming this axios instance is correctly set up
import APIContext from '../../contexts/APIContext'; // Path to your APIContext

export default function Places() {
    const { helyszinLista, getHelyszin } = useContext(APIContext); // Access API context
    const [placeName, setPlaceName] = useState(""); // Define the state for the input field

    // Fetch places on component mount
    useEffect(() => {
        getHelyszin(); 
    }, [getHelyszin]); // Add getHelyszin to dependency array
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState(""); // Add error state
    
    const handleAdd = async () => {
        if (!placeName.trim()) {
            setError("Place name is required.");
            return;
        }
    
        const newPlace = { place: placeName.trim() }; 
        setLoading(true);
        setError("");
    
        try {
            await getCsrfToken();
            await myAxios.post('/api/placeCreate', newPlace);  
            getHelyszin();  
            setPlaceName("");  
        } catch (error) {
            console.error("Error adding the place:", error);
            if (error.response) {
                console.error('Response error:', error.response.data);  
                setError(error.response.data.message || "There was an error adding the place.");
            } else {
                setError("There was an error adding the place.");
            }
        } finally {
            setLoading(false); 
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this place?")) {
            setLoading(true);
            setError("");
    
            try {
                await getCsrfToken();
                console.log(id);
                await myAxios.delete(`/api/placeDelete/${id}`);
                getHelyszin();
            } catch (error) {
                console.error("Error deleting the place:", error);
                setError("There was an error deleting the place.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="container">
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
                    helyszinLista.map((helyszin, index) => (
                        <div className="col-md-4 mb-3" key={helyszin.id || index}> 
                            <div className="card">
                                <div className="card-header">
                                    {helyszin.place}
                                </div>
                                <Button variant="danger" onClick={() => handleDelete(helyszin.plac_id)}>
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

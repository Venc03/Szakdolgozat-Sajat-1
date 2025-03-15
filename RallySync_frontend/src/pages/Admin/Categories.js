    import React, { useContext, useState, useEffect } from 'react';
    import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
    import { APIContext } from '../../contexts/APIContext'; 
    import { getCsrfToken, myAxios } from '../../api/myAxios';

    export default function Categories() {
        const { categLista, getKategoriak } = useContext(APIContext);
        const [categoryName, setCategoryName] = useState(""); 
        const [loadingAdd, setLoadingAdd] = useState(false);
        const [loadingDelete, setLoadingDelete] = useState({});
        const [loadingModify, setLoadingModify] = useState({});
        const [error, setError] = useState("");

        useEffect(() => {
            getKategoriak(); // Only fetching categories
        }, [getKategoriak]);

        const handleAdd = async () => {
            if (!categoryName.trim()) {
                setError("Category name is required.");
                return;
            }

            const newCategory = { category: categoryName.trim() }; // Create a new category object
            setLoadingAdd(true);
            setError("");

            try {
                await getCsrfToken();
                await myAxios.post('/api/categCreate', newCategory); // Creating the new category
                setCategoryName(""); // Reset input after adding category
                getKategoriak(); // Refetch the categories
            } catch (error) {
                console.error("Error adding the category:", error);
                setError(error.response?.data?.message || "There was an error adding the category.");
            } finally {
                setLoadingAdd(false);
            }
        };

        const handleDelete = async (id) => {
            if (window.confirm("Are you sure you want to delete this category?")) {
                setLoadingDelete(prev => ({ ...prev, [id]: true }));
                setError("");

                try {
                    await getCsrfToken();
                    await myAxios.delete(`/api/categDelete/${id}`); // Deleting the category
                    getKategoriak(); // Refetch the categories
                } catch (error) {
                    console.error("Error deleting the category:", error);
                    setError("There was an error deleting the category.");
                } finally {
                    setLoadingDelete(prev => ({ ...prev, [id]: false }));
                }
            }
        };

        const handleModify = async (id, oldName) => {
            const newName = window.prompt("Enter new category name:", oldName);
            if (!newName || newName.trim() === "") {
                window.alert("The category name cannot be empty.");
                return;
            }

            setLoadingModify(prev => ({ ...prev, [id]: true }));
            setError("");

            try {
                await getCsrfToken();
                await myAxios.patch(`/api/categModify/${id}`, { category: newName.trim() }); // Modifying the category
                getKategoriak(); // Refetch the categories
                console.log(newName);
            } catch (error) {
                console.error("Error modifying the category:", error);
                setError("There was an error modifying the category.");
            } finally {
                setLoadingModify(prev => ({ ...prev, [id]: false }));
            }
        };

        return (
            <div className="container mt-5">
                <div className="container">
                    <h1>Kategóriák</h1>
                    <InputGroup className="mb-3" style={{ width: '300px' }}>
                        <FormControl
                            placeholder="New Category Name"
                            aria-label="New Category Name"
                            value={categoryName} // Bind to categoryName state
                            onChange={(e) => setCategoryName(e.target.value)} // Update categoryName on change
                        />
                    </InputGroup>
                    <Button variant="warning" onClick={handleAdd} disabled={loadingAdd}>
                        {loadingAdd ? <Spinner animation="border" size="sm" /> : "Kategória hozzáadása"}
                    </Button>
                </div>

                <div className="row mt-3">
                {Array.isArray(categLista) && categLista.length > 0 ? (
        categLista.map((category, index) => (
            <div className="col-md-4 mb-3" key={category.id || index}>
                <div className="card">
                    <div className="card-header">
                        ID: {category.categ_id}
                    </div>
                    <div className="card-body">
                        <p><strong>Category: </strong> {category.category}</p>
                    </div>
                    <div className="card-body d-flex justify-content-between">
                        <Button
                            variant="primary"
                            onClick={() => handleModify(category.categ_id, category.category)} // Modify category using categ_id
                            disabled={loadingModify[category.categ_id]}
                        >
                            {loadingModify[category.categ_id] ? <Spinner animation="border" size="sm" /> : "Módosítás"}
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(category.categ_id)} // Delete category using categ_id
                            disabled={loadingDelete[category.categ_id]}
                        >
                            {loadingDelete[category.categ_id] ? <Spinner animation="border" size="sm" /> : "Törlés"}
                        </Button>
                    </div>
                </div>
            </div>
        ))
    ) : (
        <p>Nem található kategória!</p> 
    )}

                </div>
            </div>
        );
    }

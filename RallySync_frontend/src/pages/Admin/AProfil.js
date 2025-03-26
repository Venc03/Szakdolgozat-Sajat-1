import React, { useContext, useState } from "react";
import useAuthContext from "../../contexts/AuthContext";
import { Button, Spinner, Form } from "react-bootstrap";
import { getCsrfToken, myAxios } from "../../api/myAxios";
import APIContext from "../../contexts/APIContext";

function AProfil() {
    const { user, setUser } = useAuthContext();
    const { userLista, getUsers } = useContext(APIContext);
    const [loadingModify, setLoadingModify] = useState({});
    const [loadingDelete, setLoadingDelete] = useState({});
    const [error, setError] = useState("");
    const [sortCriteria, setSortCriteria] = useState("ID");
    const [selectedID, setSelectedID] = useState("All");
    const [selectedName, setSelectedName] = useState("All");
    const [selectedPermission, setSelectedPermission] = useState("All");
    const [loadingImage, setLoadingImage] = useState({});

    const handleModify = async (id, oldName) => {
        const newName = window.prompt("Enter new user name:", oldName);
        if (!newName || newName.trim() === "") {
            window.alert("The user name cannot be empty.");
            return;
        }
    
        setLoadingModify(prev => ({ ...prev, [id]: true }));
        setError("");
    
        try {
            await getCsrfToken();
            await myAxios.patch(`/api/userModify/${id}`, { name: newName.trim() });
            getUsers();
    
            if (user.id === id) {
                setUser(prev => ({ ...prev, name: newName.trim() }));
            }
        } catch (error) {
            console.error("Error modifying the username:", error.response?.data?.message);
            setError("There was an error modifying the username.");
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };
    
    const handleAdminModify = async (id, oldName, oldPermission) => {
        const newName = window.prompt("Enter new User name (current: " + oldName + "):", oldName);
        const newPermission = window.prompt("Enter new User permission (current: " + oldPermission + "):", oldPermission);

        if (!newName.trim() || !newPermission.trim()) {
            alert("User and permission cannot be empty.");
            return;
        }

        setLoadingModify(prev => ({ ...prev, [id]: true }));

        try {
            await myAxios.patch(`/api/userAdminModify/${id}`, {
                name: newName.trim(),
                permission: newPermission.trim(),
            });
            getUsers(); 
        } catch (error) {
            console.error("Error modifying the user:", error.response?.data?.message);
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleDelete = async id => {
        if (window.confirm("Are you sure you want to delete this User?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));
            setError("");

            try {
                await getCsrfToken();
                await myAxios.delete(`/api/userDelete/${id}`);
                getUsers(); 
            } catch (error) {
                console.error("Error deleting the User:", error.response?.data?.message);
                setError("There was an error deleting the user.");
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    // Handle Image Upload
        const handleImageUpload = async (Id, file) => {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', Id);
        
            setLoadingImage(prev => ({ ...prev, [Id]: true }));
        
            try {
                const response = await myAxios.post("/api/userUploadImage", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
        
                if (response.data.success) {
                    console.log("Image uploaded successfully:", response.data.image_url);
                    getUsers(); 
                } else {
                    console.error("Image upload failed:", response.data.message);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setLoadingImage(prev => ({ ...prev, [Id]: false }));
            }
        };

    // Filtered and sorted users
    const filteredUsers = userLista.filter(user => 
        (selectedID === "All" || user.id === selectedID) &&
        (selectedName === "All" || user.name.includes(selectedName)) && 
        (selectedPermission === "All" || user.permission === selectedPermission)
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (sortCriteria === "ID") {
            return a.id - b.id;  
        } else if (sortCriteria === "Name") {
            return a.name.localeCompare(b.name);  
        } else if (sortCriteria === "Permission") {
            return a.permission.localeCompare(b.permission); 
        }
        return 0;
    });

    return (
        <div className="container mt-5">
            <h1>Profil</h1>
            <div className="card m-5 w-25">
                <div className="card-header d-flex justify-content-center align-items-center">
                    <h3>Info:</h3>
                </div>
                {/* Image or Upload Button */}
                <div className="card-body text-center">
                    {user.image ? (
                        <div className="d-flex flex-column">
                            <img
                                src={user.image}
                                alt={`User image: ${user.name}`}
                                className="img-fluid mb-2"
                                style={{ maxHeight: "150px" }}
                            />
                            <Button
                                variant="primary"
                                onClick={() => document.getElementById(`file-input-${user.id}`).click()}
                                disabled={loadingImage[user.id]}
                            >
                                {loadingImage[user.id] ? (
                                    <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                    "Kép megváltoztatása"
                                )}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="warning"
                            onClick={() => document.getElementById(`file-input-${user.id}`).click()}
                            disabled={loadingImage[user.id]}
                        >
                            {loadingImage[user.id] ? (
                                <Spinner as="span" animation="border" size="sm" />
                            ) : (
                                "Kép hozzáadása"
                            )}
                        </Button>
                    )}

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        id={`file-input-${user.id}`}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={e => handleImageUpload(user.id, e.target.files[0])}
                    />
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{user.name}</li>
                    <li className="list-group-item">{user.email}</li>
                    <li className="list-group-item">{user.permission}</li>
                    <li className="list-group-item d-flex justify-content-center align-items-center">
                        <Button
                            variant="primary"
                            onClick={() => handleModify(user.id, user.name)}
                            disabled={loadingModify[user.id]}
                        >
                            {loadingModify[user.id] ? <Spinner animation="border" size="sm" /> : "Módosítás"}
                        </Button>
                    </li>
                </ul>
            </div>

            {/* Filters and Sorting */}
            <div className="card-header d-flex justify-content-center align-items-center">
                <h3>Users:</h3>
            </div>
            <div className="mb-3 d-flex gap-2">
                    {/* Sort Dropdown */}
                    <Form.Select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
                        <option value="ID">ID szerint</option>
                        <option value="Name">Név szerint</option>
                        <option value="Permission">Permission szerint</option>
                    </Form.Select>

                    {/* Permission filter */}
                    <Form.Select value={selectedPermission} onChange={e => setSelectedPermission(e.target.value)}>
                        <option value="All">Permission szűrő</option>
                        {[...new Set(userLista.map(user => user.permission))].map(permission => (
                            <option key={permission} value={permission}>{permission}</option>
                        ))}
                    </Form.Select>
                </div>

            {/* Users List */}
            <div className="row mt-3">
                {sortedUsers.length > 0 ? (
                    sortedUsers.map((user, index) => (
                        <div className="col-md-4 mb-3" key={user.id || index}>
                            <div className="card">
                                <div className="card-header">ID: {user.id}</div>
                                <div className="card-body">
                                    <p>
                                        <strong>User: </strong> {user.name}
                                    </p>
                                    <p>
                                        <strong>permission: </strong> {user.permission} 
                                    </p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleAdminModify(user.id, user.name, user.permission)}
                                        disabled={loadingModify[user.id]}
                                    >
                                        {loadingModify[user.id] ? <Spinner animation="border" size="sm" /> : "Módosítás"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={loadingDelete[user.id]}
                                    >
                                        {loadingDelete[user.id] ? <Spinner animation="border" size="sm" /> : "Törlés"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nem található users!</p>
                )}
            </div>
        </div>
    );
}

export default AProfil;

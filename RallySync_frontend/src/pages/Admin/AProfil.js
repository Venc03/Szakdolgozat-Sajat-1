import React, { useContext, useState, useEffect } from "react";
import useAuthContext from "../../contexts/AuthContext";
import { Button, Spinner, Form } from "react-bootstrap";
import { getCsrfToken, myAxios } from "../../api/myAxios";
import APIContext from "../../contexts/APIContext";
import { Modal } from "react-bootstrap";

function AProfil() {
    const { user, setUser } = useAuthContext();
    const { userLista, getUsers, permissionLista, getPermissions} = useContext(APIContext);
    const [loadingModify, setLoadingModify] = useState({});
    const [loadingDelete, setLoadingDelete] = useState({});
    const [error, setError] = useState("");
    const [sortCriteria, setSortCriteria] = useState("ID");
    const [selectedID, setSelectedID] = useState("All");
    const [selectedName, setSelectedName] = useState("All");
    const [selectedPermission, setSelectedPermission] = useState("All");
    const [loadingImage, setLoadingImage] = useState({});
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [permissionOptions, setPermissionOptions] = useState([]);

        useEffect(() => {
            getPermissions();
        }, []);

       useEffect(() => {
            setPermissionOptions(permissionLista.map(perm => perm.permission)); 
        }, [permissionLista]);

        const getPermId = (permission) => {
            console.log("Looking for permissions:", permission);
            const perm = permissionLista.find(p => p.permission === permission);
            console.log("Found permission:", perm);
            return perm ? perm.perm_id : null;
        };

    // Handle Modify Save
    const handleModifySave = async () => {
        if (!editingUser) return;
    
        const { permission } = editingUser;

        console.log("Editing User:", editingUser);

        if (!permission) {
            alert("Minden mezőt ki kell tölteni! (You must fill all fields)");
            return;
        }
    
        const permId = getPermId(permission);
    
        console.log("Mapped User Data:", { permId });
    
        if (!permId) {
            alert("Invalid data. Please ensure all fields are properly selected.");
            return;
        }
    
        const userData = {
            name: editingUser.name,
            permission: permId, 
        };
    
        try {
            const response = await myAxios.patch(`/api/userAdminModify/${editingUser.id}`, userData);
            console.log("User modified successfully:", response.data);
            getUsers();
            setShowModal(false);
        } catch (error) {
            console.error("Error modifying the user:", error.response?.data);
        }
    };

    // Handle Delete
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

    const openModifyModal = (user) => {
        setEditingUser({ ...user });
        setShowModal(true);
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

    const usersWithoutLoggedIn = sortedUsers.filter(u => u.id !== user.id);

    const getPermissionName = (permissionId) => {
        const permission = permissionLista.find(p => p.perm_id === permissionId);
        return permission ? permission.permission : "Unknown Permission"; 
    };

    return (
        <div className="container mt-5">
            <h1>Profil</h1>
            <div className="card m-5 w-25">
                <div className="card-header d-flex justify-content-center align-items-center">
                    <h3>Info:</h3>
                </div>
                <div className="card-body text-center">
                    {user.image ? (
                        <div className="d-flex flex-column align-items-center">
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

                    <input
                        type="file"
                        id={`file-input-${user.id}`}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={e => handleImageUpload(user.id, e.target.files[0])}
                    />
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Username: </strong>{user.name}</li>
                    <li className="list-group-item"><strong>User email: </strong>{user.email}</li>
                    <li className="list-group-item"><strong>Permission: </strong>{getPermissionName(user.permission)}</li>
                    <li className="list-group-item d-flex justify-content-center align-items-center">
                        <Button
                            variant="primary"
                            onClick={() => {
                                setEditingUser(user);
                                setShowModal(true);
                            }}
                            disabled={loadingModify[user.id]}
                        >
                            {loadingModify[user.id] ? <Spinner animation="border" size="sm" /> : "Módosítás"}
                        </Button>
                    </li>
                </ul>
            </div>

            {/* Modify User Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Felhasználó módosítása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingUser && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Felhasználónév</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingUser?.name || ""}
                                    onChange={e => {
                                        setEditingUser(prev => ({ ...prev, name: e.target.value }));
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Permission</Form.Label>
                                <Form.Select
                                    value={editingUser?.permission || ""}
                                    onChange={e => {
                                        setEditingUser(prev => ({ ...prev, permission: e.target.value }));
                                    }}
                                >
                                    <option value="">Válassz egy státuszt</option>
                                    {permissionOptions.map(permission => (
                                        <option key={permission} value={permission}>
                                            {permission}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Mégse
                    </Button>
                    <Button variant="success" onClick={handleModifySave} disabled={loadingModify[editingUser?.id]}>
                        {loadingModify[editingUser?.id] ? <Spinner as="span" animation="border" size="sm" /> : "Módosítás"}
                    </Button>
                </Modal.Footer>
            </Modal>

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
                {usersWithoutLoggedIn.length > 0 ? (
                    usersWithoutLoggedIn.map((user, index) => (
                        <div className="col-md-4 mb-3" key={user.id || index}>
                            <div className="card">
                                <div className="card-header">ID: {user.id}</div>
                                <div className="card-body text-center">
                                    {user.image ? (
                                        <div className="d-flex flex-column align-items-center">
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
                                
                                    <input
                                        type="file"
                                        id={`file-input-${user.id}`}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={e => handleImageUpload(user.id, e.target.files[0])}
                                    />
                                </div>
                                
                                <div className="card-body">
                                    <p><strong>User: </strong> {user.name}</p>
                                    <p><strong>permission: </strong> {user.permission}</p>
                                </div>

                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            openModifyModal(user);
                                        }}
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
                    <p>Felhasználó nem található</p>
                )}
            </div>
        </div>
    );
}

export default AProfil;

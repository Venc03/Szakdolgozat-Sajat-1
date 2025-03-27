import React, { useContext, useState, useEffect } from "react";
import { Button, InputGroup, FormControl, Spinner, Form, Modal } from "react-bootstrap";
import APIContext from "../../contexts/APIContext";
import { myAxios } from "../../api/myAxios";

export default function RaceCars() {
    const { carList, getCars } = useContext(APIContext);
    const [selectedID, setSelectedID] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortCriteria, setSortCriteria] = useState("ID");
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState({}); 
    const [loadingModify, setLoadingModify] = useState({}); 
    const [carName, setCarName] = useState(""); 
    const [categName, setCategName] = useState(""); 
    const [statusName, setStatusName] = useState(""); 
    const [loadingImage, setLoadingImage] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);    
    const { brandtypeLista, getBrandtype } = useContext(APIContext); 
    const { categLista, getKategoriak } = useContext(APIContext);
    const { statusLista, getStatus } = useContext(APIContext); 
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        getCars();
        getBrandtype();
        getKategoriak();
        getStatus();
    }, [getCars, brandtypeLista, categLista, statusLista]);

    useEffect(() => {
        setBrandOptions(brandtypeLista.map(brand => brand.brandtype)); 
    }, [brandtypeLista]);
    
    useEffect(() => {
        setCategoryOptions(categLista.map(category => category.category)); 
    }, [categLista]);
    
    useEffect(() => {
        setStatusOptions(statusLista.map(status => status.statsus));
    }, [statusLista]);

    const getBrandId = (brandtype) => {
        const brand = brandtypeLista.find(b => b.brandtype === brandtype);
        return brand ? brand.id : null;  
    };
    
    const getCategoryId = (category) => {
        const cat = categLista.find(c => c.category === category);
        return cat ? cat.id : null;  
    };
    
    const getStatusId = (status) => {
        const stat = statusLista.find(s => s.statsus === status);
        return stat ? stat.id : null; 
    };

    const brandtypeId = getBrandId(editingCar?.bt_id);
    const categoryId = getCategoryId(editingCar?.categ_id);  
    const statusId = getStatusId(editingCar?.stat_id);

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

    // Open Modify Modal
    const openModifyModal = (car) => {
        setEditingCar({ ...car }); // Copy the car data
        setShowModal(true);
    };

    // Handle Input Change in Modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingCar((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Modify Save
const handleModifySave = async () => {
    if (!editingCar.brandtype.trim() || !editingCar.category.trim() || !editingCar.statsus.trim()) {
        alert("Brand, Category, and Status cannot be empty.");
        return;
    }

    // Ensure editingCar has valid values before sending request
    if (!editingCar.brandtype || !editingCar.category || !editingCar.statsus) {
        alert("All fields must be filled in.");
        return;
    }

    // Ensure that brandtype, category, and status are sent as IDs (not strings)
    const brandtypeId = getBrandId(editingCar.brandtype);
    const categoryId = getCategoryId(editingCar.category);
    const statusId = getStatusId(editingCar.statsus);

    setLoadingModify((prev) => ({ ...prev, [editingCar.cid]: true }));

    try {
        // Modify the car by sending the IDs to the backend
        await myAxios.patch(`/api/carModify/${editingCar.cid}`, {
            brandtype: brandtypeId, // Ensure brandtypeId is sent
            category: categoryId,   // Ensure categoryId is sent
            status: statusId,       // Ensure statusId is sent
        });
        getCars(); // Refresh the car list after modifying
        setShowModal(false); // Close the modal after successful modification
    } catch (error) {
        console.error("Error modifying the car:", error.response?.data || error.message);
        alert("Failed to modify the car. Please try again.");
    } finally {
        setLoadingModify((prev) => ({ ...prev, [editingCar.cid]: false }));
    }
};

    // Handle Image Upload
    const handleImageUpload = async (carId, file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('car_id', carId);
    
        setLoadingImage(prev => ({ ...prev, [carId]: true }));
    
        try {
            const response = await myAxios.post("/api/carUploadImage", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.data.success) {
                console.log("Image uploaded successfully:", response.data.image_url);
                getCars(); 
            } else {
                console.error("Image upload failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoadingImage(prev => ({ ...prev, [carId]: false }));
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
                    sortedCars.map((car) => (
                        <div key={car.cid} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-header">ID: {car.cid}</div>
                                <div className="card-body">
                                    {/* Image or Upload Button */}
                                    <div className="card-body text-center">
                                        {car.image ? (
                                            <div className="d-flex flex-column">
                                                <img
                                                    src={car.image}
                                                    alt={`Car image: ${car.brandtype}`}
                                                    className="img-fluid mb-2"
                                                    style={{ maxHeight: "150px" }}
                                                />
                                                <Button
                                                    variant="primary"
                                                    onClick={() => document.getElementById(`file-input-${car.cid}`).click()}
                                                    disabled={loadingImage[car.cid]}
                                                >
                                                    {loadingImage[car.cid] ? (
                                                        <Spinner as="span" animation="border" size="sm" />
                                                    ) : (
                                                        "Kép megváltoztatása"
                                                    )}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="warning"
                                                onClick={() => document.getElementById(`file-input-${car.cid}`).click()}
                                                disabled={loadingImage[car.cid]}
                                            >
                                                {loadingImage[car.cid] ? (
                                                    <Spinner as="span" animation="border" size="sm" />
                                                ) : (
                                                    "Kép hozzáadása"
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        id={`file-input-${car.cid}`}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={e => handleImageUpload(car.cid, e.target.files[0])}
                                    />
                                    <p><strong>Márka: </strong> {car.brandtype}</p>
                                    <p><strong>Kategória: </strong> {car.category}</p>
                                    <p><strong>Státusz: </strong> {car.statsus}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button 
                                        variant="primary" 
                                        onClick={() => openModifyModal(car)}
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

            {/* Modify Car Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Autó módosítása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingCar && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Márka</Form.Label>
                                <Form.Select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                                    <option value="All">Márka szűrő</option>
                                    {brandtypeLista.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.brandtype}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Kategória</Form.Label>
                                <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                                    <option value="All">Kategória szűrő</option>
                                    {categLista.map(category => (
                                        <option key={category.id} value={category.id}>{category.category}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Státusz</Form.Label>
                                <Form.Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                                    <option value="All">Státusz szűrő</option>
                                    {statusLista.map(status => (
                                        <option key={status.id} value={status.id}>{status.statsus}</option>
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
                    <Button variant="success" onClick={handleModifySave} disabled={loadingModify[editingCar?.cid]}>
                        {loadingModify[editingCar?.cid] ? <Spinner as="span" animation="border" size="sm" /> : "Módosítás"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

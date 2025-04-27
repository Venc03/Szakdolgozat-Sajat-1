import React, { useContext, useEffect, useState } from "react";
import useAuthContext from "../../contexts/AuthContext";
import { Button, Spinner, Form, Modal } from "react-bootstrap";
import { getCsrfToken, myAxios } from "../../api/myAxios";
import APIContext from "../../contexts/APIContext";

function Competitions() {
    const { user, setUser } = useAuthContext();
    const { competitionLista, getCompetitions, helyszinLista, getHelyszin, categLista, getKategoriak } = useContext(APIContext);
    const [competitionName, setCompetitionName] = useState(""); 
    const [loadingModify, setLoadingModify] = useState({});
    const [loadingDelete, setLoadingDelete] = useState({});
    const [error, setError] = useState("");
    const [sortCriteria, setSortCriteria] = useState("ID");
    const [selectedID, setSelectedID] = useState("All");
    const [selectedName, setSelectedName] = useState("All");
    const [selectedPlace, setSelectedPlace] = useState("All");
    const [selectedOrganiser, setSelectedOrganiser] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [placeOptions, setPlaceOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [editingComp, setEditingComp] = useState(null); 
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getHelyszin();
        getKategoriak();
        getCompetitions();
    }, []);

    useEffect(() => {
        setPlaceOptions(helyszinLista.map(place => place.place)); 
    }, [helyszinLista]);
        
    useEffect(() => {
        setCategoryOptions(categLista.map(category => category.category)); 
    }, [categLista]);

    const getPlaceId = (placeName) => {  
        const foundPlace = helyszinLista.find(p => p.place === placeName);
        return foundPlace ? foundPlace.plac_id : null;
    };
    
    const getCategoryId = (category) => {
        const cat = categLista.find(c => c.category === category);
        return cat ? cat.categ_id : null;
    };

    const handleModify = (competitionId, categid, oldDetails) => {
        if (!oldDetails || !competitionId || !categid) {
            console.error("Missing necessary parameters:", competitionId, categid, oldDetails);
            return;
        }
        setEditingComp({
            ...oldDetails,
            oldCategoryId: categid, 
            oldCompId: competitionId
        });
        setShowModal(true);
    };

    const handleModalClose = () => setShowModal(false);

    // Handle Modify Save
    const handleModifySave = async () => {
        if (!editingComp) return;
        const { place, category, comp_id, event_name, min_entry, max_entry, start_date, end_date, oldCategoryId, oldCompId } = editingComp;
   
        if (!place || !category) {
            alert("Minden mezőt ki kell tölteni! (You must fill all fields)");
            return;
        }
   
        const placeId = getPlaceId(place);
        const categoryId = getCategoryId(category);
   
        if (!placeId || !categoryId) {
            alert("Invalid data. Please ensure all fields are properly selected.");
            return;
        }
   
        const compData = {
            event_name,
            categid: categoryId,
            pid: placeId,
            min_entry,
            max_entry,
            start_date,
            end_date,
        };
   
        try {
            const response = await myAxios.patch(`/api/competitionModify/${oldCompId}/${oldCategoryId}`, compData);
            console.log("Competition modified successfully:", response.data);
            getCompetitions();
            setShowModal(false);
        } catch (error) {
            console.error("Error modifying the competition:", error.response?.data);
            setError("An error occurred while updating the competition.");
        }
    };

    // Handle Delete
    const handleDelete = async (competitionId, categoryId) => {
        if (window.confirm("Are you sure you want to delete this competition?")) {
            setLoadingDelete(prev => ({ ...prev, [competitionId]: true }));
            setError("");

            try {
                await getCsrfToken();
                await myAxios.delete(`/api/competitionDelete/${competitionId}/${categoryId}`);
                getCompetitions(); 
            } catch (error) {
                console.error("Error deleting the competition:", error.response?.data?.message);
                setError("There was an error deleting the competition.");
            } finally {
                setLoadingDelete(prev => ({ ...prev, [competitionId]: false }));
            }
        }
    };

    const filteredCompetitions = competitionLista.filter(competition => 
        (selectedID === "All" || competition.id === selectedID) &&
        (selectedName === "All" || competition.name.includes(selectedName)) && 
        (selectedPlace === "All" || competition.place === selectedPlace) &&
        (selectedOrganiser === "All" || competition.organiser === selectedOrganiser) &&
        (selectedCategory === "All" || competition.category === selectedCategory) 
    );

    const sortedCompetitions = filteredCompetitions.sort((a, b) => {
        if (sortCriteria === "ID") {
            return a.comp_id - b.comp_id;
        } else if (sortCriteria === "Name") {
            return (a.event_name || "").localeCompare(b.event_name || "");
        } else if (sortCriteria === "Place") {
            return (a.place || "").localeCompare(b.place || "");
        } else if (sortCriteria === "Organiser") {
            return (a.organiser || "").localeCompare(b.organiser || "");
        }
        return 0;
    });

    const groupCategories = () => {
        const grouped = {};
        competitionLista.forEach(competition => {
            if (competition.category) {
                const firstLetter = competition.category[0].toUpperCase();
                if (!grouped[firstLetter]) {
                    grouped[firstLetter] = [];
                }
                grouped[firstLetter].push(competition.category);
            }
        });
        Object.keys(grouped).forEach(letter => {
            grouped[letter] = [...new Set(grouped[letter])].sort();
        });
        return grouped;
    };

    const groupedCategories = groupCategories();

    return (
        <div className="container mt-5">
            <h1>Versenyek</h1>
            <div className="mb-3 d-flex gap-2">
                <Form.Select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
                    <option value="ID">ID szerint</option>
                    <option value="Name">Név szerint</option>
                    <option value="Place">Hely szerint</option>
                    <option value="Organiser">Szervező szerint</option>
                </Form.Select>

                <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="All">Összes kategoria</option>
                    {Object.keys(groupedCategories).map(letter => (
                        <optgroup label={letter} key={letter}>
                            {groupedCategories[letter].map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </Form.Select>
            </div>

            <div className="row mt-3">
                {sortedCompetitions.length > 0 ? (
                    sortedCompetitions.map((competition, index) => (
                        <div className="col-md-4 mb-3" key={`${competition.comp_id}-${index}`}>
                            <div className="card">
                                <div className="card-header">ID: {competition.comp_id}</div>
                                <div className="card-body">
                                    <p><strong>Verseny: </strong> {competition.event_name}</p>
                                    <p><strong>Helyszin: </strong> {competition.place}</p>
                                    <p><strong>Szervező: </strong> {competition.organiser}</p>
                                    <p><strong>Kategoriak: </strong> {competition.category}</p>
                                    <p><strong>Résztvevők: </strong> {competition.min_entry} - {competition.max_entry}</p>
                                    <p><strong>Dátum: </strong> {competition.start_date} - {competition.end_date}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleModify(competition.comp_id, competition.categid, {
                                            event_name: competition.event_name,
                                            categid: competition.category,
                                            pid: competition.place,
                                            min_entry: competition.min_entry,
                                            max_entry: competition.max_entry,
                                            start_date: competition.start_date,
                                            end_date: competition.end_date,
                                        })}
                                        disabled={loadingModify[competition.comp_id]}
                                    >
                                        {loadingModify[competition.comp_id] ? <Spinner animation="border" size="sm" /> : "Modify"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(competition.comp_id, competition.categid)}
                                        disabled={loadingDelete[competition.comp_id]}
                                    >
                                        {loadingDelete[competition.comp_id] ? <Spinner animation="border" size="sm" /> : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Versenyek nem találhatók.</p>
                )}
            </div>

            {/* Modal for Editing */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Competition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingComp ? (
                        <Form>
                            <Form.Group controlId="event_name">
                                <Form.Label>Verseny</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingComp.event_name}
                                    onChange={e => setEditingComp(prev => ({ ...prev, event_name: e.target.value }))} 
                                />
                            </Form.Group>
                                 
                            <Form.Group controlId="place">
                                <Form.Label>Helyszin</Form.Label>
                                <Form.Select
                                    value={editingComp.place || ""}
                                    onChange={e => setEditingComp(prev => ({ ...prev, place: e.target.value }))}
                                >
                                    <option value="">Válassz egy helyszint</option>
                                    {helyszinLista.map(place => (
                                        <option key={place.plac_id} value={place.place}>
                                            {place.place}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="category">
                                <Form.Label>Kategória</Form.Label>
                                <Form.Select
                                    value={editingComp.category || ""}
                                    onChange={e => setEditingComp(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="">Válassz egy kategóriát</option>
                                    {categLista.map(category => (
                                        <option key={category.categ_id} value={category.category}>
                                            {category.category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="min_entry">
                                <Form.Label>Min Entry</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editingComp.min_entry}
                                    onChange={e => setEditingComp(prev => ({ ...prev, min_entry: e.target.value }))}
                                />
                            </Form.Group>

                            <Form.Group controlId="max_entry">
                                <Form.Label>Max Entry</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editingComp.max_entry}
                                    onChange={e => setEditingComp(prev => ({ ...prev, max_entry: e.target.value }))}
                                />
                            </Form.Group>

                            <Form.Group controlId="start_date">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editingComp.start_date}
                                    onChange={e => setEditingComp(prev => ({ ...prev, start_date: e.target.value }))}
                                />
                            </Form.Group>

                            <Form.Group controlId="end_date">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editingComp.end_date}
                                    onChange={e => setEditingComp(prev => ({ ...prev, end_date: e.target.value }))}
                                />
                            </Form.Group>
                        </Form>
                    ) : (
                        <p>Loading competition details...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleModifySave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Competitions;

import React, { useContext, useState } from "react";
import useAuthContext from "../../contexts/AuthContext";
import { Button, Spinner, Form } from "react-bootstrap";
import { getCsrfToken, myAxios } from "../../api/myAxios";
import APIContext from "../../contexts/APIContext";

function Competitions() {
    const { user, setUser } = useAuthContext();
    const { competitionLista, getCompetitions } = useContext(APIContext);
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

    const handleModify = async (id, oldEventName) => {
        const newEventName = window.prompt("Enter new event name:", oldEventName);
        if (!newEventName || newEventName.trim() === "") {
            window.alert("The event name cannot be empty.");
            return;
        }
    
        setLoadingModify(prev => ({ ...prev, [id]: true }));
        setError("");
    
        try {
            await getCsrfToken();
            await myAxios.patch(`/api/competitionModifiy/${id}`, { event_name: newEventName.trim() });
            getCompetitions(); 
        } catch (error) {
            console.error("Error modifying the competition:", error.response?.data?.message);
            setError("There was an error modifying the competition.");
        } finally {
            setLoadingModify(prev => ({ ...prev, [id]: false }));
        }
    };
    
    const handleDelete = async id => {
        if (window.confirm("Are you sure you want to delete this competition?")) {
            setLoadingDelete(prev => ({ ...prev, [id]: true }));
            setError("");
    
            try {
                await getCsrfToken();
                await myAxios.delete(`/api/competitionDelete/${id}`);
                getCompetitions(); 
            } catch (error) {
                console.error("Error deleting the competition:", error.response?.data?.message);
                setError("There was an error deleting the competition.");
            } finally {
                setLoadingDelete(prev => ({ ...prev, [id]: false }));
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

    const today = new Date().toISOString().split("T")[0]; 

    const sortedCompetitions = filteredCompetitions.sort((a, b) => {
        // Sorting based on selected criteria
        if (sortCriteria === "ID") {
            return a.competition - b.competition;  // Sorting by competition ID
        } else if (sortCriteria === "Name") {
            return (a.name || "").localeCompare(b.name || "");  
        } else if (sortCriteria === "Place") {
            return (a.place || "").localeCompare(b.place || ""); 
        } else if (sortCriteria === "Organiser") {
            return (a.organiser || "").localeCompare(b.organiser || "");  
        } else if (sortCriteria === "RegisteredCompetitions") {
            // First filter by RegisteredCompetitions, then sort by min_date and competition ID
            const filteredByRegisteredCompetitions = filteredCompetitions.filter(competition => 
                competition.min_date && competition.min_date > today
            );
    
            // Sort first by min_date, then by competition ID
            return filteredByRegisteredCompetitions.sort((compA, compB) => {
                // First by min_date comparison
                if (compA.min_date !== compB.min_date) {
                    return compA.min_date.localeCompare(compB.min_date);
                }
                // If min_date is equal, sort by competition ID
                return compA.competition - compB.competition;
            });
        }
        return 0;  // Default case if no criteria match
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
                {/* Sort Dropdown */}
                <Form.Select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
                    <option value="ID">ID szerint</option>
                    <option value="Name">Név szerint</option>
                    <option value="Place">Hely szerint</option>
                    <option value="Organiser">Szervező szerint</option>
                    <option value="RegisteredCompetitions">Regisztrált Versenyek szerint</option>
                </Form.Select>

                {/* Category Dropdown with Grouping */}
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

            {/* Competition List */}
            <div className="row mt-3">
                {sortedCompetitions.length > 0 ? (
                    sortedCompetitions.map((competition, index) => (
                        <div className="col-md-4 mb-3" key={`${competition.comp_id}-${index}`}>
                            <div className="card">
                                <div className="card-header">ID: {competition.competition}</div>
                                <div className="card-body">
                                    <p><strong>Verseny: </strong> {competition.event_name}</p>
                                    <p><strong>helyszin: </strong> {competition.place}</p>
                                    <p><strong>Szervező: </strong> {competition.organiser}</p>
                                    <p><strong>Kategoriak: </strong> {competition.category}</p>
                                    <p><strong>Résztvevők: </strong> {competition.min_entry} - {competition.max_entry}</p>
                                    <p><strong>Dátum: </strong> {competition.start_date} - {competition.end_date}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleModify(competition.comp_id, competition.event_name)}
                                        disabled={loadingModify[competition.comp_id]}
                                    >
                                        {loadingModify[competition.comp_id] ? <Spinner animation="border" size="sm" /> : "Modify"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(competition.comp_id)}
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
        </div>
    );
}

export default Competitions;

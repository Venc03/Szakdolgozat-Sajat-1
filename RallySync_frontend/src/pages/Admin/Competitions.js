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

    const handleModify = async (
        competitionId,
        cccategoryId,
        oldPlace,
        oldEventName,
        oldMinEntry,
        oldMaxEntry,
        oldStartDate,
        oldEndDate
      ) => {
        // Prompt user for each field that can be updated, pre-fill with old data
        const newEventName = window.prompt("Enter new event name:" + oldEventName, oldEventName);
        if (newEventName === null) return; // User canceled the prompt
        if (!newEventName.trim()) {
          window.alert("The event name cannot be empty.");
          return;
        }
      
        const newCategory = window.prompt("Enter new category:" + cccategoryId, cccategoryId);
        if (newCategory === null) return; // User canceled the prompt
        if (!newCategory.trim()) {
          window.alert("The category cannot be empty.");
          return;
        }
      
        const newPlace = window.prompt("Enter new place:" + oldPlace, oldPlace);
        if (newPlace === null) return; // User canceled the prompt
        if (!newPlace.trim()) {
          window.alert("The place cannot be empty.");
          return;
        }
      
        const newMinEntry = window.prompt("Enter new minimum attendance:" + oldMinEntry, oldMinEntry);
        if (newMinEntry === null) return; // User canceled the prompt
        if (!newMinEntry || isNaN(newMinEntry) || newMinEntry < 0) {
          window.alert("Invalid minimum attendance.");
          return;
        }
      
        const newMaxEntry = window.prompt("Enter new maximum attendance:" + oldMaxEntry, oldMaxEntry);
        if (newMaxEntry === null) return; // User canceled the prompt
        if (!newMaxEntry || isNaN(newMaxEntry) || newMaxEntry < 0) {
          window.alert("Invalid maximum attendance.");
          return;
        }
      
        const newStartDate = window.prompt("Enter new start date (YYYY-MM-DD):" + oldStartDate, oldStartDate);
        if (newStartDate === null) return; // User canceled the prompt
        if (!newStartDate || isNaN(new Date(newStartDate))) {
          window.alert("Invalid start date.");
          return;
        }
      
        const newEndDate = window.prompt("Enter new end date (YYYY-MM-DD):" + oldEndDate, oldEndDate);
        if (newEndDate === null) return; // User canceled the prompt
        if (!newEndDate || isNaN(new Date(newEndDate))) {
          window.alert("Invalid end date.");
          return;
        }
      
        // Consolidated API call
        const updatedData = {
          event_name: newEventName.trim(),
          category: newCategory.trim(),
          place: newPlace.trim(),
          min_entry: newMinEntry,
          max_entry: newMaxEntry,
          start_date: newStartDate,
          end_date: newEndDate,
        };
      
        console.log("Sending data to backend:", updatedData); // Log the data being sent
      
        setLoadingModify((prev) => ({ ...prev, [competitionId]: true }));
        setError("");
      
        try {
          await getCsrfToken();
      
          // Send the update request with all the updated fields
          await myAxios.patch(`/api/competitionModify/${competitionId}/${cccategoryId}`, updatedData);
      
          // Refresh the competition list after successful update
          getCompetitions();
          window.alert("Competition updated successfully!");
        } catch (error) {
          console.error("Error modifying the competition:", error.response?.data?.message || error.message);
          setError("There was an error modifying the competition.");
        } finally {
          setLoadingModify((prev) => ({ ...prev, [competitionId]: false }));
        }
      };      
    
    const handleDelete = async (competitionId, cccategoryId) => {
        if (window.confirm("Are you sure you want to delete this competition?")) {
            console.log("Deleting:", competitionId, cccategoryId);
            
            setLoadingDelete(prev => ({ ...prev, [competitionId]: true }));
            setError("");
    
            try {
                await getCsrfToken();
                await myAxios.delete(`/api/competitionDelete/${competitionId}/${cccategoryId}`);
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
                                    <p><strong>Helyszin: </strong> {competition.place}</p>
                                    <p><strong>Szervező: </strong> {competition.organiser}</p>
                                    <p><strong>Kategoriak: </strong> {competition.category}</p>
                                    <p><strong>Résztvevők: </strong> {competition.min_entry} - {competition.max_entry}</p>
                                    <p><strong>Dátum: </strong> {competition.start_date} - {competition.end_date}</p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleModify(
                                            competition.comp_id, 
                                            competition.cccategory, 
                                            competition.pid, 
                                            competition.event_name, 
                                            competition.min_entry, 
                                            competition.max_entry, 
                                            competition.start_date, 
                                            competition.end_date
                                        )
                                    }
                                    disabled={loadingModify[competition.comp_id]}
                                >
                                    {loadingModify[competition.comp_id] ? <Spinner animation="border" size="sm" /> : "Modify"}
                                </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(competition.comp_id, competition.cccategory)}
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

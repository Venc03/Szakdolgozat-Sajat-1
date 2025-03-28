import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import logo2 from "../pages/logo2.png";
import { AuthContext } from "../contexts/AuthContext";

function NavigacioAdmin() {
    const { logout, user } = useContext(AuthContext);
    return (
        <Navbar expand="md" className="mb-3" style={{ backgroundColor: "#000056" }}>
            <Container fluid>

                {/* MOBIL MENÜ */}
                <div className="d-md-none w-100 d-flex justify-content-end">
                    <Navbar.Toggle aria-controls="offcanvasNavbar" className="border-0 toggle-white" />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">
                                Menü
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="bg-dark">
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link as={Link} to="/versenyautok" className="text-white">Versenyautók</Nav.Link>
                                <Nav.Link as={Link} to="/kategoriak" className="text-white">Kategóriák</Nav.Link>
                                <Nav.Link as={Link} to="/helyszinek" className="text-white">Helyszínek</Nav.Link>
                                <Nav.Link as={Link} to="/markatipus" className="text-white">Márka Tipus</Nav.Link>
                                <Nav.Link as={Link} to="/status" className="text-white">Státusz</Nav.Link>
                                <Nav.Link as={Link} to="/versenyek" className="text-white">Versenyek</Nav.Link>
                                <Nav.Link as={Link} to="/profil" className="text-white">Profil(s)</Nav.Link>
                                <Nav.Item className="text-white">Felhasználó: {user.name}</Nav.Item>
                                <Button className="logout-btn text-nowrap" onClick={logout}>
                                    Kijelentkezés
                                </Button>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </div>

                {/* ASZTALI MENÜ */}
                <Navbar.Collapse className="justify-content-center d-none d-md-flex">
                    <Nav
                        justify
                        variant="tabs"
                        className="collapse navbar-nav d-grid w-100 align-items-center text-center"
                        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto 1fr 1fr 1fr 1fr 1fr" }}
                    >

                        <Nav.Link as={Link} to="/markatipus" className="text-white">Márka Tipus</Nav.Link>
                                <Nav.Link as={Link} to="/status" className="text-white">Státusz</Nav.Link>
                        <Nav.Link as={Link} to="/kategoriak" className="text-white">Kategóriák</Nav.Link>
                        <Nav.Link as={Link} to="/helyszinek" className="text-white">Helyszínek</Nav.Link>
                        <Navbar.Brand href="/" className="mx-4 d-flex justify-content-center">
                            <img src={logo2} alt="Logo" width="50" height="50" />
                        </Navbar.Brand>
                        <Nav.Link as={Link} to="/versenyek" className="text-white">Versenyek</Nav.Link>
                        <Nav.Link as={Link} to="/versenyautok" className="text-white">Versenyautók</Nav.Link>
                        <Nav.Link as={Link} to="/profil" className="text-white">Profil(s)</Nav.Link>
                        <Nav.Item className="text-white">Felhasználó: {user.name}</Nav.Item>
                        <Button
                            className="logout-btn text-nowrap"
                            onClick={logout}
                        >
                            Kijelentkezés
                        </Button>
                    </Nav>
                </Navbar.Collapse>

            </Container>

            <style>
                {`
                    .logout-btn {
                        background-color: #fe0000;
                        border: none;
                        transition: background-color 0.3s ease-in-out;
                    }
                    .logout-btn:hover {
                        background-color: #0059ff;
                    }
                    .toggle-white {
                        filter: invert(1);
                    }
                    img{
                    background-color: white;
                    }
                    .collapse{
                        margin: auto;
                    }
                `}  
            </style>

        </Navbar>
    )
}

export default NavigacioAdmin
import React from 'react';
import useAuthContext from '../../contexts/AuthContext';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import logo from "../logo.jpg";

function Versenyek() {
  const { user } = useAuthContext();

  // Tömb a kártyák adataival
  const cardsData = [
    {
      title: "Teszt 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: logo,
    },
    {
      title: "Teszt 2",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: logo,
    },
    {
      title: "Teszt 3",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: logo,
    },
    {
      title: "Teszt 3",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: logo,
    },
    {
      title: "Teszt 3",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      image: logo,
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        padding: '16px',
      }}
    >
      {cardsData.map((card, index) => (
        <Card key={index} sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="Test"
            height="140"
            image={card.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {card.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {card.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained">Gomb 1</Button>
            <Button variant="contained">Gomb 2</Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}

export default Versenyek;
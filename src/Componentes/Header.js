import { AppBar } from '@mui/material'
import React from 'react'
import logo from "../logo.png";


import {
    Drawer, Divider, CssBaseline, Box,
    ListItemButton, Typography, Toolbar, ListItemText, ListItem, List, IconButton,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';




const Header = () => {
    const navigate = useNavigate();

    const handleClickClass = () => {
        navigate("/brasileirao/classificacoes"); // Substitua "/outra-pagina" pela rota desejada
    };
    const handleClickEquipes = () => {
        navigate("/brasileirao/equipes"); // Substitua "/outra-pagina" pela rota desejada
    };
    const handleClickPartidas = () => {
        navigate("/brasileirao/partidas"); // Substitua "/outra-pagina" pela rota desejada
    };


    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <>
            <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
                <CssBaseline />
                <AppBar component="nav" >

                    <Toolbar sx={{ bgcolor: '#f2f2f2', justifyContent: "space-between" }} >

                        <Box sx={{p:1}}>
                            <img src={logo} width={100} height={90} alt="brasileirão" />
                        </Box>

                

                    <Box sx={{ mr: 8 }}>
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                        >
                            <ToggleButton value="web" onClick={handleClickEquipes}>Equipes</ToggleButton>
                            <ToggleButton value="android" onClick={handleClickClass}>Classificações</ToggleButton>
                            <ToggleButton value="ios" onClick={handleClickPartidas}>Partidas</ToggleButton>
                            {/* filter */}
                        </ToggleButtonGroup>

                    </Box>
                </Toolbar>

            </AppBar>
        </Box >

        </>

    )
}

export default Header

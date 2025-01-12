import React from 'react'
import { Box, Container, Grid, Grid2 } from '@mui/material'
import { Outlet } from 'react-router-dom';
import Header from '../Componentes/Header';

const Base = () => {
    return (
        <Container
            component="main"
            maxWidth={false} // Permite que o Container use 100% da largura
            sx={{
                flexGrow: 1,
                border: '2px solid #fe0000',
                width: '100%', // Garante 100% da largura
                // height: '100vh', // Garante 100% da altura da tela
                padding: 0, 
                margin: 0, 
                marginTop: '10%',
            }}
        >
            <Header />
            
                <Outlet />
          
        </Container>

    )
}

export default Base

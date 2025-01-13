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
                width: '100%',
                padding: 0, 
                margin: 0, 
                marginTop: '7%',
            }}
        >
            <Header />
            
                <Outlet />
          
        </Container>

    )
}

export default Base

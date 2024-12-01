import { Box, Container } from '@mui/material'
import React from 'react'
import Header from './Header'

const Base = () => {
    return (
        <>
            <Header />
            <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, border: '2px solid #fe0000' }}>



            </Container>

        </>
    )
}

export default Base

import React from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Grid2, Typography } from '@mui/material';

const ListaClassifica = () => {

    const StyledTableCell = styled(TableCell)(() => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#131428',
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            backgroundColor: '#dbe2be',
            borderBottom: '1px solid #131428',
        },
    }));

    const StyledTableRow = styled(TableRow)(() => ({
        '&:nth-of-type(odd)': {
            backgroundColor: 'theme.palette.action.hover',
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const StyledTable = styled(Table)(() => ({
        border: '2px solid #fe0000', // Adiciona uma borda ao redor da tabela
        borderRadius: '8px', // Cantos arredondados (opcional)
        overflow: 'hidden', // Garante que o conteúdo da tabela respeite a borda arredondada
    }));

    function createData(equipe, vitorias, empates, derrotas, golsmarc, golssofr, aprov) {
        return { equipe, vitorias, empates, derrotas, golsmarc, golssofr, aprov };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 24, 4.0),
        createData('Eclair', 262, 16.0, 24, 6.0, 24, 4.0),
        createData('Cupcake', 305, 3.7, 67, 4.3, 24, 4.0),
        createData('Gingerbread', 356, 16.0, 49, 3.9, 24, 4.0),
    ];


    return (
        <>
            <Grid2 item xs={12} md={12} sx={{ border: '1px solid #787878' }}>
                <Typography sx={{ mt: 5, fontSize: '25px', textAlign: 'center' }}>
                    Classificações das equipes
                </Typography>
            </Grid2>

            <Box sx={{ m: 'auto', display: 'flex' }}>
                <StyledTable>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: 850 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Equipes</StyledTableCell>
                                    <StyledTableCell align="right">Vitórias</StyledTableCell>
                                    <StyledTableCell align="right">Empates</StyledTableCell>
                                    <StyledTableCell align="right">Derrotas</StyledTableCell>
                                    <StyledTableCell align="right">Gols marcados</StyledTableCell>
                                    <StyledTableCell align="right">Gols sofridos</StyledTableCell>
                                    <StyledTableCell align="right">Aproveitamento (%)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.equipe}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.equipe}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.vitorias}</StyledTableCell>
                                        <StyledTableCell align="right">{row.empates}</StyledTableCell>
                                        <StyledTableCell align="right">{row.derrotas}</StyledTableCell>
                                        <StyledTableCell align="right">{row.golsmarc}</StyledTableCell>
                                        <StyledTableCell align="right">{row.golssofr}</StyledTableCell>
                                        <StyledTableCell align="right">{row.aprov}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </StyledTable>
            </Box>
        </>
    )
}

export default ListaClassifica

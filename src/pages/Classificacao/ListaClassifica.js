import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Grid2, Typography } from '@mui/material';
import axios from 'axios';

const ListaClassifica = () => {

    const StyledTableCell = styled(TableCell)(() => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#131428',
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '20px'
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            backgroundColor: '#dbe2be',
            borderBottom: '1px solid #131428',
            fontSize: '20px'
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
        border: '2px solid #fe0000',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: 'auto', 
    }));


    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassificacoes = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/classificacao?ano=2022");
                const data = response.data.map((item) => ({
                    equipe: item.time.nome,
                    vitorias: item.vitorias,
                    empates: item.empates,
                    derrotas: item.derrotas,
                    golsmarc: item.gols_pro,
                    golssofr: item.gols_contra,
                    aprov: ((item.vitorias + item.empates) / item.jogos * 100).toFixed(2), // Calcula o aproveitamento em porcentagem
                }));
                setRows(data);
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClassificacoes();
    }, []);


    return (
        <>
            <Grid2 item xs={12} md={9}>
                <Typography sx={{ fontSize: '30px', textAlign: 'center', mb: 3, color: '#131428', fontWeight: 'bold' }}>
                    Classificações
                </Typography>
            </Grid2>

            <Box >
                <StyledTable>
                    <TableContainer component={Paper}>
                        <Table sx={{ maxWidth: '1200px', m: 'auto', mb: 5, mt: 2}} aria-label="customized table">
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

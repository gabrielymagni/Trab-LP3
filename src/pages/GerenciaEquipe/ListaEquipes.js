import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Grid2, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
axios.defaults.withCredentials = true;

function EditToolbar(props) {
    const { setRows, setRowModesModel, setFeedback } = props;

    const handleClick = () => {
        const id = Math.floor(Math.random() * -1000000); // ID temporário negativo
        setRows((oldRows) => [...oldRows, {
            id,
            nome: '',
            cidade: '',
            estadio: '',
            isNew: true
        }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nome' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Adicionar equipe
            </Button>
        </GridToolbarContainer>
    );
}

const ListaEquipes = () => {
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/times/${id}`, {
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setRows(rows.filter((row) => row.id !== id));
            fetchEquipes();
            setFeedback({
                open: true,
                message: 'Time excluído com sucesso!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Erro ao excluir o time:', error);
            setFeedback({
                open: true,
                message: 'Erro ao excluir o time',
                severity: 'error'
            });
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {
        try {
            // Validação dos campos
            if (!newRow.nome || !newRow.cidade || !newRow.estadio) {
                throw new Error('Todos os campos são obrigatórios');
            }

            if (newRow.isNew) {
                // Se for uma nova linha, faz POST para criar
                const response = await axios.post('http://127.0.0.1:8000/api/times', {
                    nome: newRow.nome,
                    cidade: newRow.cidade,
                    estadio: newRow.estadio
                }, {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                const createdRow = {
                    ...newRow,
                    id: response.data.id,
                    isNew: false
                };

                setRows(oldRows => oldRows.map(row =>
                    row.id === newRow.id ? createdRow : row
                ));

                setFeedback({
                    open: true,
                    message: 'Time criado com sucesso!',
                    severity: 'success'
                });

                return createdRow;
            } else {
                // Se for uma linha existente, faz PUT para atualizar
                const response = await axios.put(`http://127.0.0.1:8000/api/times/${newRow.id}`, {
                    nome: newRow.nome,
                    cidade: newRow.cidade,
                    estadio: newRow.estadio
                }, {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                const updatedRow = { ...newRow, isNew: false };
                setFeedback({
                    open: true,
                    message: 'Time atualizado com sucesso!',
                    severity: 'success'
                });

                return updatedRow;
            }
        } catch (error) {
            console.error('Erro ao processar a linha:', error);
            setFeedback({
                open: true,
                message: error.message || 'Erro ao processar os dados do time. Verifique se todos os campos foram preenchidos.',
                severity: 'error'
            });
            throw error;
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const fetchEquipes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/times');
            const data = response.data.map((item) => ({
                id: item.id,
                nome: item.nome || null,
                cidade: item.cidade || null,
                estadio: item.estadio || null,
            }));
            setRows(data);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            setFeedback({
                open: true,
                message: 'Erro ao carregar os times',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipes();
    }, []);

    const columns = [
        {
            field: 'nome',
            headerName: 'Nome',
            width: 350,
            editable: true,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cidade',
            headerName: 'Cidade',
            type: 'text',
            width: 350,
            align: 'center',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'estadio',
            headerName: 'Estádio',
            type: 'text',
            width: 350,
            align: 'center',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'acoes',
            type: 'actions',
            headerName: '...',
            width: 300,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <Grid2 item xs={12} md={9}>
                <Typography sx={{ fontSize: '30px', textAlign: 'center', mb: 3, color: '#131428', fontWeight: 'bold' }}>
                    Gerenciamento de equipes
                </Typography>
            </Grid2>

            <Box
                sx={{
                    height: 650,
                    width: '70%',
                    m: 'auto',
                    border: '1px solid #131428',
                    borderRadius: '8px',
                    fontSize: '20px',
                    mb: 2, 
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: '#aaafff',
                        color: '#131428',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #131428',
                        fontSize: '20px'
                    },
                    '& .MuiDataGrid-cell': {
                        backgroundColor: '#eef4d2',
                        borderBottom: '1px solid #131428',
                        fontSize: '20px'
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    loading={loading}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{ toolbar: EditToolbar }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel, setFeedback },
                    }}
                />
            </Box>

            <Snackbar
                open={feedback.open}
                autoHideDuration={6000}
                onClose={() => setFeedback({ ...feedback, open: false })}
            >
                <Alert
                    onClose={() => setFeedback({ ...feedback, open: false })}
                    severity={feedback.severity}
                    sx={{ width: '100%' }}
                >
                    {feedback.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ListaEquipes;
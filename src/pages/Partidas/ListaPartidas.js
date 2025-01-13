import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Alert, Grid2, Snackbar, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const formatDateToDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatDateToAPI = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('-')) return dateString;
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    //.padStart: adicona 0 antes do números
};

//barra de ferramentas que adiciona partida já com os campos necessários 
function EditToolbar(props) {
    const { setRows, setRowModesModel, setFilteredRows } = props;

    //função que cria uma nova partida
    const handleClick = () => {
        console.log('Entrou');
        const id = Math.floor(Math.random());  // Temporary random ID
        const newRow = {
            id,
            equipe1: '',
            equipe2: '',
            data: '',
            golsEquipe1: 0,
            golsEquipe2: 0,
            id_time_casa: null,
            id_time_visitante: null,
            isNew: true
        };

        // Adiciona a nova linha na lista de rows e filteredRows
        setRows((oldRows) => [newRow, ...oldRows]);
        setFilteredRows((oldRows) => [newRow, ...oldRows]);

        // muda a linha para o modo de edição
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'equipe1' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Adicionar Partida
            </Button>
        </GridToolbarContainer>
    );
}


const ListaPartidas = () => {
    const [rowModesModel, setRowModesModel] = useState({}); //modo de read ou edit 
    const [rows, setRows] = useState([]);
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
    const [selectedTeam, setSelectedTeam] = useState(''); //select de filtrar 
    const [filteredRows, setFilteredRows] = useState([]); //dados filtrados

    const columns = [
        {
            field: 'equipe1',
            headerName: 'Time Casa',
            width: 300,
            editable: true,
            align: 'center',
            headerAlign: 'center',
            //propriedade que permite definir como a célula é mostrada 
            renderEditCell: (params) => (
                <Select
                    fullWidth
                    value={params.value || ''}
                    onChange={(e) => {
                        const timeSelected = times.find(t => t.nome === e.target.value);
                        console.log("time", timeSelected.id)
                        params.api.setEditCellValue({
                            id: params.id,
                            field: 'equipe1',
                            value: e.target.value
                        });
                        params.api.setEditCellValue({
                            id: params.id,
                            field: 'id_time_casa',
                            value: e.target.value
                            // value: timeSelected.id
                        });
                    }}
                >
                    {times.map((time) => (
                        <MenuItem key={time.id} value={time.nome}>
                            {time.nome}
                        </MenuItem>
                    ))}
                </Select>
            )
        },
        {
            field: 'equipe2',
            headerName: 'Time Visitante',
            width: 300,
            editable: true,
            align: 'center',
            headerAlign: 'center',
            renderEditCell: (params) => (
                <Select
                    fullWidth
                    value={params.value || ''}
                    onChange={(e) => {
                        const timeSelected = times.find(t => t.nome === e.target.value);
                        params.api.setEditCellValue({
                            id: params.id,
                            field: 'equipe2',
                            value: e.target.value
                        });
                        params.api.setEditCellValue({
                            id: params.id,
                            field: 'id_time_visitante',
                            value: e.target.value
                        });
                    }}
                >
                    {times.map((time) => (
                        <MenuItem key={time.id} value={time.nome}>
                            {time.nome}
                        </MenuItem>
                    ))}
                </Select>
            )
        },
        {
            field: 'data',
            headerName: 'Data',
            type: 'text',
            width: 200,
            editable: true,
            align: 'center',
            headerAlign: 'center',
            preProcessEditCellProps: (params) => ({
                ...params.props,
                error: params.props.value === ''
            })
        },
        {
            field: 'golsEquipe1',
            headerName: 'Gols Time Casa',
            width: 200,
            editable: true,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            preProcessEditCellProps: (params) => ({
                ...params.props,
                error: params.props.value === ''
            })
        },
        {
            field: 'golsEquipe2',
            headerName: 'Gols Time Visitante',
            width: 200,
            editable: true,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            preProcessEditCellProps: (params) => ({
                ...params.props,
                error: params.props.value === ''
            })
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 200,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            onClick={handleCancelClick(id)}
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                    />,
                ];
            },
        },
    ];

    //função que chama API com as partidas 

    const fetchPartidas = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/partidas");
            const data = response.data.map((item) => ({
                id: item.id,
                equipe1: item.time_casa.nome,
                equipe2: item.time_visitante.nome,
                id_time_casa: item.time_casa.id,
                id_time_visitante: item.time_visitante.id,
                data: formatDateToDisplay(item.data),
                golsEquipe1: item.gols_time_casa,
                golsEquipe2: item.gols_time_visitante,
            }));
            setRows(data);
            setFilteredRows(data); // Inicializa filteredRows com todos os dados
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            setFeedback({
                open: true,
                message: 'Erro ao carregar as partidas',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    //chama a função de cima na hora que a tela abrir, para renderizar a tabela
    useEffect(() => {
        fetchPartidas();
    }, []);

    //renderiza as opções de times no select
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/times');
                setTimes(response.data);
            } catch (error) {
                console.error('Erro ao carregar times:', error);
            }
        };
        fetchTimes();
    }, []);

    //filtro das partidas de acordo com o time escolhido 
    const filterMatchesByTeam = (teamId) => {
        if (!teamId) {
            setFilteredRows(rows);
        } else {
            const filtered = rows.filter(row =>
                row.id_time_casa === parseInt(teamId) ||
                row.id_time_visitante === parseInt(teamId)
            );
            setFilteredRows(filtered);
        }
    };


    //Funções de CRUD 

    //Previne que a edição seja interrompida ao clicar fora da linha.
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
        if (!window.confirm('Tem certeza que deseja excluir esta partida?')) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/partidas/${id}`, {
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json'
                }
            });

            setRows(rows.filter((row) => row.id !== id));
            setFilteredRows(filteredRows.filter((row) => row.id !== id)); // Atualiza também as linhas filtradas

            setFeedback({
                open: true,
                message: 'Partida excluída com sucesso!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Erro ao excluir a partida:', error);
            setFeedback({
                open: true,
                message: 'Erro ao excluir a partida',
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
        if (editedRow?.isNew) {
            setRows(prevRows => prevRows.filter(row => row.id !== id));
            setFilteredRows(prevRows => prevRows.filter(row => row.id !== id));
        }
    };

    //função que muda o estado de editar para read na linha 
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };



//editar ou adicionar linha 
    const processRowUpdate = async (newRow) => {
        try {
            console.log('Dados da nova linha:', newRow);
            console.log(newRow.id_time_casa);
            console.log("aqui");
            const id1 = (times.find(t => t.nome === newRow.equipe1));
            const id2 = (times.find(t => t.nome === newRow.equipe2));
            // Preparar o payload conforme esperado pelo backend
            const payload = {
                id_time_casa: id1.id,
                id_time_visitante: id2.id,
                data: formatDateToAPI(newRow.data),
                gols_time_casa: parseInt(newRow.golsEquipe1),
                gols_time_visitante: parseInt(newRow.golsEquipe2)
            };

            console.log('Payload sendo enviado:', payload);

            // Verifica se a linha é nova
            if (newRow.isNew) {
                const response = await axios.post('http://127.0.0.1:8000/api/partidas', payload, {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                // Atualizar a linha com o ID real retornado do backend
                const createdRow = {
                    ...newRow,
                    id: response.data.id,  // Use o ID retornado pela API
                    isNew: false  // Marca a linha como não nova
                };

                setFeedback({
                    open: true,
                    message: 'Partida criada com sucesso!',
                    severity: 'success'
                });
                fetchPartidas();

                return createdRow; // Retorna a linha atualizada com o ID real
            } else {
                console.log(payload)
                await axios.put(`http://127.0.0.1:8000/api/partidas/${newRow.id}`, payload, {
                    withCredentials: true,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                setFeedback({
                    open: true,
                    message: 'Partida atualizada com sucesso!',
                    severity: 'success'
                });

                return { ...newRow, isNew: false };
            }
        } catch (error) {
            console.error('Erro ao processar a linha:', error);
            setFeedback({
                open: true,
                message: error.response?.data?.message || error.message || 'Erro ao processar os dados da partida.',
                severity: 'error'
            });
            throw error;
        }
    };

    





    return (
        <>
            <Grid2 item xs={12} md={9}>
                <Typography sx={{ fontSize: '30px', textAlign: 'center', mb: 3, color: '#131428', fontWeight: 'bold' }}>
                    Gerenciamento de partidas
                </Typography>
            </Grid2>

            <Box sx={{ width: '50%', m: 'auto', mb: 3, mt: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Filtrar por Time</InputLabel>
                    <Select
                        value={selectedTeam}
                        label="Filtrar por Time"
                        onChange={(e) => {
                            setSelectedTeam(e.target.value);
                            filterMatchesByTeam(e.target.value);
                        }}
                    >
                        <MenuItem value="">
                            <em>Todos os times</em>
                        </MenuItem>
                        {times.map((time) => (
                            <MenuItem key={time.id} value={time.id}>
                                {time.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box
                sx={{
                    height: 600, width: '80%', m: 'auto', border: '1px solid #131428', borderRadius: '8px', mb: 3,
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: '#aaafff',
                        color: '#131428',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid #131428',
                    },
                    '& .MuiDataGrid-cell': {
                        backgroundColor: '#eef4d2',
                        borderBottom: '1px solid #131428',
                    },
                }}
            >
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    editMode="row"
                    loading={loading}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{ toolbar: EditToolbar }}
                    slotProps={{ toolbar: { setRows, setRowModesModel, setFilteredRows } }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    getRowId={(row) => row.id} 
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

export default ListaPartidas;
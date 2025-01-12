
import { createBrowserRouter, Navigate } from "react-router-dom";
import Base from "../Componentes/Base";
import ListaEquipes from "../pages/GerenciaEquipe/ListaEquipes";
import ListaPartidas from "../pages/Partidas/ListaPartidas";
import ListaClassifica from "../pages/Classificacao/ListaClassifica";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ListaEquipes />,
        children: []
    },
    {
        path: '*',
        element: <ListaEquipes />,
        children: []
    },
    {
        path: '/brasileirao',
        element: <Base />,
        children: [
            {
                path: 'equipes',
                element: <ListaEquipes />,
                children: []
            },
            {
                path: 'partidas',
                element: <ListaPartidas />,
                children: []
            },
            {
                path: 'classificacoes',
                element: <ListaClassifica />,
                children: []
            },
         
        ]
    }

])
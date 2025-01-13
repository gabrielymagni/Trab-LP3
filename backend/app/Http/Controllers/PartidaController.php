<?php

namespace App\Http\Controllers;

use App\Models\Partida;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PartidaController extends Controller
{

    protected $classificacaoController;

    public function __construct(ClassificacaoController $classificacaoController)
    {
        $this->classificacaoController = $classificacaoController;
    }
    public function index(): JsonResponse
    {
        $partidas = Partida::with(['timeCasa', 'timeVisitante'])->get();
        return response()->json($partidas);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|date',
            'id_time_casa' => 'required|exists:times,id',
            'gols_time_casa' => 'required|integer|min:0',
            'id_time_visitante' => 'required|exists:times,id|different:id_time_casa',
            'gols_time_visitante' => 'required|integer|min:0',
            'estadio' => 'nullable|string|max:128'
        ]);

        $partida = Partida::create($validated);
        $this->classificacaoController->atualizarClassificacao(partida: $partida);
        return response()->json($partida, 201);
    }

    public function show(Partida $partida): JsonResponse
    {
        return response()->json($partida->load(['timeCasa', 'timeVisitante']));
    }

    public function update(Request $request, Partida $partida): JsonResponse
    {
        $validated = $request->validate([
            'data' => 'required|date',
            'id_time_casa' => 'required|exists:times,id',
            'gols_time_casa' => 'required|integer|min:0',
            'id_time_visitante' => 'required|exists:times,id|different:id_time_casa',
            'gols_time_visitante' => 'required|integer|min:0',
            'estadio' => 'nullable|string|max:128'
        ]);

        $partida->update($validated);
        $this->classificacaoController->atualizarClassificacao(partida: $partida);
        return response()->json($partida);
    }

    public function destroy(Partida $partida): JsonResponse
    {
        $partida->delete();
        return response()->json(null, 204);
    }

    public function getByDate(Request $request): JsonResponse
    {
        $request->validate([
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio'
        ]);

        $partidas = Partida::with(['timeCasa', 'timeVisitante'])
            ->whereBetween('data', [$request->data_inicio, $request->data_fim])
            ->orderBy('data')
            ->get();

        return response()->json($partidas);
    }

    public function getByTeam(Request $request): JsonResponse
    {
        $request->validate([
            'time_id' => 'required|exists:times,id'
        ]);

        $partidas = Partida::with(['timeCasa', 'timeVisitante'])
            ->where('id_time_casa', $request->time_id)
            ->orWhere('id_time_visitante', $request->time_id)
            ->orderBy('data', 'desc')
            ->get();

        return response()->json($partidas);
    }
}
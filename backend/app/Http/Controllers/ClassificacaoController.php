<?php

namespace App\Http\Controllers;

use App\Models\Classificacao;
use App\Models\Partida;
use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassificacaoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'ano' => 'nullable|integer'
        ]);

        $ano = $request->input('ano', Carbon::now()->year);

        $classificacao = Classificacao::with('time')
            ->where('ano', $ano)
            ->orderByDesc('pontos')
            ->orderByDesc('saldo_gols')
            ->orderByDesc('gols_pro')
            ->get();

        return response()->json($classificacao);
    }

    public function atualizarClassificacao(Partida $partida): void
    {
        $ano = Carbon::parse($partida->data)->year;

        // Get all matches for the year
        $partidas = Partida::whereYear('data', $ano)->get();

        // Get all teams
        $times = Time::all();

        foreach ($times as $time) {
            $estatisticas = $this->calcularEstatisticas($partidas, $time->id);

            Classificacao::updateOrCreate(
                [
                    'time_id' => $time->id,
                    'ano' => $ano,
                ],
                [
                    'pontos' => $estatisticas['pontos'],
                    'jogos' => $estatisticas['jogos'],
                    'vitorias' => $estatisticas['vitorias'],
                    'empates' => $estatisticas['empates'],
                    'derrotas' => $estatisticas['derrotas'],
                    'gols_pro' => $estatisticas['gols_pro'],
                    'gols_contra' => $estatisticas['gols_contra'],
                    'saldo_gols' => $estatisticas['gols_pro'] - $estatisticas['gols_contra'],
                ]
            );
        }
    }

    private function calcularEstatisticas($partidas, $timeId): array
    {
        $estatisticas = [
            'pontos' => 0,
            'jogos' => 0,
            'vitorias' => 0,
            'empates' => 0,
            'derrotas' => 0,
            'gols_pro' => 0,
            'gols_contra' => 0
        ];

        foreach ($partidas as $partida) {
            if ($partida->id_time_casa === $timeId || $partida->id_time_visitante === $timeId) {
                $estatisticas['jogos']++;

                if ($partida->id_time_casa === $timeId) {
                    $estatisticas['gols_pro'] += $partida->gols_time_casa;
                    $estatisticas['gols_contra'] += $partida->gols_time_visitante;

                    if ($partida->gols_time_casa > $partida->gols_time_visitante) {
                        $estatisticas['vitorias']++;
                        $estatisticas['pontos'] += 3;
                    } elseif ($partida->gols_time_casa < $partida->gols_time_visitante) {
                        $estatisticas['derrotas']++;
                    } else {
                        $estatisticas['empates']++;
                        $estatisticas['pontos'] += 1;
                    }
                } else {
                    $estatisticas['gols_pro'] += $partida->gols_time_visitante;
                    $estatisticas['gols_contra'] += $partida->gols_time_casa;

                    if ($partida->gols_time_visitante > $partida->gols_time_casa) {
                        $estatisticas['vitorias']++;
                        $estatisticas['pontos'] += 3;
                    } elseif ($partida->gols_time_visitante < $partida->gols_time_casa) {
                        $estatisticas['derrotas']++;
                    } else {
                        $estatisticas['empates']++;
                        $estatisticas['pontos'] += 1;
                    }
                }
            }
        }

        return $estatisticas;
    }
}
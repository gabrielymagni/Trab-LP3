<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classificacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('time_id')->constrained('times')->onDelete('cascade');
            $table->integer('ano');
            $table->integer('pontos');
            $table->integer('jogos');
            $table->integer('vitorias');
            $table->integer('empates');
            $table->integer('derrotas');
            $table->integer('gols_pro');
            $table->integer('gols_contra');
            $table->integer('saldo_gols');
            $table->timestamps();

            // Make time_id and ano unique together to ensure one record per team per year
            $table->unique(['time_id', 'ano']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classificacoes');
    }
};
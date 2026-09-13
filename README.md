# Motores App

Sistema de cadastro de motores elétricos, com backend em Node/Express + MySQL e frontend em Angular.

## Como rodar

Pré-requisitos: Docker + Docker Compose.


docker compose up -d --build


Acesse: http://localhost:4200

A API sobe em http://localhost:3000/api

## Decisões técnicas

- Consultas ao banco usam mysql2 com queries parametrizadas (proteção contra SQL injection).
- A API espera o banco ficar disponível antes de subir de vez (retry com backoff em db.js), já que o healthcheck do MySQL pode levar alguns segundos.
- O frontend usa Angular standalone components e Reactive Forms para o formulário de cadastro.
- O projeto usa Angular 22 (versão recente, zoneless por padrão) — por isso o app.ts usa ChangeDetectorRef.markForCheck() manualmente após respostas assíncronas da API, já que não há zone.js detectando essas mudanças automaticamente.
- O build do frontend usa multi-stage Dockerfile: compila com Node e serve os arquivos estáticos finais via nginx.

## O que faria diferente com mais tempo

- Separado os commits por passo de forma mais disciplinada

Virtualização/Docker Desktop: o ambiente não tinha a virtualização habilitada
  na BIOS de início, o que travou a subida dos containers antes mesmo do projeto
  começar de verdade.
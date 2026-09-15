import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotorService, Motor, Fabricante } from './motor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  motores: Motor[] = [];
  fabricantes: Fabricante[] = [];
  carregando = false;
  erroCarregar = '';
  termoBusca = '';
  mensagemSucesso = '';

  form: FormGroup;

  mostrarForm = false;
  motorEditandoId: number | null = null;
  salvando = false;
  erroSalvar: string[] = [];

  constructor(private fb: FormBuilder, private motorService: MotorService, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      modelo: ['', Validators.required],
      fabricante_id: [null as number | null, Validators.required],
      potencia_cv: [null as number | null, [Validators.required, Validators.min(0.01)]],
      tensao: ['', Validators.required],
      frequencia_hz: [60, Validators.required],
      polos: [4, Validators.required],
      rotacao_rpm: [null as number | null, [Validators.required, Validators.min(1)]],
      carcaca: [''],
      grau_protecao: [''],
      preco: [null as number | null],
    });
  }

  ngOnInit() {
    this.carregarFabricantes();
    this.carregarMotores();
  }

  carregarFabricantes() {
    this.motorService.listarFabricantes().subscribe({
      next: (f) => { this.fabricantes = f; this.cdr.markForCheck(); },
    });
  }

  carregarMotores() {
    this.carregando = true;
    this.erroCarregar = '';
    this.motorService.listar(this.termoBusca || undefined).subscribe({
      next: (m) => { this.motores = m; this.carregando = false; this.cdr.markForCheck(); },
      error: () => { this.erroCarregar = 'Não foi possível carregar os motores.'; this.carregando = false; this.cdr.markForCheck(); },
    });
  }

  nomeFabricante(id: number): string {
    return this.fabricantes.find((f) => f.id === id)?.nome ?? '—';
  }

  excluir(motor: Motor) {
    if (!confirm(`Excluir o motor ${motor.codigo}?`)) return;
    this.motorService.excluir(motor.id!).subscribe({
      next: () => { this.avisarSucesso('Motor excluído.'); this.carregarMotores(); },
      error: () => { this.erroCarregar = 'Não foi possível excluir.'; this.cdr.markForCheck(); },
    });
  }

  avisarSucesso(msg: string) {
    this.mensagemSucesso = msg;
    this.cdr.markForCheck();
    setTimeout(() => { this.mensagemSucesso = ''; this.cdr.markForCheck(); }, 4000);
  }

  abrirNovo() {
    this.motorEditandoId = null;
    this.form.reset({ frequencia_hz: 60, polos: 4 });
    this.mostrarForm = true;
    this.erroSalvar = [];
  }

  editar(motor: Motor) {
    this.motorEditandoId = motor.id!;
    this.form.setValue({
      codigo: motor.codigo, modelo: motor.modelo, fabricante_id: motor.fabricante_id,
      potencia_cv: motor.potencia_cv, tensao: motor.tensao, frequencia_hz: motor.frequencia_hz,
      polos: motor.polos, rotacao_rpm: motor.rotacao_rpm,
      carcaca: motor.carcaca ?? '', grau_protecao: motor.grau_protecao ?? '', preco: motor.preco ?? null,
    });
    this.mostrarForm = true;
    this.erroSalvar = [];
  }

  salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    this.erroSalvar = [];
    const dados = this.form.value as Motor;
    const request = this.motorEditandoId
      ? this.motorService.atualizar(this.motorEditandoId, dados)
      : this.motorService.criar(dados);

    request.subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarForm = false;
        this.avisarSucesso(this.motorEditandoId ? 'Motor atualizado.' : 'Motor cadastrado.');
        this.carregarMotores();
      },
      error: (err) => {
        this.salvando = false;
        this.erroSalvar = err.error?.details ?? [err.error?.error ?? 'Erro ao salvar.'];
        this.cdr.markForCheck();
      },
    });
  }
}

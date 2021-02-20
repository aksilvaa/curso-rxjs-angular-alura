import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { merge, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  isLoading: Observable<any>;
  /* Itens substituidos pelo Observável acoes$, evitando assim a utilização do NgOnInit e do NgOnDestroy, pois o Angular cuidará automaticamente desse processo */
  // acoes: Acoes;
  // subscription: Subscription;
  todasAcoes$ = this.acoesService.getAcoes().pipe(
    tap(() => {
      console.log('Fluxo Inicial');
    })
  );
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO),
    tap(() => {
      console.log('Fluxo do Filtro');
    }),
    tap(console.log),
    filter(
      // Só irá passar para a próxima fase Se o valorDigitado for maior ou igual a 3 OU se não houver valorDigitado, retornando a listagem inicial
      (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
    ),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado))
  );
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) {
    this.isLoading = this.acoes$;
    this.isLoading.pipe(tap(console.log));
  }

  // ngOnInit() {
  //  this.subscription = this.acoesService.getAcoes()
  //     .subscribe((arrAcoes) => {
  //       this.acoes = arrAcoes;
  //       console.log(this.acoes);
  //     })
  // }

  // ngOnDestroy(){
  //   this.subscription.unsubscribe();
  // }
}

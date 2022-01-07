import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''

  }

  constructor( private heroeService: HeroesService,
               private activateRoute: ActivatedRoute,
               private router: Router,
               private snackBar: MatSnackBar,
               public dialog: MatDialog ) { }

  ngOnInit(): void {

    if ( !this.router.url.includes( 'editar' ) ) {
      return;
    }

    this.activateRoute.params
    .pipe(
      switchMap( ({ id }) => this.heroeService.getHeroePorId( id ) )
    )
    .subscribe( resp => this.heroe = resp );

  }

  guardar() {

    if( this.heroe.superhero.trim().length === 0 ) {
      return;
    }

    if( this.heroe.id ) {
      //actualizar
      this.heroeService.actualizarHeroe( this.heroe)
      .subscribe( resp => {
        this.mostrarSnakbar('Registro actualizado');
      } )
    } else {
      //Crear
      this.heroeService.agregarHeroe( this.heroe)
      .subscribe( heroe => {
        this.router.navigate(['/heroes/editar', heroe.id]);
        this.mostrarSnakbar('Registro creado');
      } )
    }
    
  }

  borrarHeroe() {

    const dialog= this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: { ...this.heroe}
    } );

    dialog.afterClosed().subscribe(
      ( result ) => {
        if( result ) {
          this.heroeService.borrarHeroe( this.heroe.id! )
          .subscribe( resp => {
            this.router.navigate(['/heroes']);
          } )
        }
      }
    )

    return;

    
  }

  mostrarSnakbar(mensaje: string ) {
    this.snackBar.open( mensaje, 'Cerrar', {
      duration: 2500
    });
  }

}

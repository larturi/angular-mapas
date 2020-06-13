import { Component, OnInit, Inject } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapaEditarComponent } from './mapa-editar.component';
import { FormsModule } from '@angular/forms';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  previous;

  marcadores: Marcador[] = [];

  lat = -34.63913078102763;
  lng = -58.46117093932105;

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) {

    if (localStorage.getItem('marcadores')) {
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    }

  }

  ngOnInit(): void {
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  agregarMarcador( evento) {
    const coords: {lat: number, lng: number} = evento.coords;
    const nuevoMarcador = new Marcador(coords.lat, coords.lng, 'Titulo', 'Descripcion del marcador');
    this.marcadores.push(nuevoMarcador);
    this.guardarStorage();
    this.snackBar.open('Marcador agregado', 'Cerrar', {duration: 3000});
 }

 borrarMarcador(i: number) {
    this.marcadores.splice(i, 1);
    this.guardarStorage();
    this.snackBar.open('Marcador borrado', 'Cerrar', {duration: 3000});
 }

 editarMarcador(marcador: Marcador) {
  const dialogRef = this.dialog.open(MapaEditarComponent, {
    width: '250px',
    data: {titulo: marcador.titulo, desc: marcador.descripcion}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) {
      return;
    }

    marcador.titulo = result.titulo;
    marcador.descripcion = result.desc;

    this.guardarStorage();

    this.snackBar.open('Marcador actualizado', 'Cerrar', {duration: 3000});

  });
 }

 guardarStorage() {
  localStorage.setItem('marcadores', JSON.stringify(this.marcadores));
}

}

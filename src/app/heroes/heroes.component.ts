import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Item } from './item';
import { SearchService } from './search.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  providers: [SearchService],
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Item[] = [];
  editHero: Item | undefined; // the hero currently being edited
  heroName = '';

  constructor(private heroesService: SearchService) {
    //alert('run');
  }

  @ViewChild('heroEditInput')
  set heroEditInput(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroesService
      .getHeroes()
      .subscribe((heroes) => (this.heroes = heroes));
  }

  add(name: string): void {
    this.editHero = undefined;
    name = name.trim();
    if (!name) {
      return;
    }

    // The server will generate the id for this new hero
    const newHero: Item = { name } as Item;
    this.heroesService
      .addHero(newHero)
      .subscribe((hero) => this.heroes.push(hero));
  }

  delete(hero: Item): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this.heroesService.deleteHero(hero.id).subscribe();
    /*
    // oops ... subscribe() is missing so nothing happens
    this.heroesService.deleteHero(hero.id);
    */
  }

  edit(heroName: string) {
    this.update(heroName);
    this.editHero = undefined;
  }

  search(searchTerm: string) {
    alert('##' + this.heroName);
    this.editHero = undefined;
    if (searchTerm) {
      this.heroesService
        .searchHeroes(searchTerm)
        .subscribe((heroes) => (this.heroes = heroes));
    } else {
      this.getHeroes();
    }
  }

  update(heroName: string) {
    if (heroName && this.editHero && this.editHero.name !== heroName) {
      this.heroesService
        .updateHero({ ...this.editHero, name: heroName })
        .subscribe((hero) => {
          // replace the hero in the heroes list with update from server
          const ix = hero ? this.heroes.findIndex((h) => h.id === hero.id) : -1;
          if (ix > -1) {
            this.heroes[ix] = hero;
          }
        });
      this.editHero = undefined;
    }
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

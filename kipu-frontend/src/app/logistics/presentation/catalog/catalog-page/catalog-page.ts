import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-catalog-page',
  imports: [RouterModule, TranslatePipe, MatButtonToggleModule, MatIcon],
  templateUrl: './catalog-page.html',
})
export class CatalogPage {
  private router = inject(Router);

  get activeRoute(): string {
    const url = this.router.url;
    if (url.includes('machinery-catalog')) return 'machinery-catalog';
    if (url.includes('category-catalog')) return 'category-catalog';
    return 'material-catalog';
  }

  navigate(route: string) {
    this.router.navigate(['/logistics/catalog', route]);
  }
}

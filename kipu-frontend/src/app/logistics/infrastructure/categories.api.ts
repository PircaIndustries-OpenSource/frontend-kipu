import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoryEntity } from '../domain/category.entity';
import { CategoriesResponse, CategoryResource } from './materials/categories.response';
import { CategoriesAssembler } from './materials/categories.assembler';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApi {
  http = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrlLocal;
  categoriesEndpoint = environment.kipuApiCategoriesEndPath;

  getAllCategories(): Observable<CategoryEntity[]> {
    return this.http
      .get<CategoriesResponse>(`${this.apiBaseUrl}${this.categoriesEndpoint}`)
      .pipe(map((response) => CategoriesAssembler.toEntitiesFromResponse(response)));
  }
  postCategory(category: CategoryEntity): Observable<CategoryEntity> {
    return this.http
      .post<CategoryResource>(`${this.apiBaseUrl}${this.categoriesEndpoint}`, category)
      .pipe(map((response) => CategoriesAssembler.toEntityFromResource(response)));
  }
}

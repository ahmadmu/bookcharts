import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OpenApiResponse {
  docs: OpenApiDoc[];
}

export interface OpenApiDoc {
  key: string;
  title: string,
  id_goodreads: string[];
  subject: string[]
  isbn: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OpenLibService {

  private API_URL = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) { }

  fetchWorkFromOpenLibraryWithIsbn(isbns: string[]): Observable<OpenApiResponse> {
    const isbnQuery = isbns.map(id => 'isbn:' + id).join('+OR+');
    const query = `?q=${isbnQuery}&fields=key,title,subject,isbn`;
    return this.http.get<OpenApiResponse>(this.API_URL + query);
  }

  fetchWorkFromOpenLibraryWithGRId(grId: string[]): Observable<OpenApiResponse> {
    const grQuery = grId.map(id => 'id_goodreads:' + id).join('+OR+');
    const query = `?q=${grQuery}&fields=key,title,subject,id_goodreads`;
    return this.http.get<OpenApiResponse>(this.API_URL + query);
  }
}

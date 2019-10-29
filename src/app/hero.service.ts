import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import{of, Observable} from 'rxjs';
import{catchError,map,tap} from 'rxjs/operators';
import{Hero}from './hero';
import{MessageService} from '../app/message.service';
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl='api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_=>this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[])));
  }
  getHero(id:number):Observable<Hero>{
    const url=`${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  private log(message:string){
    this.messageService.add(`HeroService:${message}`);
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** put: update the hero on the server */
  updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl,hero,this.httpOptions).pipe(
      tap(_=>this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
/** POST: add a new hero to the server */
  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl,hero,this.httpOptions).pipe(
      tap((newHero:Hero)=>this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  deleteHero(hero:Hero|number):Observable<Hero>{
    const id=typeof hero==='number'?hero:hero.id;
    const url=`${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url,this.httpOptions).pipe
    (
      tap(_=>this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  /** GET heroes whose name contains search term */
  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_=>this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHero',[]))
    );
  }
  constructor(
    private messageService: MessageService,
    private http:HttpClient,
  ) { }
}

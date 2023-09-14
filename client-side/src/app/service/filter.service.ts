import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public isFilterApplied = new BehaviorSubject<boolean>(false);
  public appliedFiltersKey = 'appliedFilters';
  public filters = new BehaviorSubject<any>({});
  public appliedFiltersSubject = new BehaviorSubject<Filter | null>(
    this.getStoredFilters() || null
  );

  public getStoredFilters(): Filter | null {
    const storedFilters = localStorage.getItem(this.appliedFiltersKey);
    if (storedFilters) {
      try {
        return JSON.parse(storedFilters);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  getAppliedFilters(): Observable<Filter | null> {
    return this.appliedFiltersSubject.asObservable();

  }

 setAppliedFilters(filters: Filter) {
    localStorage.setItem(this.appliedFiltersKey, JSON.stringify(filters));
    this.appliedFiltersSubject.next(filters);
  }

  clearAppliedFilters() {
    localStorage.removeItem(this.appliedFiltersKey);
    this.appliedFiltersSubject.next(null);
  }

}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  async isStoragePersisted() {
    return await navigator.storage && navigator.storage.persisted &&
      navigator.storage.persisted();
  }

  async persist() {
    return await navigator.storage && navigator.storage.persist &&
      navigator.storage.persist();
  }



}


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

  async getStorageInfo() {
    const [storagePersisted, quota, permission] = await Promise.all([
      navigator.storage && navigator.storage.persisted && navigator.storage.persisted(),
      navigator.storage && navigator.storage.estimate && navigator.storage.estimate(),
      navigator.permissions && navigator.permissions.query && navigator.permissions.query({
        name: 'persistent-storage'
      })
    ]);
    return { storagePersisted, quota, permission: permission.state };
  }

}


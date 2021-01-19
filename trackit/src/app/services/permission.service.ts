import { Injectable } from '@angular/core';

export type PermissionInfo = {
  storagePersisted: boolean;
  quota: StorageEstimate;
  permission: PermissionState;
};

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  async isStoragePersisted() {
    return await navigator.storage?.persisted?.();
  }

  async persist() {
    return await navigator.storage?.persist?.();
  }

  async getStorageInfo(): Promise<PermissionInfo> {
    const [storagePersisted, quota, permission] = await Promise.all([
      navigator.storage?.persisted?.(),
      navigator.storage?.estimate?.(),
      navigator.permissions?.query?.({ name: 'persistent-storage' }),
    ]);
    return { storagePersisted, quota, permission: permission.state };
  }
}

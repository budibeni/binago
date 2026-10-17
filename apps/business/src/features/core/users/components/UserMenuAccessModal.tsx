'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@adatrack/utils';
import { Dialog, Button, Switch, toast, Spinner } from '@adatrack/ui';
import { Shield, RotateCcw, Search, CheckCircle2, Sliders, CheckSquare, Square } from 'lucide-react';
import type { TenantUser } from '../hooks/useUsers';

interface MenuItemAccess {
  menu_id: number;
  module_id: number;
  module_code: string;
  module_name: string;
  menu_code: string;
  menu_name: string;
  path: string;
  sort_order: number;
  can_view: boolean;
  role_can_view: boolean;
  has_custom_override: boolean;
}

interface UserMenuAccessModalProps {
  user: TenantUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserMenuAccessModal({ user, open, onOpenChange, onSuccess }: UserMenuAccessModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [search, setSearch] = useState('');
  const [menus, setMenus] = useState<MenuItemAccess[]>([]);

  const fetchMenuAccess = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get<{ status: string; data: { user_id: number; role_code: string; menus: MenuItemAccess[] } }>(
        `/access/users/${user.id}/menu`
      );
      if (res && res.data && res.data.menus) {
        setMenus(res.data.menus);
      } else {
        setMenus([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch user menu access', err);
      toast.error(err.message || 'Gagal memuat konfigurasi akses menu pengguna');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user) {
      fetchMenuAccess();
      setSearch('');
    }
  }, [open, user, fetchMenuAccess]);

  const toggleMenu = (menuId: number) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.menu_id === menuId) {
          return {
            ...m,
            can_view: !m.can_view,
            has_custom_override: true,
          };
        }
        return m;
      })
    );
  };

  const setModuleMenus = (moduleCode: string, canView: boolean) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.module_code === moduleCode) {
          return {
            ...m,
            can_view: canView,
            has_custom_override: true,
          };
        }
        return m;
      })
    );
  };

  const handleResetToRole = async () => {
    if (!user) return;
    setResetting(true);
    try {
      await api.delete(`/access/users/${user.id}/menu`);
      toast.success('Akses menu berhasil dikembalikan ke bawaan role');
      await fetchMenuAccess();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengembalikan akses ke bawaan role');
    } finally {
      setResetting(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const items = menus.map((m) => ({
        menu_id: m.menu_id,
        can_view: m.can_view,
      }));
      await api.post(`/access/users/${user.id}/menu`, { items });
      toast.success('Konfigurasi akses menu pengguna berhasil disimpan');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan konfigurasi akses menu');
    } finally {
      setSaving(false);
    }
  };

  // Group menus by module
  const groupedMenus = useMemo(() => {
    const s = search.toLowerCase();
    const filtered = menus.filter(
      (m) =>
        m.menu_name.toLowerCase().includes(s) ||
        m.path.toLowerCase().includes(s) ||
        m.module_name.toLowerCase().includes(s)
    );

    const groups: Record<string, { moduleName: string; moduleCode: string; items: MenuItemAccess[] }> = {};
    for (const item of filtered) {
      if (!groups[item.module_code]) {
        groups[item.module_code] = {
          moduleName: item.module_name,
          moduleCode: item.module_code,
          items: [],
        };
      }
      groups[item.module_code].items.push(item);
    }
    return Object.values(groups);
  }, [menus, search]);

  const totalMenus = menus.length;
  const activeMenusCount = menus.filter((m) => m.can_view).length;
  const customOverridesCount = menus.filter((m) => m.has_custom_override).length;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Akses Menu: {user.full_name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Email: <span className="font-mono text-foreground">{user.email}</span> &bull; Role Bawaan:{' '}
                <span className="font-medium text-foreground">{user.role_name || user.role_code}</span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToRole}
            disabled={resetting || saving || loading || customOverridesCount === 0}
            className="text-xs h-8 gap-1.5 shrink-0"
            title="Hapus semua override kustom dan gunakan setelan role"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Role
          </Button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {activeMenusCount} / {totalMenus} Menu Aktif
            </span>
            {customOverridesCount > 0 && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-medium">
                {customOverridesCount} Override Kustom
              </span>
            )}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <Spinner className="w-6 h-6 text-primary" />
            <p className="text-xs">Memuat konfigurasi hak akses menu...</p>
          </div>
        ) : groupedMenus.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Tidak ada menu yang sesuai dengan pencarian.
          </div>
        ) : (
          groupedMenus.map((group) => {
            const allActive = group.items.every((i) => i.can_view);
            const noneActive = group.items.every((i) => !i.can_view);

            return (
              <div key={group.moduleCode} className="border border-border rounded-xl bg-card overflow-hidden">
                <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs tracking-wider uppercase text-foreground">
                      {group.moduleName}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      ({group.items.filter((i) => i.can_view).length}/{group.items.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModuleMenus(group.moduleCode, true)}
                      className="text-[11px] text-primary hover:underline font-medium px-2 py-0.5 rounded hover:bg-primary/5"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-muted-foreground/40 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => setModuleMenus(group.moduleCode, false)}
                      className="text-[11px] text-muted-foreground hover:text-foreground font-medium px-2 py-0.5 rounded hover:bg-muted"
                    >
                      Batal Semua
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-border/60">
                  {group.items.map((item) => (
                    <div
                      key={item.menu_id}
                      className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{item.menu_name}</span>
                          <span className="text-xs font-mono text-muted-foreground">({item.path})</span>
                          {item.has_custom_override ? (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                              Kustom
                            </span>
                          ) : (
                            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                              Bawaan Role
                            </span>
                          )}
                        </div>
                      </div>

                      <Switch
                        id={`user-menu-${item.menu_id}`}
                        checked={item.can_view}
                        onCheckedChange={() => toggleMenu(item.menu_id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card flex items-center justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={saving}>
          Batal
        </Button>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving || loading}>
          {saving ? 'Menyimpan...' : 'Simpan Akses Menu'}
        </Button>
      </div>
    </Dialog>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@adatrack/utils';
import { Dialog, Button, Switch, toast, Spinner } from '@adatrack/ui';
import { Shield, Search, CheckCircle2 } from 'lucide-react';
import type { Role } from '../hooks/useRoles';

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
}

interface RoleMenuAccessModalProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RoleMenuAccessModal({ role, open, onOpenChange, onSuccess }: RoleMenuAccessModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [menus, setMenus] = useState<MenuItemAccess[]>([]);

  const fetchMenuAccess = React.useCallback(async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res: any = await api.get(`/access/roles/${role.code}/menu`);
      const menuList = Array.isArray(res) ? res : res?.data || [];
      setMenus(menuList);
    } catch (err: any) {
      console.error('Failed to fetch role menu access', err);
      toast.error(err.message || 'Gagal memuat konfigurasi akses menu role');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (open && role) {
      fetchMenuAccess();
      setSearch('');
    }
  }, [open, role, fetchMenuAccess]);

  const toggleMenu = (menuId: number) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.menu_id === menuId) {
          return { ...m, can_view: !m.can_view };
        }
        return m;
      })
    );
  };

  const setModuleMenus = (moduleCode: string, canView: boolean) => {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.module_code === moduleCode) {
          return { ...m, can_view: canView };
        }
        return m;
      })
    );
  };

  const handleSave = async () => {
    if (!role) return;
    setSaving(true);
    try {
      const items = menus.map((m) => ({
        menu_id: m.menu_id,
        can_view: m.can_view,
      }));
      await api.post(`/access/roles/${role.code}/menu`, { items });
      toast.success('Konfigurasi akses menu role berhasil disimpan');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan akses menu role');
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

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Hak Akses Menu Role: {role.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kode Role: <span className="font-mono text-foreground font-medium">{role.code}</span>
              {role.is_system && (
                <span className="ml-2 inline-flex items-center bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-medium">
                  Sistem Bawaan
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {activeMenusCount} / {totalMenus} Menu Dapat Diakses
            </span>
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
            <p className="text-xs">Memuat daftar menu...</p>
          </div>
        ) : groupedMenus.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Tidak ada menu yang sesuai dengan pencarian.
          </div>
        ) : (
          groupedMenus.map((group) => {
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
                        </div>
                      </div>

                      <Switch
                        id={`role-menu-${item.menu_id}`}
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

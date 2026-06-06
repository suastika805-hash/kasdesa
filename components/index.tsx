// components/index.tsx
// Semua komponen UI dikumpulkan di sini

import React from "react";
import type { Payment, PaymentDetail, PeriodStats } from "@/types";

// ── Helpers ──────────────────────────────────────────────

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ── StatsCards ───────────────────────────────────────────

export function StatsCards({ stats }: { stats: PeriodStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {[
        { label: "Total Warga", value: stats.total, color: "text-gray-800" },
        { label: "Sudah Bayar", value: stats.paid, color: "text-teal-700" },
        { label: "Belum Bayar", value: stats.unpaid, color: "text-amber-700" },
        { label: "Terkumpul", value: formatRp(stats.totalCollected), color: "text-blue-700", small: true },
      ].map((s) => (
        <div key={s.label} className="bg-gray-100 rounded-lg p-3">
          <p className="text-xs text-gray-550 mb-1">{s.label}</p>
          <p className={`font-semibold ${s.color} ${s.small ? "text-sm mt-1" : "text-2xl"}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── MemberCard ───────────────────────────────────────────

export function MemberCard({
  payment,
  onToggle,
  onEdit,
  onDelete,
}: {
  payment: PaymentDetail;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {��─────────────────────────────────

export function MemberCard({
  payment,
  onToggle,
  onEdit,
  onDelete,
}: {
  payment: Payment;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isPaid = payment.status === "lunas";
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors shadow-sm">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
          isPaid ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800"
        }`}
      >
        {initials(payment.member_name)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{payment.member_name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {isPaid && payment.paid_at
            ? `Bayar: ${new Date(payment.paid_at).toLocaleDateString("id-ID")}`
            : formatRp(payment.amount)}
        </p>
      </div>

      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          isPaid ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800"
        }`}
      >
        {isPaid ? "✓ Lunas" : "⏳ Belum"}
      </span>

      <div className="flex gap-1">
        <button
          onClick={onToggle}
          title={isPaid ? "Batalkan" : "Tandai Lunas"}
          className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
            isPaid
              ? "border-gray-200 text-gray-600 hover:bg-gray-50"
              : "border-teal-500 bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {isPaid ? "Batal" : "Lunas"}
        </button>
        <button
          onClick={onEdit}
          title="Edit"
          className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          title="Hapus"
          className="px-2.5 py-1.5 text-xs rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

// ── Modal wrapper ─────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-teal-500 transition-colors";

// ── AddPeriodModal ────────────────────────────────────────

const MONTHS_FULL = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function AddPeriodModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: { name: string; month: number; year: number; amount: number }, members: string[]) => void;
}) {
  const now = new Date();
  const [name, setName] = React.useState("Iuran Keamanan & Kebersihan");
  const [month, setMonth] = React.useState(now.getMonth() + 1);
  const [year, setYear] = React.useState(now.getFullYear());
  const [amount, setAmount] = React.useState(50000);
  const [members, setMembers] = React.useState([""]);

  function handleSave() {
    const clean = members.filter((m) => m.trim());
    if (!clean.length) return alert("Tambahkan minimal satu warga.");
    onSave({ name, month, year, amount }, clean);
  }

  return (
    <Modal title="Buat Tagihan Baru" onClose={onClose}>
      <FormGroup label="Nama Iuran">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </FormGroup>
      <div className="grid grid-cols-2 gap-3">
        <FormGroup label="Bulan">
          <select className={inputClass} value={month} onChange={(e) => setMonth(+e.target.value)}>
            {MONTHS_FULL.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Tahun">
          <input type="number" className={inputClass} value={year} onChange={(e) => setYear(+e.target.value)} />
        </FormGroup>
      </div>
      <FormGroup label="Nominal (Rp)">
        <input type="number" className={inputClass} value={amount} onChange={(e) => setAmount(+e.target.value)} min={0} />
      </FormGroup>
      <FormGroup label={`Daftar Warga (${members.filter(Boolean).length})`}>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-2">
          {members.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                value={m}
                placeholder={`Warga ${i + 1}`}
                onChange={(e) => setMembers((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <button
                onClick={() => setMembers((prev) => prev.filter((_, j) => j !== i))}
                className="px-2 text-red-400 hover:text-red-600 border border-red-100 rounded-lg hover:bg-red-50"
              >✕</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setMembers((p) => [...p, ""])}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          + Tambah Baris
        </button>
      </FormGroup>
      <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 mt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
        <button onClick={handleSave} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">Buat Tagihan</button>
      </div>
    </Modal>
  );
}

// ── AddMemberModal ────────────────────────────────────────

export function AddMemberModal({
  defaultAmount,
  onClose,
  onSave,
}: {
  defaultAmount: number;
  onClose: () => void;
  onSave: (name: string, amount: number) => void;
}) {
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState(defaultAmount);
  return (
    <Modal title="Tambah Warga / Siswa" onClose={onClose}>
      <FormGroup label="Nama Lengkap">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama warga..." />
      </FormGroup>
      <FormGroup label="Nominal (Rp)">
        <input type="number" className={inputClass} value={amount} onChange={(e) => setAmount(+e.target.value)} />
      </FormGroup>
      <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 mt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
        <button
          onClick={() => name.trim() && onSave(name.trim(), amount)}
          className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >Tambah</button>
      </div>
    </Modal>
  );
}

// ── EditPaymentModal ──────────────────────────────────────

export function EditPaymentModal({
  pay,
  onClose,
  onSave,
}: {
  pay: Payment;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Pick<Payment, "member_name" | "amount" | "notes">>) => void;
}) {
  const [name, setName] = React.useState(pay.member_name);
  const [amount, setAmount] = React.useState(pay.amount);
  const [notes, setNotes] = React.useState(pay.notes || "");
  return (
    <Modal title="Edit Data Tagihan" onClose={onClose}>
      <FormGroup label="Nama Warga">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </FormGroup>
      <FormGroup label="Nominal (Rp)">
        <input type="number" className={inputClass} value={amount} onChange={(e) => setAmount(+e.target.value)} />
      </FormGroup>
      <FormGroup label="Catatan">
        <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional..." />
      </FormGroup>
      <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 mt-2">
        <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
        <button
          onClick={() => onSave(pay.id, { member_name: name, amount, notes })}
          className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >Simpan</button>
      </div>
    </Modal>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-sm w-full shadow-xl">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{description}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">🗑️ Hapus</button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────

export function Toast({ message, type = "success" }: { message: string; type?: "success" | "warning" }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl z-[300] flex items-center gap-2 shadow-lg animate-in slide-in-from-bottom-2">
      <span>{type === "success" ? "✅" : "⚠️"}</span>
      {message}
    </div>
  );
}


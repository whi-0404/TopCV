import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { skillApi, SkillResponse, SkillRequest } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const SkillManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillResponse | null>(null);
  const [form, setForm] = useState<SkillRequest>({ name: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState<SkillResponse | null>(null);

  useEffect(() => { fetchSkills(); }, []);
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await skillApi.getAllSkills();
      setSkills(res.result || []);
    } catch (e) { setError('Không thể tải danh sách kỹ năng'); }
    setLoading(false);
  };
  const openAdd = () => { setEditingSkill(null); setForm({ name: '', description: '' }); setShowModal(true); };
  const openEdit = (skill: SkillResponse) => { setEditingSkill(skill); setForm({ name: skill.name, description: skill.description }); setShowModal(true); };
  const handleSave = async () => {
    try {
      if (editingSkill) await skillApi.updateSkill(editingSkill.id, form);
      else await skillApi.createSkill(form);
      setShowModal(false); fetchSkills();
    } catch { setError('Lưu thất bại'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await skillApi.deleteSkill(confirmDelete.id); setConfirmDelete(null); fetchSkills(); } catch { setError('Xoá thất bại'); }
  };
  if (!user || user.role !== 'ADMIN') return <Layout><div className="p-8 text-center text-red-600 font-bold">Không có quyền truy cập</div></Layout>;
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Quản lý Kỹ năng</h1>
        <button onClick={openAdd} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Thêm kỹ năng</button>
        {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">{error}</div> : (
          <table className="min-w-full border"><thead><tr><th className="border px-4 py-2">Tên</th><th className="border px-4 py-2">Mô tả</th><th className="border px-4 py-2">Hành động</th></tr></thead><tbody>
            {skills.map(skill => (
              <tr key={skill.id}><td className="border px-4 py-2">{skill.name}</td><td className="border px-4 py-2">{skill.description}</td><td className="border px-4 py-2">
                <button onClick={() => openEdit(skill)} className="mr-2 text-blue-600">Sửa</button>
                <button onClick={() => setConfirmDelete(skill)} className="text-red-600">Xoá</button>
              </td></tr>
            ))}
          </tbody></table>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-lg font-bold mb-4">{editingSkill ? 'Sửa' : 'Thêm'} kỹ năng</h2>
              <input className="border w-full mb-3 px-2 py-1" placeholder="Tên kỹ năng" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <textarea className="border w-full mb-3 px-2 py-1" placeholder="Mô tả" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-3 py-1">Huỷ</button>
                <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Lưu</button>
              </div>
            </div>
          </div>
        )}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-80">
              <div className="mb-4">Xác nhận xoá kỹ năng <b>{confirmDelete.name}</b>?</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmDelete(null)} className="px-3 py-1">Huỷ</button>
                <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Xoá</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default SkillManagementPage; 
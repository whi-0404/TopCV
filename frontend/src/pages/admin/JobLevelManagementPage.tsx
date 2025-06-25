import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { jobLevelApi, JobLevelResponse, JobLevelRequest } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const JobLevelManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [jobLevels, setJobLevels] = useState<JobLevelResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<JobLevelResponse | null>(null);
  const [form, setForm] = useState<JobLevelRequest>({ name: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState<JobLevelResponse | null>(null);

  useEffect(() => { fetchJobLevels(); }, []);
  const fetchJobLevels = async () => {
    setLoading(true);
    try {
      const res = await jobLevelApi.getAllJobLevels();
      setJobLevels(res.result || []);
    } catch (e) { setError('Không thể tải danh sách cấp bậc'); }
    setLoading(false);
  };
  const openAdd = () => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); };
  const openEdit = (jl: JobLevelResponse) => { setEditing(jl); setForm({ name: jl.name, description: jl.description }); setShowModal(true); };
  const handleSave = async () => {
    try {
      if (editing) await jobLevelApi.updateJobLevel(editing.id, form);
      else await jobLevelApi.createJobLevel(form);
      setShowModal(false); fetchJobLevels();
    } catch { setError('Lưu thất bại'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await jobLevelApi.deleteJobLevel(confirmDelete.id); setConfirmDelete(null); fetchJobLevels(); } catch { setError('Xoá thất bại'); }
  };
  if (!user || user.role !== 'ADMIN') return <Layout><div className="p-8 text-center text-red-600 font-bold">Không có quyền truy cập</div></Layout>;
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Quản lý Cấp bậc công việc</h1>
        <button onClick={openAdd} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Thêm cấp bậc</button>
        {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">{error}</div> : (
          <table className="min-w-full border"><thead><tr><th className="border px-4 py-2">Tên</th><th className="border px-4 py-2">Mô tả</th><th className="border px-4 py-2">Hành động</th></tr></thead><tbody>
            {jobLevels.map(jl => (
              <tr key={jl.id}><td className="border px-4 py-2">{jl.name}</td><td className="border px-4 py-2">{jl.description}</td><td className="border px-4 py-2">
                <button onClick={() => openEdit(jl)} className="mr-2 text-blue-600">Sửa</button>
                <button onClick={() => setConfirmDelete(jl)} className="text-red-600">Xoá</button>
              </td></tr>
            ))}
          </tbody></table>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-lg font-bold mb-4">{editing ? 'Sửa' : 'Thêm'} cấp bậc</h2>
              <input className="border w-full mb-3 px-2 py-1" placeholder="Tên cấp bậc" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
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
              <div className="mb-4">Xác nhận xoá cấp bậc <b>{confirmDelete.name}</b>?</div>
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
export default JobLevelManagementPage; 
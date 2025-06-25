import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { jobTypeApi, JobTypeResponse, JobTypeRequest } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const JobTypeManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [jobTypes, setJobTypes] = useState<JobTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<JobTypeResponse | null>(null);
  const [form, setForm] = useState<JobTypeRequest>({ name: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState<JobTypeResponse | null>(null);

  useEffect(() => { fetchJobTypes(); }, []);
  const fetchJobTypes = async () => {
    setLoading(true);
    try {
      const res = await jobTypeApi.getAllJobTypes();
      setJobTypes(res.result || []);
    } catch (e) { setError('Không thể tải danh sách loại công việc'); }
    setLoading(false);
  };
  const openAdd = () => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); };
  const openEdit = (jt: JobTypeResponse) => { setEditing(jt); setForm({ name: jt.name, description: jt.description }); setShowModal(true); };
  const handleSave = async () => {
    try {
      if (editing) await jobTypeApi.updateJobType(editing.id, form);
      else await jobTypeApi.createJobType(form);
      setShowModal(false); fetchJobTypes();
    } catch { setError('Lưu thất bại'); }
  };
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await jobTypeApi.deleteJobType(confirmDelete.id); setConfirmDelete(null); fetchJobTypes(); } catch { setError('Xoá thất bại'); }
  };
  if (!user || user.role !== 'ADMIN') return <Layout><div className="p-8 text-center text-red-600 font-bold">Không có quyền truy cập</div></Layout>;
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Quản lý Loại công việc</h1>
        <button onClick={openAdd} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Thêm loại công việc</button>
        {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">{error}</div> : (
          <table className="min-w-full border"><thead><tr><th className="border px-4 py-2">Tên</th><th className="border px-4 py-2">Mô tả</th><th className="border px-4 py-2">Hành động</th></tr></thead><tbody>
            {jobTypes.map(jt => (
              <tr key={jt.id}><td className="border px-4 py-2">{jt.name}</td><td className="border px-4 py-2">{jt.description}</td><td className="border px-4 py-2">
                <button onClick={() => openEdit(jt)} className="mr-2 text-blue-600">Sửa</button>
                <button onClick={() => setConfirmDelete(jt)} className="text-red-600">Xoá</button>
              </td></tr>
            ))}
          </tbody></table>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-lg font-bold mb-4">{editing ? 'Sửa' : 'Thêm'} loại công việc</h2>
              <input className="border w-full mb-3 px-2 py-1" placeholder="Tên loại công việc" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
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
              <div className="mb-4">Xác nhận xoá loại công việc <b>{confirmDelete.name}</b>?</div>
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
export default JobTypeManagementPage; 
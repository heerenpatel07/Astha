"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch("/api/gallery");
    if (res.ok) {
      const data = await res.json();
      setImages(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsAdding(false);
      setFormData({});
      fetchImages();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this image?")) {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) fetchImages();
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Manage Gallery</h1>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Image
          </button>
        )}
      </div>

      {isAdding && (
        <div className="admin-card" style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3>Add New Image</h3>
            <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
          <form onSubmit={handleSave}>
            <div className="admin-form-group">
              <label>Image URL</label>
              <input type="text" className="admin-input" required value={formData.url || ""} onChange={e => setFormData({...formData, url: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Short Description / Alt Text</label>
              <input type="text" className="admin-input" required value={formData.alt || ""} onChange={e => setFormData({...formData, alt: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Order Number (Lower appears first)</label>
              <input type="number" className="admin-input" required value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <button type="submit" className="btn btn-primary">Upload</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {loading ? <p>Loading...</p> : images.map(img => (
          <div key={img.id} className="admin-card" style={{ padding: '10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />
            <div style={{ padding: '10px 5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>{img.alt}</span>
              <button onClick={() => handleDelete(img.id)} style={{ background: 'none', border: 'none', color: '#ff3232', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

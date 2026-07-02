"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  images: string;
  active: boolean;
  order: number;
  slug: string;
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingAlbumImg, setUploadingAlbumImg] = useState(false);
  const [albumImages, setAlbumImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Service>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    if (res.ok) {
      const data = await res.json();
      setServices(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `/api/services/${formData.id}` : "/api/services";

    const payload = {
      ...formData,
      images: albumImages
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsEditing(false);
      setFormData({});
      setAlbumImages([]);
      fetchServices();
    } else {
      alert("Error saving service");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchServices();
      }
    }
  };

  const toggleActive = async (service: Service) => {
    await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !service.active }),
    });
    fetchServices();
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, thumbnail: data.url }));
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleAlbumUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAlbumImg(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAlbumImages(prev => [...prev, data.url]);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploadingAlbumImg(false);
    }
  };

  if (isEditing) {
    return (
      <div>
        <div className="admin-header">
          <h2>{formData.id ? "Edit Service" : "Add New Service"}</h2>
          <button className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
        <div className="admin-card">
          <form onSubmit={handleSave}>
            <div className="admin-form-group">
              <label>Service Name</label>
              <input 
                type="text" 
                className="admin-input" 
                required 
                value={formData.name || ""}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="admin-form-group">
              <label>Service Image Thumbnail</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type="file"
                    id="thumbnail-file-input"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="thumbnail-file-input"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px dashed var(--glass-border)",
                      borderRadius: "var(--border-radius)",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9rem",
                      transition: "var(--transition)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.borderColor = "var(--accent-orange)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }}
                  >
                    {uploadingThumbnail ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Choose Image File
                      </>
                    )}
                  </label>
                  <small style={{ color: "var(--text-muted)", display: "block" }}>
                    Select an image file (PNG, JPG, WEBP, or SVG) from your computer. If empty, the website will display your company name as text.
                  </small>
                </div>
                
                {formData.thumbnail && (
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "15px", 
                    padding: "10px 15px", 
                    background: "rgba(255, 255, 255, 0.02)", 
                    borderRadius: "var(--border-radius)", 
                    border: "1px solid var(--glass-border)", 
                    width: "fit-content",
                    marginTop: "5px"
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.thumbnail} alt="Thumbnail Preview" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "4px" }} />
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{formData.thumbnail}</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, thumbnail: "" }))} 
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "#ff5252", 
                        cursor: "pointer", 
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-form-group" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "20px", marginTop: "20px" }}>
              <label style={{ fontSize: "1.1rem", color: "var(--text-main)", marginBottom: "15px", display: "block" }}>Service Album (Additional Gallery Images)</label>
              
              {albumImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                  {albumImages.map((imgUrl, idx) => (
                    <div key={idx} style={{ position: 'relative', borderRadius: '4px', border: '1px solid var(--glass-border)', padding: '5px', background: 'rgba(255, 255, 255, 0.02)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt={`Album Preview ${idx}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '2px' }} />
                      <button 
                        type="button" 
                        onClick={() => setAlbumImages(prev => prev.filter((_, i) => i !== idx))}
                        style={{ 
                          position: 'absolute', 
                          top: '5px', 
                          right: '5px', 
                          background: 'rgba(255, 82, 82, 0.9)', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: '22px', 
                          height: '22px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          cursor: 'pointer', 
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          padding: 0
                        }}
                        title="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {albumImages.length < 4 && (
                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    id="album-file-input"
                    accept="image/*"
                    onChange={handleAlbumUpload}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="album-file-input"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed var(--glass-border)',
                      borderRadius: 'var(--border-radius)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.borderColor = "var(--accent-orange)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }}
                  >
                    {uploadingAlbumImg ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Uploading to Album...
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add Image to Album ({albumImages.length}/4)
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
            <div className="admin-form-group">
              <label>Order (Number)</label>
              <input 
                type="number" 
                className="admin-input" 
                required 
                value={formData.order || 0}
                onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
              />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea 
                className="admin-textarea" 
                required 
                value={formData.description || ""}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="active"
                checked={formData.active ?? true}
                onChange={e => setFormData({...formData, active: e.target.checked})}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="active" style={{ marginBottom: 0 }}>Service is Active (Visible on site)</label>
            </div>
            <button type="submit" className="btn btn-primary">Save Service</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Manage Services</h1>
        <button className="btn btn-primary" onClick={() => { setFormData({ active: true, order: 0 }); setAlbumImages([]); setIsEditing(true); }}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Add New Service
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Thumbnail</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>No services found. Add one above!</td></tr>
            ) : (
              services.map(service => (
                <tr key={service.id}>
                  <td>{service.order}</td>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.thumbnail} alt="thumb" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>{service.name}</td>
                  <td>
                    <button 
                      onClick={() => toggleActive(service)}
                      style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        border: 'none',
                        background: service.active ? 'rgba(0, 200, 83, 0.2)' : 'rgba(255, 50, 50, 0.2)',
                        color: service.active ? '#00c853' : '#ff3232',
                        cursor: 'pointer'
                      }}
                    >
                      {service.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { 
                        setFormData(service); 
                        let imgs: string[] = [];
                        try {
                          if (service.images) {
                            imgs = JSON.parse(service.images);
                          }
                        } catch (e) {
                          console.error("Failed to parse album images:", e);
                        }
                        setAlbumImages(imgs);
                        setIsEditing(true); 
                      }} style={{ background: 'none', border: 'none', color: 'var(--metallic-silver)', cursor: 'pointer' }}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(service.id)} style={{ background: 'none', border: 'none', color: '#ff3232', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

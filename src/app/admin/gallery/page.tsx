"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({ order: 0 });

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
    if (!formData.url) {
      alert("Please upload an image or enter an image URL.");
      return;
    }

    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsAdding(false);
      setFormData({ order: 0 });
      fetchImages();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this image?")) {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) fetchImages();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData(prev => ({ ...prev, url: result.url }));
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Manage Gallery</h1>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => { setFormData({ order: 0 }); setIsAdding(true); }}>
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
              <label>Gallery Image File</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type="file"
                    id="gallery-file-input"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="gallery-file-input"
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
                    {uploading ? (
                      <>
                        <Loader2 size={16} style={{ animation: "spin 1.5s linear infinite" }} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Choose Image File
                      </>
                    )}
                  </label>
                </div>
                
                {formData.url && (
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
                    <img src={formData.url} alt="Gallery Preview" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "4px" }} />
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{formData.url}</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, url: "" }))} 
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

            <div className="admin-form-group">
              <label>Or Image URL (External link)</label>
              <input type="text" className="admin-input" value={formData.url || ""} onChange={e => setFormData({...formData, url: e.target.value})} />
            </div>
            
            <div className="admin-form-group">
              <label>Short Description / Alt Text</label>
              <input type="text" className="admin-input" required value={formData.alt || ""} onChange={e => setFormData({...formData, alt: e.target.value})} />
            </div>
            
            <div className="admin-form-group">
              <label>Order Number (Lower appears first)</label>
              <input type="number" className="admin-input" required value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              Save Image
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", gridColumn: "1 / -1", justifyContent: "center", padding: "40px" }}>
            <Loader2 size={24} style={{ color: "var(--accent-orange)", animation: "spin 1.5s linear infinite" }} />
            <span style={{ color: "var(--text-muted)" }}>Loading gallery...</span>
          </div>
        ) : images.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            No images in the gallery yet. Click "Add Image" to get started!
          </div>
        ) : (
          images.map(img => (
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
          ))
        )}
      </div>
    </div>
  );
}

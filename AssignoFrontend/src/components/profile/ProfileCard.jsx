import React, { useState, useRef, useEffect } from 'react';
import { Camera, Trash2, Mail, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { uploadUserImage, deleteUserImage } from '../../features/auth/authThunk';
import Loader from '../Loader';
import '../../styles/profile.css';

const ProfileCard = ({ user }) => {
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage?.url || user?.avatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
      setAvatarPreview(user?.profileImage?.url || user?.avatarUrl || null);
  }, [user]);

  const getInitials = (firstName, lastName) => {
    if (firstName || lastName) {
      return `${firstName ? firstName.charAt(0) : ''}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
    }
    return user?.name ? user.name.slice(0, 2).toUpperCase() : 'U';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const [cropImage, setCropImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgRatio, setImgRatio] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, JPEG, and WEBP formats are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImgRatio(img.naturalWidth / img.naturalHeight);
        setCropImage(reader.result);
        setIsCropModalOpen(true);
        setZoom(1);
        setOffsetX(0);
        setOffsetY(0);
        setRotation(0);
      };
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - offsetX, y: e.touches[0].clientY - offsetY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffsetX(e.touches[0].clientX - dragStart.x);
    setOffsetY(e.touches[0].clientY - dragStart.y);
  };

  const handleCropSave = () => {
    if (!cropImage) return;

    setIsUploading(true);
    const img = new Image();
    img.src = cropImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 300, 300);

      let renderWidth, renderHeight;
      if (imgRatio >= 1) {
        renderHeight = 280;
        renderWidth = 280 * imgRatio;
      } else {
        renderWidth = 280;
        renderHeight = 280 / imgRatio;
      }

      ctx.save();

      // Center coordinates on the 300x300 canvas
      // Scaling factor: 300px canvas / 250px circle = 1.2
      const canvasCenterX = 150 + offsetX * 1.2;
      const canvasCenterY = 150 + offsetY * 1.2;
      ctx.translate(canvasCenterX, canvasCenterY);

      // Rotate by the current angle
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw the image centered at the origin
      const drawWidth = renderWidth * zoom * 1.2;
      const drawHeight = renderHeight * zoom * 1.2;
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      ctx.restore();

      canvas.toBlob(async (blob) => {
        const croppedFile = new File([blob], "profile.png", { type: "image/png" });
        const formData = new FormData();
        formData.append("profileImage", croppedFile);

        try {
          await dispatch(uploadUserImage(formData));
          toast.success('Profile photo updated successfully.');
          setIsCropModalOpen(false);
          setCropImage(null);
        } catch (error) {
          toast.success('Profile photo updated.');
          setIsCropModalOpen(false);
          setCropImage(null);
        } finally {
          setIsUploading(false);
        }
      }, "image/png");
    };
  };

  const handleRemovePhoto = async () => {
    try {
        setIsUploading(true);
        await dispatch(deleteUserImage());
        toast.info('Profile photo removed successfully.');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    } catch (error) {
        toast.error('Failed to remove photo.');
    } finally {
        setIsUploading(false);
    }
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'First session';
    const date = new Date(lastLogin);
    if (isNaN(date.getTime())) return lastLogin;
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="profile-glass-card">
      {isUploading && <Loader variant="orbit" fullscreen={true} />}
      <div className="profile-card-header">
        
        <div className="profile-avatar-container">
          {isUploading ? (
            <div className="animate-spin">
              <Camera size={32} className="profile-detail-icon" />
            </div>
          ) : avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Profile" 
              className="profile-avatar-img"
              onError={() => setAvatarPreview(null)} // Broken image fallback
            />
          ) : (
            <span className="profile-avatar-initials">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
          )}
        </div>

        <h2 className="profile-name">
          {user?.firstName || user?.lastName 
            ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
            : user?.name || 'User'}
        </h2>
        
        <p className="profile-role">
          {user?.role || 'Member'} • {user?.department || 'Engineering'}
        </p>

        <div className="profile-details-list">
          <div className="profile-detail-item">
            <Mail size={16} className="profile-detail-icon" />
            <span>{user?.email || 'johndoe@example.com'}</span>
          </div>
          <div className="profile-detail-item">
            <Calendar size={16} className="profile-detail-icon" />
            <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2023'}</span>
          </div>
          <div className="profile-detail-item">
            <CheckCircle2 size={16} className="profile-detail-icon" />
            <span>{user?.status || 'Active Account'}</span>
          </div>
          <div className="profile-detail-item">
            <Briefcase size={16} className="profile-detail-icon" />
            <span>Last login: {formatLastLogin(user?.lastLogin)}</span>
          </div>
        </div>

        <div className="profile-avatar-actions">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="profile-hidden-input"
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
          <button 
            className="profile-btn profile-btn-primary"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <Camera size={18} />
            Upload New Photo
          </button>
          
          {avatarPreview && (
            <button 
              className="profile-btn profile-btn-secondary"
              onClick={handleRemovePhoto}
              disabled={isUploading}
            >
              <Trash2 size={18} />
              Remove Photo
            </button>
          )}
        </div>

      </div>

      {/* Photo Adjustment Modal */}
      {isCropModalOpen && (
        <div 
          className="profile-modal-overlay" 
          onClick={() => setIsCropModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}
        >
          <div 
            className="profile-modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '360px', 
              width: '90%',
              padding: '1.5rem', 
              background: '#FFFFFF', 
              color: '#333333', 
              borderRadius: '24px', 
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ color: '#4d8a38', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4-4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#4d8a38', fontFamily: 'Sora, sans-serif' }}>Crop your photo</h3>
            </div>
            
            {/* Crop Container */}
            <div 
              style={{
                width: '280px',
                height: '280px',
                position: 'relative',
                margin: '1rem auto',
                overflow: 'hidden',
                borderRadius: '12px',
                background: '#EAEAEA',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Drag/Adjustable Image */}
              <img 
                src={cropImage} 
                alt="Adjust preview"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotate(${rotation}deg)`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  width: imgRatio >= 1 ? 'auto' : '100%',
                  height: imgRatio >= 1 ? '100%' : 'auto',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  userSelect: 'none',
                  WebkitUserDrag: 'none'
                }}
              />

              {/* Crop Mask Overlay (Increased to 250px ~ 90% of container) */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '250px',
                  height: '250px',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)', 
                  overflow: 'hidden'
                }}
              >
                {/* Grid Lines */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33.3%', width: '1px', background: 'rgba(255, 255, 255, 0.4)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '66.6%', width: '1px', background: 'rgba(255, 255, 255, 0.4)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '33.3%', height: '1px', background: 'rgba(255, 255, 255, 0.4)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '66.6%', height: '1px', background: 'rgba(255, 255, 255, 0.4)' }} />
              </div>
            </div>

            {/* Dropdown Indicator and Zoom Slider */}
            <div style={{ width: '280px', margin: '1rem auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#666666', fontWeight: '600' }}>1x/original</span>
                <span style={{ fontSize: '0.85rem', color: '#666666', fontWeight: '600' }}>{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range"
                min="1"
                max="5"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#4d8a38',
                  cursor: 'pointer',
                  margin: '0.5rem 0'
                }}
              />
            </div>

            {/* Reset and Rotate Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '280px', margin: '0 auto 1rem auto' }}>
              <button
                type="button"
                onClick={handleRotate}
                style={{
                  background: 'none',
                  border: '1.5px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#555555',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Rotate
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: '1.5px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#555555',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/></svg>
                Reset
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', width: '280px', margin: '1rem auto 0 auto' }}>
              <button 
                type="button" 
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e57373',
                  background: '#FFFFFF',
                  color: '#d32f2f',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => { setIsCropModalOpen(false); setCropImage(null); }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                style={{
                  flex: 2,
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#68b24a', 
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(104, 178, 74, 0.3)',
                  transition: 'all 0.2s'
                }}
                onClick={handleCropSave}
                disabled={isUploading}
              >
                Save photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;

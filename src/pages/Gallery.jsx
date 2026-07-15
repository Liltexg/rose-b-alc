import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const data = await db.getGallery();
      setImages(data);
    };
    fetchGallery();
  }, []);

  const albums = ['All', 'Academic Support', 'Holiday Classes', 'Awards', 'Events', 'Learner Activities'];

  const filteredImages = activeAlbum === 'All' 
    ? images 
    : images.filter(img => img.album === activeAlbum);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
      if (e.key === 'Escape') setLightboxIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  return (
    <div className="animated">
      {/* Page Header */}
      <section style={{
        backgroundColor: 'var(--bg-alt)',
        padding: '60px 0',
        borderBottom: '3px double var(--primary)',
        textAlign: 'center'
      }}>
        <div className="container">
          <span style={{
            color: 'var(--secondary)',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '6px'
          }}>Visual Album</span>
          <h1 style={{ fontSize: '2.8rem', margin: 0, color: 'var(--primary)' }}>Centre Gallery</h1>
          <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--secondary)', margin: '12px auto 0' }}></div>
        </div>
      </section>

      {/* Album Filters */}
      <section style={{ padding: '36px 0 0 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            backgroundColor: 'var(--bg-alt)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            {albums.map(alb => (
              <button
                key={alb}
                className={`btn ${activeAlbum === alb ? 'btn-secondary' : 'btn-outline'}`}
                style={{
                  padding: '8px 18px',
                  fontSize: '0.78rem',
                  backgroundColor: activeAlbum === alb ? 'var(--secondary)' : 'transparent',
                  borderColor: activeAlbum === alb ? 'var(--secondary)' : 'var(--border-color)',
                  color: activeAlbum === alb ? 'var(--white)' : 'var(--primary)'
                }}
                onClick={() => {
                  setActiveAlbum(alb);
                  setLightboxIndex(null);
                }}
              >
                {alb}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Images Grid */}
      <section className="section">
        <div className="container">
          {filteredImages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                No photos found in this album yet. Upload photos from the staff portal.
              </p>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '24px' }}>
              {filteredImages.map((img, index) => (
                <div 
                  key={img.id} 
                  onClick={() => openLightbox(index)}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    aspectRatio: '4/3',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-alt)'
                  }}
                  className="gallery-card"
                >
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform var(--transition-slow)'
                    }}
                    className="gallery-image"
                  />
                  {/* Hover Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(rgba(30,32,34,0.1), rgba(30,32,34,0.85))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '24px',
                    opacity: 0,
                    transition: 'opacity var(--transition-normal)'
                  }} className="gallery-overlay">
                    <ZoomIn size={22} style={{
                      color: 'var(--accent)',
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      transform: 'scale(0.85)',
                      transition: 'transform var(--transition-normal)'
                    }} className="zoom-icon" />
                    
                    <span className="tag tag-secondary" style={{ alignSelf: 'flex-start', marginBottom: '8px', fontSize: '0.65rem' }}>
                      {img.album}
                    </span>
                    <p style={{
                      color: 'var(--white)',
                      fontSize: '0.88rem',
                      lineHeight: '1.4',
                      fontWeight: 500
                    }}>{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30,32,34,0.96)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
          className="animated"
        >
          <button 
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            <X size={36} />
          </button>

          <button 
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'var(--white)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
          >
            <ChevronLeft size={36} />
          </button>

          <button 
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'var(--white)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
          >
            <ChevronRight size={36} />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <img 
              src={filteredImages[lightboxIndex]?.url} 
              alt={filteredImages[lightboxIndex]?.caption} 
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
            <div style={{ textAlign: 'center', color: 'var(--white)', maxWidth: '600px' }}>
              <span style={{
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '4px'
              }}>{filteredImages[lightboxIndex]?.album}</span>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.5', fontFamily: 'var(--font-heading)' }}>
                {filteredImages[lightboxIndex]?.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-card:hover .gallery-image {
          transform: scale(1.04);
        }
        .gallery-card:hover .gallery-overlay {
          opacity: 1 !important;
        }
        .gallery-card:hover .zoom-icon {
          transform: scale(1) !important;
        }
        /* On touch-primary (mobile) devices, always show the gallery overlay caption */
        @media (max-width: 900px) {
          .gallery-overlay {
            opacity: 1 !important;
            background: linear-gradient(rgba(30,32,34,0), rgba(30,32,34,0.75)) !important;
          }
          .zoom-icon {
            display: none !important;
          }
        }
        /* Lightbox nav buttons — smaller on mobile */
        @media (max-width: 600px) {
          .lightbox-prev, .lightbox-next {
            width: 40px !important;
            height: 40px !important;
            left: 8px !important;
          }
          .lightbox-next {
            right: 8px !important;
            left: auto !important;
          }
        }
      `}</style>
    </div>
  );
}


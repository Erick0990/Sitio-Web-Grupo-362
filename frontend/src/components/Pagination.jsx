import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
            padding: '1rem 0'
        }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === 1 ? 'var(--bg-card-inner)' : 'var(--bg-input)',
                    color: currentPage === 1 ? '#9ca3af' : 'var(--color-primary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500
                }}
            >
                <ChevronLeft size={16} /> Anterior
            </button>

            <span style={{
                color: 'var(--text-main)',
                opacity: 0.8,
                fontSize: '0.95rem',
                fontWeight: 500
            }}>
                Página {currentPage} de {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === totalPages ? 'var(--bg-card-inner)' : 'var(--bg-input)',
                    color: currentPage === totalPages ? '#9ca3af' : 'var(--color-primary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 500
                }}
            >
                Siguiente <ChevronRight size={16} />
            </button>
        </div>
    );
}

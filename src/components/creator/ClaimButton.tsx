'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ClaimModal } from '@/components/creator/ClaimModal';

interface ClaimButtonProps {
  businessProfileId: string;
  listingName: string;
  ownerId: string;
}

export function ClaimButton({ businessProfileId, listingName, ownerId }: ClaimButtonProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Don't render if: loading, not authenticated, or user owns this listing
  if (isLoading || !isAuthenticated || !user) return null;
  if (user.id === ownerId) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors"
      >
        <Flag className="w-3 h-3" />
        Claim this listing
      </button>

      <ClaimModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        businessProfileId={businessProfileId}
        listingName={listingName}
      />
    </>
  );
}

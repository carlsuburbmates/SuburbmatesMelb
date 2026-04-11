'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessProfileId: string;
  listingName: string;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'already_exists' | 'already_owner';

export function ClaimModal({ isOpen, onClose, businessProfileId, listingName }: ClaimModalProps) {
  const { isAuthenticated } = useAuth();
  const [evidenceText, setEvidenceText] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmitState('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/creator/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_profile_id: businessProfileId,
          evidence_text: evidenceText.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitState('success');
        return;
      }

      const code = data?.error?.code ?? '';
      if (code === 'CLAIM_EXISTS') {
        setSubmitState('already_exists');
      } else if (code === 'ALREADY_OWNER') {
        setSubmitState('already_owner');
      } else {
        setSubmitState('error');
        setErrorMessage(data?.error?.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleClose = () => {
    setSubmitState('idle');
    setEvidenceText('');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Claim This Listing">
      {submitState === 'success' ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <div>
            <p className="text-sm font-bold text-ink-primary uppercase tracking-widest">
              Claim Submitted
            </p>
            <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
              Your claim for <strong className="text-ink-primary">{listingName}</strong> is now
              pending review. You will receive an email confirmation shortly.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-white/90 transition-colors"
          >
            Close
          </button>
        </div>
      ) : submitState === 'already_exists' ? (
        <div className="text-center space-y-4 py-4">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <div>
            <p className="text-sm font-bold text-ink-primary uppercase tracking-widest">
              Claim Already Submitted
            </p>
            <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
              You have already submitted a claim for this listing. It is currently pending review.
              We will notify you by email once a decision has been made.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 border border-white/10 text-ink-secondary text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      ) : submitState === 'already_owner' ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto" />
          <div>
            <p className="text-sm font-bold text-ink-primary uppercase tracking-widest">
              You Own This Listing
            </p>
            <p className="text-xs text-ink-secondary mt-2">
              This listing is already associated with your account.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 border border-white/10 text-ink-secondary text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs text-ink-secondary leading-relaxed">
              You are submitting a claim for{' '}
              <strong className="text-ink-primary">{listingName}</strong>. Once submitted,
              an admin will review your claim and notify you by email.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="evidence_text"
              className="block text-[10px] font-bold text-ink-secondary uppercase tracking-widest"
            >
              Supporting Evidence{' '}
              <span className="text-ink-tertiary font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              id="evidence_text"
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              rows={4}
              placeholder="e.g. link to your Instagram, website, ABN registration, or any other evidence that this listing belongs to you"
              className="w-full bg-black border border-white/10 text-ink-primary text-xs p-3 placeholder:text-ink-tertiary focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {submitState === 'error' && (
            <div className="flex items-start gap-2 text-red-400 bg-red-900/10 border border-red-900/20 p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-[11px]">{errorMessage}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitState === 'submitting'}
              className="flex-1 py-3 border border-white/10 text-ink-secondary text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitState === 'submitting' || !isAuthenticated}
              className="flex-1 py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting
                </>
              ) : (
                'Submit Claim'
              )}
            </button>
          </div>

          <p className="text-[10px] text-ink-tertiary text-center">
            False claims may result in account suspension.
          </p>
        </form>
      )}
    </Modal>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle, Loader2, MapPin, Star } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { FEATURED_SLOT } from '@/lib/constants';

interface FeaturedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EligibilityState = 'checking' | 'eligible' | 'ineligible' | 'no_listing';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'already_exists';

interface CheckOnlyResponse {
  check_only?: boolean;
  eligible?: boolean;
  can_submit?: boolean;
  code?: string;
  missing_fields?: string[];
  request_exists?: boolean;
  existing_status?: string;
  region?: string;
}

export function FeaturedRequestModal({ isOpen, onClose }: FeaturedRequestModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Featured Placement Request">
      {isOpen ? <FeaturedRequestModalContent onClose={onClose} /> : null}
    </Modal>
  );
}

function FeaturedRequestModalContent({ onClose }: Pick<FeaturedRequestModalProps, 'onClose'>) {
  const [eligibility, setEligibility] = useState<EligibilityState>('checking');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [regionName, setRegionName] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setEligibility('checking');
      setSubmitState('idle');
      setErrorMessage('');
      try {
        const res = await fetch('/api/vendor/featured-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ __check_only: true }),
        });

        if (cancelled) return;

        if (res.status === 401) {
          setEligibility('no_listing');
          return;
        }

        const payload = await res.json();
        const data = payload?.data as CheckOnlyResponse | undefined;

        if (res.ok && data?.check_only) {
          if (data.region) {
            setRegionName(data.region);
          }

          if (data.request_exists || data.can_submit === false) {
            setEligibility('eligible');
            setSubmitState('already_exists');
            return;
          }

          if (data.eligible === false) {
            if (data.code === 'NO_LISTING') {
              setEligibility('no_listing');
              return;
            }

            if (data.code === 'INELIGIBLE_INCOMPLETE_LOCATION') {
              setEligibility('ineligible');
              setMissingFields(data.missing_fields ?? []);
              return;
            }
          }

          setEligibility('eligible');
          return;
        }

        if (res.status === 404) {
          setEligibility('no_listing');
          return;
        }

        if (res.status === 422 && payload?.error?.code === 'INELIGIBLE_INCOMPLETE_LOCATION') {
          setEligibility('ineligible');
          setMissingFields(payload?.error?.missing_fields ?? []);
          return;
        }

        if (res.status === 409) {
          setEligibility('eligible');
          setSubmitState('already_exists');
          setRegionName(payload?.data?.region ?? '');
          return;
        }

        if (payload?.data?.region) {
          setRegionName(payload.data.region);
        }

        setEligibility('eligible');
      } catch {
        if (!cancelled) {
          setEligibility('eligible');
        }
      }
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async () => {
    setSubmitState('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/vendor/featured-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegionName(data.data?.region ?? regionName);
        setSubmitState('success');
        return;
      }

      const code = data?.error?.code ?? '';
      if (code === 'REQUEST_EXISTS') {
        setSubmitState('already_exists');
      } else {
        setSubmitState('error');
        setErrorMessage(data?.error?.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      {eligibility === 'checking' ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin text-ink-secondary" />
          <p className="text-[10px] uppercase tracking-widest text-ink-tertiary font-bold">
            Checking eligibility
          </p>
        </div>
      ) : eligibility === 'no_listing' ? (
        <div className="space-y-4 py-2">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <div className="text-center space-y-2">
            <p className="text-sm font-bold text-ink-primary uppercase tracking-widest">
              No Listing Found
            </p>
            <p className="text-xs text-ink-secondary leading-relaxed">
              You need an active creator listing before requesting featured placement.
            </p>
          </div>
          <Link
            href="/auth/signup"
            className="block w-full py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold text-center hover:bg-white/90 transition-colors"
            onClick={onClose}
          >
            Create Your Listing
          </Link>
        </div>
      ) : eligibility === 'ineligible' ? (
        <div className="space-y-6 py-2">
          <div className="flex items-start gap-3 bg-amber-900/10 border border-amber-900/20 p-4">
            <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Location Details Required
              </p>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Featured placement requires your listing to have a complete location.
                {missingFields.length > 0 && (
                  <> The following must be set: <strong className="text-ink-primary">{missingFields.join(', ')}</strong>.</>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-ink-tertiary uppercase tracking-widest font-bold">
              What to do
            </p>
            <ol className="space-y-2 text-xs text-ink-secondary leading-relaxed list-decimal list-inside">
              <li>Go to your creator settings</li>
              <li>Set your suburb and region</li>
              <li>Return here to request featured placement</li>
            </ol>
          </div>

          <Link
            href="/vendor/settings"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-white/90 transition-colors"
            onClick={onClose}
          >
            Complete Location Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : submitState === 'success' ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <div>
            <p className="text-sm font-bold text-ink-primary uppercase tracking-widest">
              Request Submitted
            </p>
            <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
              Your featured placement request{regionName ? ` for ${regionName}` : ''} is pending
              review. You will receive an email confirmation and another when your placement goes
              live.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-white/90 transition-colors"
          >
            Done
          </button>
        </div>
      ) : submitState === 'already_exists' ? (
        <div className="text-center space-y-4 py-4">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <div>
            <p className="text-sm font-bold text-ink-primary uppercase tracking-widest">
              Request Already Pending
            </p>
            <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
              You already have an active featured request for this region. We will notify you once
              it has been reviewed.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-white/10 text-ink-secondary text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-900/20 border border-amber-900/30 rounded-sm">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink-primary uppercase tracking-widest">
                {FEATURED_SLOT.DURATION_DAYS}-Day Featured Placement
              </p>
              <p className="text-[10px] text-ink-tertiary mt-0.5">
                {regionName ? `Region: ${regionName}` : 'Your primary region'}
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-ink-secondary">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
              Top position in regional directory search results
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
              Featured badge on your creator profile
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
              Activated manually by admin after review
            </li>
          </ul>

          <div className="bg-white/[0.03] border border-white/5 p-4 text-xs text-ink-secondary">
            Placement is subject to availability and operator approval. You will be notified
            once your request has been reviewed.
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
              onClick={onClose}
              disabled={submitState === 'submitting'}
              className="flex-1 py-3 border border-white/10 text-ink-secondary text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitState === 'submitting'}
              className="flex-1 py-3 bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting
                </>
              ) : (
                'Request Placement'
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

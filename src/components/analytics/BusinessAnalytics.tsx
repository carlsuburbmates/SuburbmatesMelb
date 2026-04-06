'use client';

import { TrendingUp, Eye, Phone, Mail, ExternalLink, MessageCircle } from 'lucide-react';
import { useFadeIn } from '@/hooks/useScrollAnimation';

interface AnalyticsData {
  views: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  contacts: {
    total: number;
    thisMonth: number;
    types: {
      phone: number;
      email: number;
      website: number;
      form: number;
    };
  };
  engagement: {
    averageTime: string;
    bounceRate: number;
    returnVisitors: number;
  };
}

interface BusinessAnalyticsProps {
  isOwner?: boolean;
}

export function BusinessAnalytics({ isOwner = false }: BusinessAnalyticsProps) {
  const animation = useFadeIn<HTMLDivElement>({ delay: 200, duration: 600 });

  // Mock analytics data - in production this would come from actual analytics
  const analyticsData: AnalyticsData = {
    views: {
      total: 2847,
      thisMonth: 342,
      growth: 15.3
    },
    contacts: {
      total: 89,
      thisMonth: 12,
      types: {
        phone: 34,
        email: 28,
        website: 19,
        form: 8
      }
    },
    engagement: {
      averageTime: '2m 34s',
      bounceRate: 32,
      returnVisitors: 23
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div 
      ref={animation.elementRef}
      className={`bg-ink-surface-1 border border-white/5 p-8 ${animation.className}`}
      style={animation.style}
    >
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-4 h-4 text-ink-primary" />
          <h3 className="text-xs font-black text-ink-primary uppercase tracking-[0.3em]">Business Analytics</h3>
        </div>
        <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Last 30 days</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-3.5 h-3.5 text-ink-secondary" />
            <span className="text-[10px] font-black text-ink-secondary uppercase tracking-widest">Profile Views</span>
          </div>
          <div className="text-3xl font-black text-ink-primary tracking-tighter mb-1">{analyticsData.views.thisMonth}</div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">+{analyticsData.views.growth}%</span>
            <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">vs prev. month</span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="w-3.5 h-3.5 text-ink-secondary" />
            <span className="text-[10px] font-black text-ink-secondary uppercase tracking-widest">Direct Contacts</span>
          </div>
          <div className="text-3xl font-black text-ink-primary tracking-tighter mb-1">{analyticsData.contacts.thisMonth}</div>
          <div className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">
            {analyticsData.contacts.total} total life-to-date
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-ink-secondary" />
            <span className="text-[10px] font-black text-ink-secondary uppercase tracking-widest">Engagement</span>
          </div>
          <div className="text-3xl font-black text-ink-primary tracking-tighter mb-1">{analyticsData.engagement.averageTime}</div>
          <div className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">
            Avg session duration
          </div>
        </div>
      </div>

      {/* Contact Breakdown */}
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black text-ink-secondary uppercase tracking-[0.2em]">Contact Method Index</h4>
          <span className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest">Conversion Weight</span>
        </div>
        
        <div className="space-y-6">
          <BreakdownRow 
            icon={<Phone className="w-3.5 h-3.5" />}
            label="Voice Calls"
            value={analyticsData.contacts.types.phone}
            percentage={(analyticsData.contacts.types.phone / analyticsData.contacts.total) * 100}
          />
          <BreakdownRow 
            icon={<Mail className="w-3.5 h-3.5" />}
            label="Email inquiries"
            value={analyticsData.contacts.types.email}
            percentage={(analyticsData.contacts.types.email / analyticsData.contacts.total) * 100}
          />
          <BreakdownRow 
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            label="Direct site visits"
            value={analyticsData.contacts.types.website}
            percentage={(analyticsData.contacts.types.website / analyticsData.contacts.total) * 100}
          />
          <BreakdownRow 
            icon={<MessageCircle className="w-3.5 h-3.5" />}
            label="Internal forms"
            value={analyticsData.contacts.types.form}
            percentage={(analyticsData.contacts.types.form / analyticsData.contacts.total) * 100}
          />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/5">
        <MiniStat label="Bounce Rate" value={`${analyticsData.engagement.bounceRate}%`} />
        <MiniStat label="Return Rate" value={`${analyticsData.engagement.returnVisitors}%`} />
        <MiniStat label="Life-to-date" value={analyticsData.views.total.toLocaleString()} />
        <MiniStat label="Conv. Rate" value="3.5%" highlight />
      </div>
    </div>
  );
}

function BreakdownRow({ icon, label, value, percentage }: { icon: React.ReactNode, label: string, value: number, percentage: number }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className="text-ink-tertiary group-hover:text-ink-primary transition-colors">{icon}</span>
          <span className="text-[10px] font-bold text-ink-secondary group-hover:text-ink-primary uppercase tracking-widest transition-colors">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-black text-ink-primary uppercase tracking-widest">{value}</span>
      </div>
      <div className="h-[1px] w-full bg-white/5 group-hover:bg-white/10 transition-colors relative">
        <div 
          className="absolute inset-y-0 left-0 bg-ink-primary transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-ink-tertiary uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black uppercase tracking-widest ${highlight ? 'text-ink-primary' : 'text-ink-secondary'}`}>
        {value}
      </p>
    </div>

  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Layout, Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface TemplateOption {
  key: string;
  name: string;
  description: string;
  thumbnail: string; // CSS class for placeholder or image URL
  minTier: "basic" | "pro" | "premium";
}

const TEMPLATES: TemplateOption[] = [
  {
    key: "standard",
    name: "Standard",
    description: "Clean, classic layout focused on your business info.",
    thumbnail: "bg-gray-100",
    minTier: "basic",
  },
  {
    key: "high_end",
    name: "High-End",
    description: "Immersive hero showcase with premium aesthetics.",
    thumbnail: "bg-gradient-to-br from-gray-900 to-gray-800",
    minTier: "pro",
  },
];

export function TemplateSelector({ currentTemplate }: { currentTemplate: string }) {
  const { vendor, token } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isEligible = (minTier: string) => {
    if (minTier === "basic") return true;
    if (vendor?.tier === "premium") return true;
    if (vendor?.tier === "pro" && minTier === "pro") return true;
    return false;
  };

  const handleSave = async (key: string) => {
    if (!token) return;
    setSaving(true);
    
    try {
      const response = await fetch('/api/vendor/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ template_key: key })
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }
      
      setSelectedTemplate(key);
      toast.success("Profile template updated!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update template.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {TEMPLATES.map((template) => {
        const locked = !isEligible(template.minTier);
        const isActive = selectedTemplate === template.key;

        return (
          <div
            key={template.key}
            className={`
              relative rounded-xl border-2 transition-all overflow-hidden group
              ${isActive ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-300"}
              ${locked ? "opacity-75 cursor-not-allowed bg-gray-50" : "cursor-pointer bg-white"}
            `}
            onClick={() => !locked && handleSave(template.key)}
          >
            {/* Thumbnail */}
            <div className={`h-32 w-full ${template.thumbnail} flex items-center justify-center relative`}>
              {template.key === 'high_end' && (
                 <span className="text-white font-serif text-2xl opacity-50">Aa</span>
              )}
              {template.key === 'standard' && (
                 <Layout className="text-gray-400 w-12 h-12" />
              )}
              
              {isActive && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    {saving ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
                    ) : (
                      <Check className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                {locked && (
                   <span className="inline-flex items-center px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-medium">
                     <Lock className="w-3 h-3 mr-1" />
                     {template.minTier === 'premium' ? 'Premium' : 'Pro'}
                   </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
            
            {/* Locked Overlay */}
            {locked && (
              <div className="absolute inset-0 bg-gray-50/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                  <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm mb-2">
                    Upgrade to {template.minTier === 'premium' ? 'Premium' : 'Pro'}
                  </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

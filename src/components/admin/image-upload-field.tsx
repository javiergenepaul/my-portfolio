"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { Button, useToast } from "@/components";
import { createClient } from "@/lib/supabase/client";

/** Public Storage bucket for admin-uploaded content images (see 0013_storage). */
const BUCKET = "content";

/**
 * Image field backed by Supabase Storage.
 *
 * Uploads the chosen file to the public `content` bucket (admin-authenticated
 * write) and stores the resulting public URL as the field value. The preview
 * resolves through the asset registry, so it renders whether the current value
 * is a legacy code asset stub or a Storage URL.
 */
export function ImageUploadField({
  value,
  onChange,
  pathPrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Folder inside the bucket, e.g. the field name ("icon"). */
  pathPrefix: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Only preview real URLs (uploaded Storage images, or hosted logos). Legacy
  // code-asset stubs like "/assets/…" don't resolve here — kept out on purpose
  // so the admin bundle never pulls in the whole @/assets folder. The value
  // text still shows below, and uploading replaces the stub with a Storage URL.
  const preview = /^https?:\/\//.test(value) ? value : "";

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "Image uploaded", duration: 2000 });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: e instanceof Error ? e.message : String(e),
        duration: 7000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-contain" />
        ) : (
          <ImagePlus size={18} className="text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {value || "No image selected"}
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          PNG, JPG, or SVG — stored in Supabase Storage
        </p>
      </div>

      {value && !uploading && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onChange("")}
          title="Clear"
        >
          <X size={14} />
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="gap-1.5"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Upload size={14} />
        )}
        {uploading ? "Uploading…" : "Upload"}
      </Button>
    </div>
  );
}

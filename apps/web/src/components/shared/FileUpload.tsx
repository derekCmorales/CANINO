'use client';

import { useRef, useState } from 'react';
import { uploadFile, resolveFileUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  className?: string;
}

export function FileUpload({ value, onChange, accept = 'image/*', className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const path = await uploadFile(file);
      onChange(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {value ? (
        <div className="relative inline-block">
          {accept.startsWith('image') ? (
            <img
              src={resolveFileUrl(value)}
              alt="Vista previa"
              className="h-32 w-32 rounded-xl object-cover border border-border"
            />
          ) : (
            <div className="rounded-xl border border-border px-4 py-3 text-sm">{value}</div>
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow"
            aria-label="Eliminar"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 px-6 py-8 cursor-pointer hover:border-primary/50 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Haz clic para subir un archivo</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {value && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Cambiar archivo
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ThumbsUp, FileText, ExternalLink, Download } from 'lucide-react'
import { getAuthToken } from '@/services/fetcher'

// Types
type Resource = {
  id: string
  title: string
  author: string
  role?: string
  description: string
  date: string
  likes: string | number
  type?: 'link' | 'file' | 'text'
  link?: string | null
  fileName?: string | null
  fileUrl?: string | null
}


export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const token = getAuthToken()
        const res = await fetch('/api/resources', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const contentType = res.headers.get('content-type') || ''
        const raw = contentType.includes('application/json') ? await res.json().catch(() => null) : null
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any)?.data?.resources)
          ? (raw as any).data.resources
          : Array.isArray((raw as any)?.resources)
          ? (raw as any).resources
          : Array.isArray((raw as any)?.data)
          ? (raw as any).data
          : []
        const foundData = (list as any[]).find((item) => {
          if (!item || typeof item !== 'object') return false
          const identifier = (item as any).id ?? (item as any)._id ?? (item as any).uuid
          if (!identifier) return false
          const value = typeof identifier === 'string' ? identifier : identifier?.toString?.()
          return value === params.id
        })
        const found: Resource | null = foundData
          ? {
              id: (() => {
                const identifier = (foundData as any).id ?? (foundData as any)._id ?? (foundData as any).uuid ?? ''
                return typeof identifier === 'string' ? identifier : identifier?.toString?.() ?? ''
              })(),
              title:
                (foundData as any).title ||
                (foundData as any).name ||
                'Untitled',
              author:
                (foundData as any).created_by ||
                (foundData as any).author ||
                'Anonymous',
              role: (foundData as any).type || (foundData as any).category,
              description:
                (foundData as any).description ||
                (foundData as any).desc ||
                '',
              date: (() => {
                const created = (foundData as any).created_at
                if (created) {
                  const parsed = new Date(created)
                  if (!Number.isNaN(parsed.valueOf())) return parsed.toLocaleDateString()
                }
                return (foundData as any).date || ''
              })(),
              likes:
                (foundData as any).likes ??
                (foundData as any).like_count ??
                0,
              type: (foundData as any).type || (foundData as any).resource_type,
              link:
                (foundData as any).link ??
                (foundData as any).url ??
                null,
              fileName:
                (foundData as any).fileName ??
                (foundData as any).file_name ??
                null,
              fileUrl:
                (foundData as any).fileUrl ??
                (foundData as any).file_url ??
                null,
            }
          : null
        setResource(found)
      } catch {
        setResource(null)
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleFileDownload = (fileName: string, fileUrl: string) => {
    // In real app, this would trigger actual file download
    console.log(`Downloading ${fileName} from ${fileUrl}`)
    // You can implement actual download logic here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Resource not found</div>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className=" hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Resources</h1>
      </div>

      {/* Resource Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {resource.title}
        </h1>

        {/* Metadata */}

        {/* Author Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{resource.author}</span>
            {resource.role && (
              <span className="text-gray-500"> ({resource.role})</span>
            )}
          </p>
        </div>

        <div className="flex items-center mb-6">
          <span className="text-sm pr-3 text-gray-600">{resource.date}</span>
          <div className="flex items-center gap-1 text-blue-600">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm font-medium">{resource.likes}</span>
          </div>
        </div>
        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Link or File Attachment */}
        {resource.type === 'link' && resource.link && (
          <div className="mb-6">
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium break-all"
              onClick={() => handleLinkClick(resource.link as string)}
            >
              <ExternalLink className="h-4 w-4" />
              {resource.link}
            </a>
          </div>
        )}

        {resource.type === 'file' && resource.fileName && resource.fileUrl && (
          <div className="mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {resource.fileName}
                  </p>
                  <p className="text-sm text-gray-500">Click to download</p>
                </div>
                <button
                  onClick={() => handleFileDownload(resource.fileName as string, resource.fileUrl as string)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

    
      </div>
    </div>
  )
}

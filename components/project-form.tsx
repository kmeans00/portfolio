"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Upload, File } from "lucide-react"
import type { Project } from "./projects-section"

interface ProjectFormProps {
  initialData?: Project
  onSave: (project: Omit<Project, "id">) => void
  onCancel: () => void
}

export function ProjectForm({ initialData, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    tech: initialData?.tech || "",
    keyFeatures: initialData?.keyFeatures || "",
    imageUrl: initialData?.imageUrl || "",
    videoUrl: initialData?.videoUrl || "",
    githubUrl: initialData?.githubUrl || "",
    pdfUrl: initialData?.pdfUrl || "",
    year: initialData?.year || new Date().getFullYear().toString(),
  })

  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert("제목과 설명은 필수 입력 항목입니다.")
      return
    }
    onSave(formData)
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageUrl" | "videoUrl" | "pdfUrl",
    setUploading: (value: boolean) => void,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setFormData({ ...formData, [field]: data.url })
    } catch (error) {
      console.error("Upload error:", error)
      alert("파일 업로드에 실패했습니다")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="border-2 border-accent bg-card">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">{initialData ? "프로젝트 수정" : "새 프로젝트"}</h3>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} size="sm" className="bg-secondary text-secondary-foreground">
              <Check className="mr-2 h-4 w-4" />
              저장
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              취소
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">프로젝트 제목 *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="프로젝트 제목"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">연도</label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">프로젝트 설명 *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="프로젝트에 대한 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">주요 기능 (줄바꿈으로 구분)</label>
            <Textarea
              value={formData.keyFeatures}
              onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
              placeholder="인증/인가 개발&#10;실시간 알림 시스템&#10;결제 시스템 통합"
              rows={4}
            />
            <p className="mt-1 text-xs text-muted-foreground">각 줄에 하나씩 주요 기능을 입력하세요</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">사용 기술 (쉼표로 구분)</label>
            <Input
              value={formData.tech}
              onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
              placeholder="React, Next.js, TypeScript"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">GitHub 저장소 URL</label>
            <Input
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Upload className="h-4 w-4" />
              프로젝트 이미지
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploadingImage}
                variant="outline"
                className="w-full"
              >
                {isUploadingImage ? "업로드 중..." : formData.imageUrl ? "이미지 변경" : "이미지 선택"}
              </Button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "imageUrl", setIsUploadingImage)}
                className="hidden"
              />
            </div>
            {formData.imageUrl && (
              <p className="mt-1 truncate text-xs text-muted-foreground">선택됨: {formData.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Upload className="h-4 w-4" />
              프로젝트 동영상
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploadingVideo}
                variant="outline"
                className="w-full"
              >
                {isUploadingVideo ? "업로드 중..." : formData.videoUrl ? "동영상 변경" : "동영상 선택"}
              </Button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "videoUrl", setIsUploadingVideo)}
                className="hidden"
              />
            </div>
            {formData.videoUrl && (
              <p className="mt-1 truncate text-xs text-muted-foreground">선택됨: {formData.videoUrl}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">동영상을 선택하면 이미지 대신 표시됩니다</p>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <File className="h-4 w-4" />
              프로젝트 문서 (PDF)
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploadingPdf}
                variant="outline"
                className="w-full"
              >
                {isUploadingPdf ? "업로드 중..." : formData.pdfUrl ? "PDF 변경" : "PDF 선택"}
              </Button>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e, "pdfUrl", setIsUploadingPdf)}
                className="hidden"
              />
            </div>
            {formData.pdfUrl && (
              <p className="mt-1 truncate text-xs text-muted-foreground">선택됨: {formData.pdfUrl}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">프로젝트 설명서 PDF 파일을 업로드하세요</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

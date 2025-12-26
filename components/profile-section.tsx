"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Check, X, Github, Linkedin, User, Upload } from "lucide-react"

interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  skills: string
  github: string
  linkedin: string
  profileImage?: string
}

interface ProfileSectionProps {
  profileData: ProfileData
  onUpdateProfile: (data: ProfileData) => void
  isAuthenticated: boolean
}

export function ProfileSection({ profileData, onUpdateProfile, isAuthenticated }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(profileData)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ✅ 서버에서 profileData가 로드/갱신되면 editData도 동기화 (편집 중에는 덮어쓰지 않음)
  useEffect(() => {
    if (!isEditing) setEditData(profileData)
  }, [profileData, isEditing])

  const handleEdit = () => {
    setEditData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdateProfile(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      const next = { ...editData, profileImage: data.url }

      setEditData(next)
      onUpdateProfile(next) // ✅ 업로드 즉시 서버 저장까지 이어지도록
    } catch (error) {
      console.error("Upload error:", error)
      alert("파일 업로드에 실패했습니다")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="mb-12 border-border bg-card">
      <CardContent className="p-8">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-1 items-start gap-8">
            {/* 좌측: 직사각형 프로필 사진 */}
            <div className="relative flex-shrink-0">
              <div className="flex h-64 w-48 items-center justify-center overflow-hidden rounded-lg border-4 border-border bg-muted">
                {editData.profileImage ? (
                  <img
                    src={editData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-24 w-24 text-muted-foreground" />
                )}
              </div>

              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-2 right-2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    type="button"
                  >
                    <Upload className="h-5 w-5" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <p className="text-sm text-white">업로드 중...</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 우측: 정보 */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="text-2xl font-bold"
                    placeholder="이름"
                  />
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="text-lg"
                    placeholder="직책"
                  />
                </div>
              ) : (
                <>
                  <h1 className="mb-2 text-3xl font-bold text-foreground">{profileData.name}</h1>
                  <p className="mb-4 text-xl text-muted-foreground">{profileData.title}</p>
                </>
              )}
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} size="sm" className="bg-secondary text-secondary-foreground">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">이메일</label>
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  placeholder="이메일"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">전화번호</label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="전화번호"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">위치</label>
                <Input
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="위치"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">LinkedIn</label>
                <Input
                  value={editData.linkedin}
                  onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">GitHub</label>
                <Input
                  value={editData.github}
                  onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">소개</label>
              <Textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="자기소개"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">기술 스택</label>
              <Textarea
                value={editData.skills}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                placeholder="기술 스택 (쉼표로 구분)"
                rows={2}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">이메일</p>
                <p className="mt-1 text-foreground">{profileData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">전화번호</p>
                <p className="mt-1 text-foreground">{profileData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">위치</p>
                <p className="mt-1 text-foreground">{profileData.location}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">소개</p>
              <p className="mt-2 leading-relaxed text-foreground">{profileData.bio}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">기술 스택</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileData.skills.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 border-t border-border pt-4">
              {profileData.github && (
                <a
                  href={profileData.github.startsWith("http") ? profileData.github : `https://${profileData.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {profileData.linkedin && (
                <a
                  href={
                    profileData.linkedin.startsWith("http") ? profileData.linkedin : `https://${profileData.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

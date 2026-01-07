"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  birthdate: string // Added birthdate field separate from bio
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
      setEditData({ ...editData, profileImage: data.url })
    } catch (error) {
      console.error("Upload error:", error)
      alert("파일 업로드에 실패했습니다")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="mb-12 border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="relative flex-shrink-0">
            <div className="flex h-96 w-64 flex-col border-2 border-black p-4 bg-white">
              <div className="relative flex-1 overflow-hidden border-2 border-black bg-muted">
                {editData.profileImage ? (
                  <img
                    src={editData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="mt-2 text-center text-xl font-black tracking-tighter uppercase italic">
                {profileData.name || "NAME HERE"}
              </div>
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

          <div className="flex-1 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-4xl font-black uppercase italic"
                  placeholder="이름"
                />
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="text-2xl font-black uppercase italic"
                  placeholder="직책"
                />
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
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">생년월일</label>
                    <Input
                      value={editData.birthdate}
                      onChange={(e) => setEditData({ ...editData, birthdate: e.target.value })}
                      placeholder="2000/11/11"
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
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight tracking-tighter uppercase italic text-foreground md:text-6xl">
                  {profileData.title || "준비된 신입사원"}
                </h1>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">생년월일</p>
                    <p className="mt-1 text-foreground">{profileData.birthdate || "-"}</p>
                  </div>
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
                      href={
                        profileData.github.startsWith("http") ? profileData.github : `https://${profileData.github}`
                      }
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
                        profileData.linkedin.startsWith("http")
                          ? profileData.linkedin
                          : `https://${profileData.linkedin}`
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
          </div>

          {isAuthenticated && (
            <div className="flex gap-2 self-start">
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
      </CardContent>
    </Card>
  )
}

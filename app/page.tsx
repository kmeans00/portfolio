"use client"

import { useState, useEffect } from "react"
import { ProfileSection } from "@/components/profile-section"
import { ProjectsSection } from "@/components/projects-section"
import { AuthGuard } from "@/components/auth-guard"

interface ProfileData {
  name: string; title: string; email: string; phone: string;
  location: string; birthdate: string; bio: string;
  skills: string; github: string; linkedin: string; profileImage?: string;
}

// 🚩 중요: 초기값을 null 대신 아래 기본 객체로 설정합니다.
const DEFAULT_PROFILE: ProfileData = {
  name: "", title: "", email: "", phone: "",
  location: "", birthdate: "", bio: "",
  skills: "", github: "", linkedin: "", profileImage: "",
};

export default function PortfolioPage() {
  // useState를 null이 아닌 DEFAULT_PROFILE로 시작
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          if (data.profile) setProfileData(data.profile)
          if (data.projects) setProjects(data.projects)
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleUpdateProfile = async (newData: ProfileData) => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: newData, projects }),
      })
      if (response.ok) setProfileData(newData)
    } catch (error) { alert("저장 실패") }
  }

  const handleUpdateProjects = async (newProjects: any[]) => {
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profileData, projects: newProjects }),
      })
      setProjects(newProjects)
    } catch (error) { alert("저장 실패") }
  }

  if (isLoading) return <div className="p-10 text-center">데이터를 불러오는 중...</div>

  return (
    <AuthGuard>
      {(isAuthenticated) => (
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <ProfileSection
              profileData={profileData}
              onUpdateProfile={handleUpdateProfile}
              isAuthenticated={isAuthenticated}
            />
            <ProjectsSection
              projects={projects}
              onUpdateProjects={handleUpdateProjects}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
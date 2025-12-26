"use client"

import { useEffect, useState } from "react"
import { ProfileSection } from "@/components/profile-section"
import { ProjectsSection } from "@/components/projects-section"
import { AuthGuard } from "@/components/auth-guard"

type ProfileData = {
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

export default function PortfolioPage() {
  const [loaded, setLoaded] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    profileImage: "",
  })

  const [projects, setProjects] = useState<any[]>([])

  // 최초 1회: 서버에서 불러오기
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" })
        const data = await res.json()

        if (data?.profile) setProfileData(data.profile)
        if (Array.isArray(data?.projects)) setProjects(data.projects)
      } catch (e) {
        console.error("Failed to load portfolio:", e)
      } finally {
        setLoaded(true)
      }
    })()
  }, [])

  // 저장 함수: profile/projects가 바뀐 결과를 서버에 PUT
  const saveToServer = async (nextProfile: ProfileData, nextProjects: any[]) => {
    try {
      await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: nextProfile, projects: nextProjects }),
      })
    } catch (e) {
      console.error("Failed to save portfolio:", e)
    }
  }

  const handleUpdateProfile = (nextProfile: ProfileData) => {
    setProfileData(nextProfile)
    if (loaded) void saveToServer(nextProfile, projects)
  }

  const handleUpdateProjects = (nextProjects: any[]) => {
    setProjects(nextProjects)
    if (loaded) void saveToServer(profileData, nextProjects)
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-xl border border-border bg-card p-8 text-foreground">
            불러오는 중...
          </div>
        </div>
      </div>
    )
  }

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

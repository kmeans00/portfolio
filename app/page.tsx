"use client"

import { useState, useEffect } from "react"
import { ProfileSection } from "@/components/profile-section"
import { ProjectsSection } from "@/components/projects-section"

interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  birthdate: string
  bio: string
  skills: string
  github: string
  linkedin: string
  profileImage?: string
}

const DEFAULT_PROFILE: ProfileData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  birthdate: "",
  bio: "",
  skills: "",
  github: "",
  linkedin: "",
  profileImage: "",
}

export default function PortfolioPage() {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data/profile.json")

        if (!response.ok) {
          throw new Error("profile.json을 불러오지 못했습니다.")
        }

        const data = await response.json()

        if (data.profile) setProfileData(data.profile)
        if (data.projects) setProjects(data.projects)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
        console.error("데이터 로딩 실패22")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpdateProfile = async () => {
    alert("GitHub Pages 배포 버전에서는 수정 기능을 사용할 수 없습니다.")
  }

  const handleUpdateProjects = async () => {
    alert("GitHub Pages 배포 버전에서는 수정 기능을 사용할 수 없습니다.")
  }

  if (isLoading) {
    return <div className="p-10 text-center">데이터를 불러오는 중...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <ProfileSection
          profileData={profileData}
          onUpdateProfile={handleUpdateProfile}
          isAuthenticated={false}
        />

        <ProjectsSection
          projects={projects}
          onUpdateProjects={handleUpdateProjects}
          isAuthenticated={false}
        />
      </div>
    </div>
  )
}
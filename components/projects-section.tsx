"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { ProjectForm } from "@/components/project-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export interface Project {
  id: number
  title: string
  description: string
  tech: string
  keyFeatures?: string // Added keyFeatures field for main feature list
  imageUrl: string
  videoUrl?: string
  githubUrl?: string
  pdfUrl?: string
  year: string
}

interface ProjectsSectionProps {
  projects: Project[]
  onUpdateProjects: (projects: Project[]) => void
  isAuthenticated: boolean
}

export function ProjectsSection({ projects, onUpdateProjects, isAuthenticated }: ProjectsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddProject = (project: Omit<Project, "id">) => {
    const newProject = {
      ...project,
      id: Date.now(),
    }
    onUpdateProjects([...projects, newProject])
    setIsAdding(false)
  }

  const handleUpdateProject = (id: number, updatedProject: Omit<Project, "id">) => {
    onUpdateProjects(projects.map((p) => (p.id === id ? { ...updatedProject, id } : p)))
  }

  const handleDeleteProject = (id: number) => {
    onUpdateProjects(projects.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">프로젝트</h2>
        {isAuthenticated && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            프로젝트 추가
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {isAdding && <ProjectForm onSave={handleAddProject} onCancel={() => setIsAdding(false)} />}

        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={(updated) => handleUpdateProject(project.id, updated)}
            onDelete={() => handleDeleteProject(project.id)}
            isAuthenticated={isAuthenticated}
          />
        ))}

        {projects.length === 0 && !isAdding && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">아직 등록된 프로젝트가 없습니다.</p>
            {isAuthenticated && (
              <p className="mt-2 text-sm text-muted-foreground">
                {"위의 '프로젝트 추가' 버튼을 클릭하여 첫 프로젝트를 등록하세요."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

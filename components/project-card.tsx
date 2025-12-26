"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/project-form"
import { Pencil, Trash2, Github, FileText } from "lucide-react"
import Image from "next/image"
import type { Project } from "./projects-section"

interface ProjectCardProps {
  project: Project
  onUpdate: (project: Omit<Project, "id">) => void
  onDelete: () => void
  isAuthenticated: boolean
}

export function ProjectCard({ project, onUpdate, onDelete, isAuthenticated }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (updatedProject: Omit<Project, "id">) => {
    onUpdate(updatedProject)
    setIsEditing(false)
  }

  if (isEditing) {
    return <ProjectForm initialData={project} onSave={handleSave} onCancel={() => setIsEditing(false)} />
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        <div className="grid gap-6 md:grid-cols-5">
          {/* 왼쪽: 이미지 또는 비디오 */}
          <div className="relative h-64 bg-muted md:col-span-2 md:h-auto">
            {project.videoUrl ? (
              <div className="h-full w-full">
                {project.videoUrl.includes("youtube.com") || project.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={project.videoUrl.replace("watch?v=", "embed/")}
                    title={project.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={project.videoUrl} controls className="h-full w-full object-cover">
                    {"브라우저가 동영상을 지원하지 않습니다."}
                  </video>
                )}
              </div>
            ) : (
              <Image src={project.imageUrl || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            )}
          </div>

          {/* 오른쪽: 프로젝트 정보 */}
          <div className="flex flex-col justify-between p-6 md:col-span-3">
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.year}</p>
                </div>
                {isAuthenticated && (
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={onDelete}
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <p className="mb-4 leading-relaxed text-foreground">{project.description}</p>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">사용 기술</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.split(",").map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {project.pdfUrl && (
                  <a
                    href={project.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    프로젝트 문서
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

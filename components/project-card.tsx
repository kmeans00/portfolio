"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/project-form"
import { Pencil, Trash2, Github, FileText, X, ChevronDown, ChevronUp } from "lucide-react"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showKeyFeatures, setShowKeyFeatures] = useState(false)

  const handleSave = (updatedProject: Omit<Project, "id">) => {
    onUpdate(updatedProject)
    setIsEditing(false)
  }

  if (isEditing) {
    return <ProjectForm initialData={project} onSave={handleSave} onCancel={() => setIsEditing(false)} />
  }

  return (
    <>
      <Card className="overflow-hidden border-border bg-white shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <div className="grid gap-0 md:grid-cols-5">
            {/* 왼쪽: 이미지 또는 비디오 */}
            <div className="relative h-64 bg-muted md:col-span-2 md:h-auto border-r border-border">
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

            <div className="md:col-span-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full text-left p-8 hover:bg-muted/30 transition-colors cursor-pointer"
                type="button"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-1 text-2xl font-bold text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.year}</p>
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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

                <p className="leading-relaxed text-foreground line-clamp-2">{project.description}</p>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech
                      .split(",")
                      .slice(0, 3)
                      .map((tech, index) => (
                        <span
                          key={index}
                          className="rounded-md bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    {project.tech.split(",").length > 3 && (
                      <span className="rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                        +{project.tech.split(",").length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {project.githubUrl && (
                    <span className="flex items-center gap-2 text-sm text-accent">
                      <Github className="h-4 w-4" />
                      GitHub
                    </span>
                  )}
                  {project.pdfUrl && (
                    <span className="flex items-center gap-2 text-sm text-accent">
                      <FileText className="h-4 w-4" />
                      프로젝트 문서
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">{project.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{project.year}</p>
              </div>
              <Button onClick={() => setIsModalOpen(false)} variant="ghost" size="sm" className="hover:bg-muted">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {(project.imageUrl || project.videoUrl) && (
                <div className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
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
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">프로젝트 설명</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.keyFeatures && project.keyFeatures.trim() && (
                <div>
                  <button
                    onClick={() => setShowKeyFeatures(!showKeyFeatures)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    type="button"
                  >
                    <h3 className="text-lg font-semibold text-foreground">주요 기능</h3>
                    {showKeyFeatures ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {showKeyFeatures && (
                    <div className="mt-3 pl-4 space-y-2">
                      {project.keyFeatures
                        .split("\n")
                        .filter((feature) => feature.trim())
                        .map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                            <p className="text-foreground leading-relaxed">{feature.trim()}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">사용 기술</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.split(",").map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {(project.githubUrl || project.pdfUrl) && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">관련 링크</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground"
                      >
                        <Github className="h-4 w-4" />
                        GitHub 저장소
                      </a>
                    )}
                    {project.pdfUrl && (
                      <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-foreground"
                      >
                        <FileText className="h-4 w-4" />
                        프로젝트 문서
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

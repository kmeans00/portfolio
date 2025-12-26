"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lock } from "lucide-react"

interface AuthGuardProps {
  children: (isAuthenticated: boolean) => ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (pin === "2421") {
      setIsAuthenticated(true)
      setIsOpen(false)
      setPin("")
      setError("")
    } else {
      setError("잘못된 PIN입니다")
      setPin("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        {isAuthenticated ? (
          <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Lock className="h-4 w-4" />
            로그아웃
          </Button>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Lock className="h-4 w-4" />
                관리자
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>관리자 로그인</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin()
                      }
                    }}
                    placeholder="PIN 입력 (4자리)"
                    className="text-center text-2xl tracking-widest"
                  />
                  {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                </div>
                <Button onClick={handleLogin} className="w-full">
                  로그인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {children(isAuthenticated)}
    </>
  )
}

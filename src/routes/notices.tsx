import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/notices")({
  component: Component,
})

type Notice = {
  id: string
  title: string
  content: string
  createdAt: Date
}

function Component() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleAddNotice = () => {
    if (!title.trim() && !content.trim()) {
      return
    }

    const newNotice: Notice = {
      id: crypto.randomUUID(),
      title: title.trim() || "お知らせ",
      content: content.trim(),
      createdAt: new Date(),
    }

    setNotices((prev) => [newNotice, ...prev])
    setTitle("")
    setContent("")
  }

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id))
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-4xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">お知らせ管理</h1>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">新規お知らせを追加</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                タイトル
              </label>
              <Input
                id="title"
                type="text"
                placeholder="お知らせのタイトルを入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                内容
              </label>
              <Textarea
                id="content"
                placeholder="お知らせの内容を入力"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button onClick={handleAddNotice} className="w-full h-11 text-base font-semibold">
              追加
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            お知らせ一覧 ({notices.length}件)
          </h2>
          {notices.length === 0 ? (
            <Card className="shadow-md">
              <CardContent className="p-12 text-center text-muted-foreground">
                <p className="text-lg">まだお知らせがありません</p>
              </CardContent>
            </Card>
          ) : (
            notices.map((notice) => (
              <Card key={notice.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        {notice.createdAt.toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <h3 className="text-xl font-bold leading-tight">{notice.title}</h3>
                      {notice.content && (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                          {notice.content}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="shrink-0"
                    >
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

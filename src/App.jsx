import "./App.css"
import { Routes, Route, Navigate } from "react-router-dom"

import { ArticlePage } from "./pages/ArticlePage"
import { SinglePage } from "./pages/SinglePage"
import { CreateEditArticlePage } from "./pages/CreateEditArticlePage"
import { SigninPage } from "./pages/SigninPage"
import { LoginPage } from "./pages/LoginPage"
import { EditprofilePage } from "./pages/EditprofilePage"

import { Layout } from "./Components/Layout"

import { RequireAuth } from "./hoc/RequireAuth"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ArticlePage />} />
        <Route path="articles" element={<Navigate to="/" replace />} />
        <Route path="articles/:slug" element={<SinglePage />} />
        <Route path="/sign-up" element={<LoginPage />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route
          path="/create_article"
          element={
            <RequireAuth>
              <CreateEditArticlePage key="create" />
            </RequireAuth>
          }
        />
        <Route
          path="/articles/:slug/edit"
          element={
            <RequireAuth>
              <CreateEditArticlePage key="edit" />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <RequireAuth>
              <EditprofilePage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}

export default App

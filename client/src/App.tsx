import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { ProtectedRoute } from "./components/protectedRoute";
import LoginPage from "./app/(auth-pages)/login/page";
import SignUpPage from "./app/(auth-pages)/signup/page";
import { Home } from "./app/page";
import { ProtectedBoard } from "./components/protectedBoard";
import { KanbanBoard } from "./components/kanban-board";
import Navbar from "./components/ui/navbar";
import { NotificationsPage } from "./components/notification/page";

function BoardWrapper() {
  const { boardId } = useParams();
  return (
    <ProtectedBoard boardId={parseInt(boardId!) || 0}>
      <Navbar />
      <KanbanBoard boardId={parseInt(boardId!) || 0} />
    </ProtectedBoard>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board/:boardId"
            element={
              <ProtectedRoute>
                <BoardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Navbar />
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

import Hamburger from "./components/Common/Hamburger";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLayout } from "./Redux/userSlice";
import { useEffect } from "react";
import Login from "./pages/Login";
import ProtectedRoute from "./components/Common/ProtectRoute";
import PublicRoute from "./components/Common/PublicRoute";

function Main({ socket }) {
    const dispatch = useDispatch();
    const { layout } = useSelector((state) => state.Chat);
    // screen size change
    const handleResize = () => {
        if (window.innerWidth < 768) {
            if (layout === "both")
                dispatch(setLayout("contacts"));
        } else {
            dispatch(setLayout("both"));
        }
    };

    useEffect(() => {
        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }), [dispatch];
    return (
        <div className={`h-screen w-screen flex overflow-y-hidden `}>

            <Routes>
                {/* Public Routes */}
                <Route path="/Login" element={
                     <PublicRoute>
                        <Login />
                     </PublicRoute>
                } />
                <Route path="/" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />

                {/* Protected Routes */}
                <Route path="/chat" element={
                    // <ProtectedRoute>
                    <>
                        <Hamburger />
                        <Contact socket={socket} />
                        <Chat socket={socket} />
                        </>
                    // </ProtectedRoute>
                } />
                <Route path="/contact" element={
                    // <ProtectedRoute>
                        <Contact socket={socket} />
                    // </ProtectedRoute>
                } />
                <Route path="/chats" element={
                    // <ProtectedRoute>
                        <Chat socket={socket} />
                    // </ProtectedRoute>
                } />
            </Routes>

        </div>
    )
}
export default Main;
import Hamburger from "./Hamburger";
import Chat from "./Chat";
import Contact from "./Contact";
import { Routes, Route} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLayout } from "../Redux/globalSlice";
import { useEffect } from "react";
import Login from "./Login";
function Main({socket}){
    const dispatch=useDispatch();
    const {layout} = useSelector((state) => state.Chat);
    // screen size change
    const handleResize = () => {
        if (window.innerWidth < 768) {
            if(layout==="both")
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
    }),[dispatch];
    return(
        <div className={`h-screen w-screen flex overflow-y-hidden `}>
            
                <Routes>
                    <Route path="/chat" element={<>
                    <Hamburger/>
                     <Contact socket={socket}/>
                      <Chat socket={socket}/>
                    </>}/>
                    <Route path="/contact" element={
                    <Contact socket={socket}/>}/>
                    <Route path="/chats" element={<Chat socket={socket}/>}/>
                    <Route path="/" element={
                    <Login/>}/>
                </Routes>
               
        </div>
    )
}
export default Main;
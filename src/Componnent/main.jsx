import Hamburger from "./Hamburger";
import Chat from "./Chat";
import Contact from "./Contact";
import { Routes, Route} from "react-router-dom";
import Login from "./Login";
function Main({socket}){
    
    return(
        <div className="h-screen w-screen flex overflow-y-hidden">
            
                <Routes>
                    <Route path="/chat" element={<>
                    <Hamburger/>
                     <Contact socket={socket}/>
                      <Chat socket={socket}/>
                    </>}/>
                    <Route path="/contact" element={
                    <Contact socket={socket}/>}/>
                    <Route path="/" element={
                    <Login/>}/>
                </Routes>
               
        </div>
    )
}
export default Main;
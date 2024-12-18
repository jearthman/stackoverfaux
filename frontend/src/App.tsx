import NavBar from "./components/nav-bar";
import SideBar from "./components/side-bar";
import { Outlet } from "react-router";
function App() {
  return (
    <div className="h-screen max-h-screen w-screen bg-zinc-50 flex flex-col">
      <NavBar />
      <div className="flex flex-grow lg:w-1/2 mx-auto h-full overflow-hidden">
        <SideBar />
        <div className="flex-grow overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;


import Header from '@/components/commons/Header';
import PilotSideBar from '@/components/commons/PilotSideBar';
import ProjectsMain from '@/components/PilotProject/ProjectsMain';


const Projects = () => {
 
    return (
      <div className="flex">
      <PilotSideBar />
      {/* outer wrapper */}
      <div className='flex flex-col flex-1 overflow-y-auto  h-screen'>
        <Header />

        {/* Main page container */}
        <div className=" bg-gray-100 h-full max-sm:pt-4 max-sm:px-1 max-md:p-5 p-7">
          <h1 className="md:text-2xl text-lg max-sm:px-3 font-semibold mb-5  opacity-70">Projects</h1>

            <ProjectsMain />
  
          </div>
  
  
        </div>
  
      </div>
    );
}

export default Projects;

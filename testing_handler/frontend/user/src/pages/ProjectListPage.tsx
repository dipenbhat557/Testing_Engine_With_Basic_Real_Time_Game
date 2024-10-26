import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import ContestList from '../components/ContestList';
import Footer from '../components/Footer';

export interface Project {
  id: string;
  username: string;
  testFileUrl: string;
  envs: string[];
}

const ProjectListPage = () => {

  return (
    <div >
      <Navbar showAdmin={true}/>
      <Hero />
      <div className='h-[200px]'/>
      
      <div className=" flex justify-between gap-9  mt-3 w-[90%] mx-auto">
        <ContestList />
      </div>
      <Footer/>
    </div>
  );
};

export default ProjectListPage;

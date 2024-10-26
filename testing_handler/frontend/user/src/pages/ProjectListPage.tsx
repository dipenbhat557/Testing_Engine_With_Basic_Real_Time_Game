import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Hero from '../components/Hero';
import ProjectList from '../components/ProjectList';
import { hero, logo } from '../assets';
import Navbar from '../components/Navbar';
import ContestCards from '../components/ContestCards';
import ContestList from '../components/ContestList';
import Slider from '../components/Slider';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Footer from '../components/Footer';

export interface Project {
  id: string;
  username: string;
  testFileUrl: string;
  envs: string[];
}

const ProjectListPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); 

  const fetchProjects = async (page: number) => {
    try {
      console.log("url is ",`${import.meta.env.VITE_API_URL}/tests?page=${page}&pageSize=${pageSize}`)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tests?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      console.log("data is ",data)
      setProjects(data.data);  
      setTotalPages(data.totalPages);  
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    console.log("url from list is ",import.meta.env.VITE_API_URL)
    fetchProjects(currentPage);
  }, [currentPage]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  // return (
  //   <div >
  //     <Hero/>
  //     <ProjectList projects={projects} totalPages={totalPages} currentPage={currentPage} handleProjectClick={handleProjectClick} handlePageChange={handlePageChange}  />


  return (
    <div >
      <Navbar />
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

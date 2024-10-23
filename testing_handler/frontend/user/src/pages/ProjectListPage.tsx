import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

interface Project {
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
    fetchProjects(currentPage);
  }, [currentPage]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="grid grid-cols-1 gap-4">
        {projects.map(project => (
          <div
            key={project.id}
            className="p-4 border rounded-lg shadow-md cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            <h2 className="text-xl">{`Test by ${project.username}`}</h2>
            <p className="text-gray-600">{`Test File: ${project.testFileUrl}`}</p>
            <p className="text-gray-600">{`Environments: ${project.envs.join(', ')}`}</p> 
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProjectListPage;

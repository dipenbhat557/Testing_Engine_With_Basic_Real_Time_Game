import React from 'react'
import { Project } from '../pages/ProjectListPage'
import Pagination from './Pagination'

const ProjectList = ({projects,totalPages,currentPage, handleProjectClick,handlePageChange}:{projects:Project[], totalPages:number,currentPage:number, handleProjectClick:(id:string)=>void, handlePageChange:any}) => {
  return (
    <>
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
    </>
  )
}

export default ProjectList